import { NextResponse } from "next/server";
import {
  recordPurchase,
  recordSend,
  sentKeysFor,
  upsertSubscriber,
} from "@/lib/db";
import { mailerConfigured, sendSequenceEmail } from "@/lib/mailer";
import {
  WORKBOOK_FOOTER_REASON,
  workbookDeliveryEmail,
} from "@/lib/purchase-email";
import { verifyStripeSignature } from "@/lib/stripe-webhook";

/**
 * Stripe webhook — delivers the workbook when a payment clears.
 *
 * Endpoint configured at https://dashboard.stripe.com/webhooks:
 *
 *   URL     https://cartercoleandassociates.com/api/stripe/webhook
 *   Event   checkout.session.completed
 *   Secret  -> STRIPE_WEBHOOK_SECRET
 *
 * Two properties carry the weight here:
 *
 *   Authenticity — the signature is verified before a single field is read
 *   out of the body. Without that, this URL is a free-workbook button for
 *   anyone who finds it.
 *
 *   Idempotency — Stripe retries for up to three days on any non-2xx and may
 *   deliver the same event twice regardless. The purchase is keyed on the
 *   Stripe event id and the email on (subscriber, "workbook-delivery"), so a
 *   repeat delivery records nothing new and sends nothing twice.
 */

export const dynamic = "force-dynamic";

/** Overridable per Payment Link by setting `product` in its metadata. */
const DEFAULT_PRODUCT = "workbook";

export async function POST(request: Request) {
  // Must be the raw text. Parsing to JSON and re-stringifying reorders keys
  // and changes whitespace, and then the signature never matches.
  const rawBody = await request.text();

  const result = verifyStripeSignature(
    rawBody,
    request.headers.get("stripe-signature"),
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (!result.ok) {
    // 400 tells Stripe not to retry — a bad signature will still be bad next
    // time. The reason is logged; the body never is.
    console.error("[stripe] rejected webhook:", result.reason);
    return NextResponse.json(
      { ok: false, error: "signature verification failed" },
      { status: 400 }
    );
  }

  const event = result.event;

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object;

  // A completed session can still be unpaid — bank debits take days to clear.
  // Only fulfil once the money is actually there.
  if (session.payment_status && session.payment_status !== "paid") {
    console.log(
      `[stripe] ${event.id} not yet paid (${session.payment_status}) — waiting`
    );
    return NextResponse.json({ ok: true, pending: true });
  }

  const email = session.customer_details?.email?.trim();
  if (!email) {
    // Nothing to deliver to, and retrying will not produce an address.
    console.error(`[stripe] ${event.id} has no customer email — cannot fulfil`);
    return NextResponse.json({ ok: true, skipped: "no email" });
  }

  const fullName = session.customer_details?.name?.trim() || "";
  const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
  const product = session.metadata?.product || DEFAULT_PRODUCT;

  try {
    // Buyers join the list so they can be emailed and appear in the admin
    // dashboard. An existing subscriber is reused, not duplicated, and their
    // sequence position is left exactly where it was.
    const { subscriber } = await upsertSubscriber({
      email,
      firstName: firstName || "there",
      lastName: rest.length ? rest.join(" ") : undefined,
      source: `purchase:${product}`,
    });

    const { isNew } = await recordPurchase({
      eventId: event.id,
      subscriberId: subscriber.id,
      product,
      amountCents: session.amount_total ?? null,
      currency: session.currency ?? null,
    });

    if (!isNew) {
      console.log(`[stripe] ${event.id} already processed — no action`);
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Recorded in `sends`, so a Stripe retry after a mail outage re-attempts
    // delivery while a retry after success does not resend.
    const alreadySent = await sentKeysFor(subscriber.id);
    if (alreadySent.includes(workbookDeliveryEmail.key)) {
      return NextResponse.json({ ok: true, alreadyDelivered: true });
    }

    if (!mailerConfigured()) {
      // The purchase is safely recorded and the download link works, so no
      // money is lost — but a buyer is waiting on an email that cannot go
      // out. Loud, and a 500 so Stripe keeps retrying until SMTP is fixed.
      console.error(
        `[stripe] ${event.id} PAID but SMTP is not configured — ${email} is waiting for the workbook`
      );
      return NextResponse.json(
        { ok: false, error: "mailer not configured" },
        { status: 500 }
      );
    }

    try {
      await sendSequenceEmail(workbookDeliveryEmail, subscriber, {
        reason: WORKBOOK_FOOTER_REASON,
      });
      await recordSend(subscriber.id, workbookDeliveryEmail.key, "sent");
      console.log(`[stripe] ${event.id} delivered ${product} to ${email}`);
      return NextResponse.json({ ok: true, delivered: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      await recordSend(
        subscriber.id,
        workbookDeliveryEmail.key,
        "failed",
        message
      );
      console.error(`[stripe] ${event.id} send failed:`, message);
      // 500 so Stripe retries. The purchase row already exists, so the retry
      // short-circuits straight to the send and cannot double-record.
      return NextResponse.json(
        { ok: false, error: "delivery failed" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[stripe] handler error:", err);
    return NextResponse.json(
      { ok: false, error: "handler error" },
      { status: 500 }
    );
  }
}
