import { NextResponse } from "next/server";
import {
  activeSubscribers,
  recordSend,
  sentKeysFor,
  type Subscriber,
} from "@/lib/db";
import { sequence } from "@/lib/sequence";
import { sendSequenceEmail, mailerConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Sends every sequence email that is due and not yet sent.
 *
 * Call this on a schedule — once an hour is plenty:
 *
 *   Linux cron:
 *     0 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" \
 *       https://cartercoleassociates.com/api/cron/dispatch
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
    status: "sent" | "failed" | "due";
    error?: string;
  }[] = [];

  const subs = activeSubscribers();

  for (const sub of subs as Subscriber[]) {
    const age = daysSince(sub.created_at);
    const sent = new Set(sentKeysFor(sub.id));

    for (const email of sequence) {
      if (sent.has(email.key)) continue;
      if (age < email.dayOffset) continue;

      if (dryRun) {
        results.push({ email: sub.email, emailKey: email.key, status: "due" });
        continue;
      }

      try {
        await sendSequenceEmail(email, sub);
        recordSend(sub.id, email.key, "sent");
        results.push({ email: sub.email, emailKey: email.key, status: "sent" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown error";
        recordSend(sub.id, email.key, "failed", msg);
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

  return results;
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

  const results = await dispatch(dryRun);

  return NextResponse.json({
    ok: true,
    dryRun,
    processed: results.length,
    sent: results.filter((r) => r.status === "sent").length,
    failed: results.filter((r) => r.status === "failed").length,
    results,
  });
}

export const POST = GET;
