import { upsertSubscriber } from "./db";
import { syncToAudience } from "./audience";
import { notifyNewLead, type LeadAlert } from "./notify";

/**
 * One entry point for every lead the site captures.
 *
 * Whatever the source — checklist opt-in, contact form, JotForm intake,
 * Calendly booking, workbook purchase — it lands here and gets the same four
 * things done to it:
 *
 *   1. stored in Supabase (the system of record)
 *   2. pushed to the single Resend audience, tagged by source
 *   3. alerted to the office by email and SMS
 *   4. attributed to a campaign, if the visitor arrived from one
 *
 * The steps are independent and individually guarded. A Resend outage
 * cannot stop the alert; a Twilio outage cannot stop the storage. The only
 * failure that matters is step 1, and that is the one the caller is told
 * about — everything else degrades quietly and is repairable afterwards from
 * the dashboard.
 *
 * Every credential involved is optional. With none of them set the site still
 * runs and still stores leads; each one added switches its own step on.
 */

export type LeadKind = LeadAlert["kind"];

export type CaptureInput = {
  kind: LeadKind;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  topic?: string;
  message?: string;
  /** Short slug identifying the form, e.g. "checklist" or "footer". */
  source: string;
  /** Path the form lives on, for the alert. */
  page?: string;
  utm?: Record<string, string>;
  extra?: Record<string, string | undefined>;
  /**
   * Whether this person asked to receive email. Contact forms and intakes are
   * a service request, not a marketing opt-in — only tick this where consent
   * was actually given.
   */
  subscribe?: boolean;
};

export type CaptureResult = {
  ok: boolean;
  /** Present when the lead was stored and a gated download applies. */
  token?: string;
  isNew?: boolean;
  audience: "synced" | "skipped" | "failed";
  stored: "stored" | "skipped" | "failed";
};

/** Which brand a lead belongs to. Both sites feed one audience, so the tag is
 *  what keeps them tellable apart in the list and in reporting. */
export const BRAND_TAG = "site-cartercole";
export const BRAND_NAME = "Carter Cole & Associates";

function tagsFor(input: CaptureInput) {
  const tags = [BRAND_TAG, `source-${input.source}`, `kind-${input.kind}`];
  const campaign = input.utm?.utm_campaign;
  if (campaign) tags.push(`campaign-${campaign}`.slice(0, 90));
  return tags;
}

export async function captureLead(
  input: CaptureInput
): Promise<CaptureResult> {
  const email = input.email.trim().toLowerCase();
  const result: CaptureResult = {
    ok: false,
    audience: "skipped",
    stored: "skipped",
  };

  // 1. Store. This is the only step allowed to fail the request, because it
  //    is the only one that cannot be reconstructed later.
  let token: string | undefined;
  try {
    const { subscriber, isNew } = await upsertSubscriber({
      email,
      firstName: input.firstName || input.email.split("@")[0],
      lastName: input.lastName,
      source: input.source,
    });
    token = subscriber.token;
    result.token = token;
    result.isNew = isNew;
    result.stored = "stored";
    result.ok = true;
  } catch (err) {
    console.error("[leads] storage failed:", err);
    result.stored = "failed";
  }

  // 2 and 3 run together — neither should wait on the other, and a visitor
  //    should not sit watching a spinner while two third parties are called.
  const [mc] = await Promise.all([
    input.subscribe === false
      ? Promise.resolve({ ok: false as const, skipped: true as const })
      : syncToAudience({
          email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          source: input.source,
          tags: tagsFor(input),
        }),
    notifyNewLead({
      kind: input.kind,
      name: [input.firstName, input.lastName].filter(Boolean).join(" ") || undefined,
      email,
      phone: input.phone,
      topic: input.topic,
      message: input.message,
      page: input.page,
      utm: input.utm,
      brand: BRAND_NAME,
      extra: input.extra,
    }),
  ]);

  if (mc.ok) result.audience = "synced";
  else if ("skipped" in mc && mc.skipped) result.audience = "skipped";
  else {
    result.audience = "failed";
    console.error(
      "[leads] audience sync failed:",
      "error" in mc ? mc.error : "unknown"
    );
  }

  return result;
}

/**
 * Campaign attribution.
 *
 * Reads the UTM parameters and Google/Meta click IDs a visitor arrived with.
 * The client script stashes these in sessionStorage on landing and replays
 * them into every form, so a lead that arrives four pages deep still carries
 * the campaign that produced it. Without this, paid traffic is unattributable
 * past the landing page and there is no honest way to judge an ad spend.
 */
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export function readAttribution(
  raw: unknown
): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const src = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = src[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, 200);
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Wait for background work, but never longer than `ms`.
 *
 * This exists because of how serverless hosting actually behaves. It is
 * tempting to fire the Mailchimp sync and the alert off without awaiting them
 * — the lead is already stored, so why make the visitor wait? On a long-lived
 * Node server that reasoning is correct. On Vercel and every other serverless
 * platform it is wrong: once the handler returns its response the function is
 * frozen or torn down, and any promise still in flight is simply abandoned.
 * No error, no log, no retry. The signup succeeds, the visitor gets their
 * download, and the contact silently never reaches the list.
 *
 * So the work is awaited — but bounded, so a third party having a bad day
 * cannot leave someone staring at a spinner. Normal case is a few hundred
 * milliseconds; worst case the visitor waits `ms` and the request completes
 * regardless, because storage already happened and is what actually matters.
 */
export async function settleWithin(
  ms: number,
  jobs: Promise<unknown>[]
): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cap = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, ms);
  });
  try {
    await Promise.race([Promise.allSettled(jobs).then(() => undefined), cap]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
