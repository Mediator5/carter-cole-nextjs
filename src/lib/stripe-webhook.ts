import crypto from "crypto";

/**
 * Stripe webhook signature verification.
 *
 * Deliberately implemented against Node's own crypto rather than pulling in
 * the `stripe` package. We never call the Stripe API from this app — we only
 * need to prove that an incoming POST really came from Stripe — and the whole
 * verification is thirty lines. That keeps the dependency list short (which
 * already mattered once here, when better-sqlite3 wouldn't build) and means
 * there is no API key to leak: the ONLY Stripe secret this project holds is
 * the webhook signing secret.
 *
 * Stripe sends a header shaped like:
 *
 *   Stripe-Signature: t=1492774577,v1=5257a869e7ec…,v0=6ffbb59b23…
 *
 * The signed payload is `${timestamp}.${rawBody}`, HMAC-SHA256'd with the
 * signing secret. Only the v1 scheme is valid in live mode — v0 appears on
 * test events and must be ignored, or an attacker could downgrade to it.
 *
 * Two things this guards against:
 *   - Forgery: without the secret you cannot produce a matching v1 signature,
 *     so nobody can POST a fake "payment succeeded" and be sent the workbook.
 *   - Replay: a captured-and-resent request is rejected once it falls outside
 *     the tolerance window, because the timestamp is inside the signed data
 *     and so can't be edited without breaking the signature.
 */

export type VerifyResult =
  | { ok: true; event: StripeEvent }
  | { ok: false; reason: string };

/** Only the fields this app actually reads. */
export type StripeEvent = {
  id: string;
  type: string;
  created: number;
  data: {
    object: {
      id?: string;
      amount_total?: number | null;
      currency?: string | null;
      payment_status?: string | null;
      status?: string | null;
      customer_details?: {
        email?: string | null;
        name?: string | null;
      } | null;
      metadata?: Record<string, string> | null;
    };
  };
};

const DEFAULT_TOLERANCE_SECONDS = 300;

/**
 * Verifies the header and parses the body.
 *
 * @param rawBody   The request body as received. It must be the untouched raw
 *                  text — parsing and re-stringifying the JSON changes the
 *                  bytes and the signature will not match.
 * @param header    The `Stripe-Signature` header value.
 * @param secret    The endpoint's signing secret (`whsec_…`).
 * @param nowSeconds Injectable clock, so the tolerance window is testable.
 */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string | undefined,
  {
    toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
    nowSeconds = Math.floor(Date.now() / 1000),
  }: { toleranceSeconds?: number; nowSeconds?: number } = {}
): VerifyResult {
  if (!secret) {
    return { ok: false, reason: "STRIPE_WEBHOOK_SECRET is not set" };
  }
  if (!header) {
    return { ok: false, reason: "missing Stripe-Signature header" };
  }

  let timestamp: string | null = null;
  const v1: string[] = [];

  for (const part of header.split(",")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key === "t") timestamp = value;
    // Ignore every scheme but v1. v0 is only ever sent for test events and
    // accepting it would let an attacker pick the weaker one.
    else if (key === "v1") v1.push(value);
  }

  if (!timestamp || !/^\d+$/.test(timestamp)) {
    return { ok: false, reason: "malformed timestamp in signature header" };
  }
  if (v1.length === 0) {
    return { ok: false, reason: "no v1 signature in header" };
  }

  const age = nowSeconds - Number(timestamp);
  if (Math.abs(age) > toleranceSeconds) {
    return { ok: false, reason: `timestamp outside tolerance (${age}s)` };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  // An endpoint can briefly carry two active secrets while a secret is being
  // rolled, so Stripe may send several v1 signatures. Any one matching is a
  // pass. Compared in constant time to avoid leaking bytes through timing.
  const matched = v1.some((candidate) => timingSafeEqual(candidate, expected));
  if (!matched) {
    return { ok: false, reason: "signature mismatch" };
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return { ok: false, reason: "body is not valid JSON" };
  }

  if (!event || typeof event.id !== "string" || typeof event.type !== "string") {
    return { ok: false, reason: "body is not a Stripe event" };
  }

  return { ok: true, event };
}

/**
 * Constant-time compare of two hex strings.
 *
 * crypto.timingSafeEqual throws when the buffers differ in length, and that
 * throw is itself an early exit — so length is checked first and the compare
 * only runs on equal-length input.
 */
function timingSafeEqual(a: string, b: string) {
  if (typeof a !== "string" || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}
