import { NextResponse } from "next/server";
import {
  activeSubscribers,
  recordSend,
  sentKeysForAll,
  sendsInLast24h,
  type Subscriber,
} from "@/lib/db";
import { sequence } from "@/lib/sequence";
import {
  sendSequenceEmail,
  mailerConfigured,
  dailySendLimit,
  sendThrottleMs,
  wait,
} from "@/lib/mailer";

export const dynamic = "force-dynamic";
// Vercel Hobby caps serverless functions at 60s; Pro allows up to 300s.
// The run stops itself gracefully before the ceiling either way, and picks up
// where it left off next time — every send is recorded uniquely, so nothing
// is ever sent twice and nothing is skipped.
export const maxDuration = 300;
const TIME_BUDGET_MS = Number(process.env.CRON_TIME_BUDGET_MS || 45_000);

/**
 * Sends every sequence email that is due and not yet sent.
 *
 * Call this on a schedule — once an hour is plenty:
 *
 *   Linux cron:
 *     0 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" \
 *       https://cartercoleandassociates.com/api/cron/dispatch
 *
 *   Windows Task Scheduler:
 *     powershell -Command "Invoke-WebRequest -Uri https://.../api/cron/dispatch
 *       -Headers @{Authorization='Bearer YOUR_SECRET'}"
 *
 *   Vercel: add to vercel.json → { "crons": [{ "path": "/api/cron/dispatch",
 *           "schedule": "0 * * * *" }] }
 *
 * Protected by CRON_SECRET. Idempotent: running it twice in a row sends
 * nothing the second time, because every send is recorded uniquely per
 * (subscriber, email). Safe to run as often as you like.
 */

function daysSince(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const url = new URL(request.url);
  return (
    header === `Bearer ${secret}` || url.searchParams.get("secret") === secret
  );
}

async function dispatch(dryRun: boolean) {
  const results: {
    email: string;
    emailKey: string;
    status: "sent" | "failed" | "due" | "deferred";
    error?: string;
  }[] = [];

  const subs = await activeSubscribers();
  const sentBySubscriber = await sentKeysForAll();

  // Google enforces a hard daily cap (2,000/day on Workspace, ~500 on free
  // Gmail and trial accounts). Blowing through it locks the account out of
  // sending for 24 hours — including the contact form. So we stop short of
  // our own limit and pick the rest up on the next run; nobody is skipped,
  // they are just deferred a day.
  const alreadySentToday = dryRun ? 0 : await sendsInLast24h();
  let budget = Math.max(0, dailySendLimit() - alreadySentToday);
  const throttle = sendThrottleMs();
  const startedAt = Date.now();
  let deferred = 0;
  let outOfTime = false;

  for (const sub of subs as Subscriber[]) {
    const age = daysSince(sub.created_at);
    const sent = sentBySubscriber.get(sub.id) ?? new Set<string>();

    for (const email of sequence) {
      if (sent.has(email.key)) continue;
      if (age < email.dayOffset) continue;

      if (dryRun) {
        results.push({ email: sub.email, emailKey: email.key, status: "due" });
        continue;
      }

      if (!outOfTime && Date.now() - startedAt > TIME_BUDGET_MS) {
        outOfTime = true;
      }

      if (budget <= 0 || outOfTime) {
        deferred++;
        results.push({
          email: sub.email,
          emailKey: email.key,
          status: "deferred",
          error: outOfTime
            ? "Run out of time; will go out on the next run."
            : "Daily send limit reached; will go out on the next run.",
        });
        break;
      }

      try {
        await sendSequenceEmail(email, sub);
        await recordSend(sub.id, email.key, "sent");
        budget--;
        results.push({ email: sub.email, emailKey: email.key, status: "sent" });
        // Pace the run so Google doesn't see it as a burst.
        if (throttle > 0) await wait(throttle);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown error";
        await recordSend(sub.id, email.key, "failed", msg);
        results.push({
          email: sub.email,
          emailKey: email.key,
          status: "failed",
          error: msg,
        });
      }

      // Only one email per subscriber per run, so a subscriber who joined
      // long ago doesn't receive the whole sequence in one burst.
      break;
    }
  }

  return { results, deferred, outOfTime };
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Set CRON_SECRET and pass it." },
      { status: 401 }
    );
  }

  const dryRun = new URL(request.url).searchParams.get("dry") === "1";

  if (!dryRun && !mailerConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SMTP is not configured; nothing was sent." },
      { status: 503 }
    );
  }

  const { results, deferred, outOfTime } = await dispatch(dryRun);

  return NextResponse.json({
    ok: true,
    dryRun,
    processed: results.length,
    sent: results.filter((r) => r.status === "sent").length,
    failed: results.filter((r) => r.status === "failed").length,
    deferred,
    outOfTime,
    dailyLimit: dailySendLimit(),
    results,
  });
}

export const POST = GET;
