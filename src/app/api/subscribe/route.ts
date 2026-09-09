import { NextResponse } from "next/server";
import { upsertSubscriber, recordSend, sentKeysFor } from "@/lib/db";
import { sequence } from "@/lib/sequence";
import { sendSequenceEmail, mailerConfigured } from "@/lib/mailer";
import { syncToAudience } from "@/lib/audience";
import { notifyNewLead } from "@/lib/notify";
import {
  readAttribution,
  settleWithin,
  BRAND_TAG,
  BRAND_NAME,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Very small in-memory rate limit: 5 signups per IP per 10 minutes.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, website } = body ?? {};

    // Where the signup came from. Whitelisted so the column can't be filled
    // with arbitrary text by anyone posting to this endpoint directly.
    const SOURCES = [
      "checklist",
      "newsletter",
      "workbook",
      "footer",
      "inline",
      "exit",
      "resources",
      "services",
      "smarttaxiq",
      "home",
      "about",
      "business-services",
      "locations",
      "book",
      "contact",
    ];
    const source = SOURCES.includes(String(body?.source))
      ? String(body.source)
      : "checklist";

    // Honeypot: real people never fill a hidden field. Pretend success so
    // bots don't learn they were caught.
    if (website) return NextResponse.json({ ok: true });

    if (!firstName || String(firstName).trim().length < 1) {
      return NextResponse.json(
        { ok: false, error: "Please tell us your first name." },
        { status: 400 }
      );
    }
    // Trim before validating — pasted addresses very often carry a trailing
    // space or a stray newline, and rejecting those looks like a broken form.
    const cleanEmail = String(email ?? "").trim();
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json(
        { ok: false, error: "That email address doesn't look right." },
        { status: 400 }
      );
    }

    const { subscriber, isNew } = await upsertSubscriber({
      email: cleanEmail,
      firstName: String(firstName),
      lastName: lastName ? String(lastName) : undefined,
      source,
    });

    const downloadUrl = `/api/download/checklist?t=${subscriber.token}`;

    // Mirror to the mailing list and alert the office.
    //
    // Awaited, not fired and forgotten: on serverless hosting the function is
    // torn down the moment this handler returns, and an un-awaited promise is
    // abandoned mid-flight — which is exactly how a signup succeeds while the
    // contact never reaches Mailchimp. Bounded so a slow third party cannot
    // leave the visitor waiting.
    const utm = readAttribution(body?.attribution);
    await settleWithin(4000, [
      syncToAudience({
        email: cleanEmail,
        firstName: String(firstName),
        lastName: lastName ? String(lastName) : undefined,
        source,
        tags: [
          BRAND_TAG,
          `source-${source}`,
          "kind-checklist",
          ...(utm?.utm_campaign
            ? [`campaign-${utm.utm_campaign}`.slice(0, 90)]
            : []),
        ],
      }),
      notifyNewLead({
        kind: source === "newsletter" ? "newsletter" : "checklist",
        name: [firstName, lastName].filter(Boolean).join(" "),
        email: cleanEmail,
        page: typeof body?.page === "string" ? body.page : undefined,
        utm,
        brand: BRAND_NAME,
        extra: { Source: source, Returning: isNew ? "No" : "Yes" },
      }),
    ]);

    // Send email #1 immediately. A returning subscriber who already has it
    // still gets the download link back, but no duplicate email.
    const alreadySent = await sentKeysFor(subscriber.id);
    const first = sequence[0];
    let emailed = false;

    if (isNew || !alreadySent.includes(first.key)) {
      if (mailerConfigured()) {
        try {
          await sendSequenceEmail(first, subscriber);
          await recordSend(subscriber.id, first.key, "sent");
          emailed = true;
        } catch (err) {
          await recordSend(
            subscriber.id,
            first.key,
            "failed",
            err instanceof Error ? err.message : "unknown error"
          );
          // Deliberately not a hard failure: the subscriber is saved and the
          // download works, so a mail outage never costs you the lead.
          console.error("[subscribe] send failed:", err);
        }
      } else {
        console.warn(
          "[subscribe] SMTP not configured — subscriber saved, no email sent."
        );
      }
    }

    return NextResponse.json({
      ok: true,
      downloadUrl,
      emailed,
      returning: !isNew,
    });
  } catch (err) {
    console.error("[subscribe] error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
