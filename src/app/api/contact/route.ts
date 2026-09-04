import { NextResponse } from "next/server";
import { saveContactSubmission, markContactDelivery } from "@/lib/db";
import {
  sendContactNotification,
  sendContactAutoReply,
  mailerConfigured,
  type ContactPayload,
} from "@/lib/mailer";

export const dynamic = "force-dynamic";

/**
 * Contact form endpoint.
 *
 * Order matters: the submission is written to Supabase FIRST, then email is
 * attempted. If the mail provider is down, the lead is still captured and
 * visible in the admin dashboard — a mail outage can never cost you a client.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const DEPARTMENTS: Record<string, { inbox: string; label: string }> = {
  tax: {
    inbox: "lashanda@smarttaxiq.com",
    label: "SmartTaxIQ — Tax preparation & strategy",
  },
  credit: {
    inbox: "info@cartercoleandassociates.com",
    label: "Credit repair & credit building",
  },
  business: {
    inbox: "info@cartercoleandassociates.com",
    label: "Business formation & compliance",
  },
  bookkeeping: {
    inbox: "info@cartercoleandassociates.com",
    label: "Bookkeeping & payroll",
  },
  consulting: {
    inbox: "info@cartercoleandassociates.com",
    label: "Small business consulting",
  },
  general: {
    inbox: "info@cartercoleandassociates.com",
    label: "General question",
  },
};

// Small in-memory rate limit: 5 submissions per IP per 10 minutes.
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
    const userAgent = request.headers.get("user-agent");

    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many messages. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid request." },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, message, website } = body;

    // Honeypot — bots fill hidden fields, people don't. Pretend it worked.
    if (website) return NextResponse.json({ ok: true });

    const cleanEmail = String(email ?? "").trim();

    if (!String(firstName ?? "").trim()) {
      return NextResponse.json(
        { ok: false, error: "Please tell us your first name." },
        { status: 400 }
      );
    }
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json(
        { ok: false, error: "That email address doesn't look right." },
        { status: 400 }
      );
    }
    if (!String(message ?? "").trim()) {
      return NextResponse.json(
        { ok: false, error: "Please tell us a little about your situation." },
        { status: 400 }
      );
    }

    const key = String(body.department ?? "general");
    const department = DEPARTMENTS[key] ? key : "general";
    const { inbox, label } = DEPARTMENTS[department];

    // 1. Store it. If this throws, the visitor gets an error and can retry.
    const saved = await saveContactSubmission({
      firstName: String(firstName),
      lastName: lastName ? String(lastName) : null,
      email: cleanEmail,
      phone: phone ? String(phone) : null,
      department,
      message: String(message),
      routedTo: inbox,
      ip,
      userAgent,
    });

    // 2. Email. Failures are recorded against the row, never surfaced to the
    //    visitor — as far as they're concerned the message got through, and
    //    it did.
    const payload: ContactPayload = {
      firstName: String(firstName),
      lastName: lastName ? String(lastName) : null,
      email: cleanEmail,
      phone: phone ? String(phone) : null,
      department,
      departmentLabel: label,
      message: String(message),
    };

    if (!mailerConfigured()) {
      console.warn(
        "[contact] SMTP not configured — submission saved, no email sent."
      );
      await markContactDelivery(saved.id, {
        error: "SMTP not configured at time of submission.",
      });
      return NextResponse.json({ ok: true, stored: true, emailed: false });
    }

    const failures: string[] = [];

    try {
      await sendContactNotification(payload, inbox);
      await markContactDelivery(saved.id, { notified: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      failures.push(`notification: ${msg}`);
      console.error("[contact] notification failed:", msg);
    }

    try {
      await sendContactAutoReply(payload);
      await markContactDelivery(saved.id, { autoReplied: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      failures.push(`auto-reply: ${msg}`);
      console.error("[contact] auto-reply failed:", msg);
    }

    if (failures.length) {
      await markContactDelivery(saved.id, { error: failures.join(" | ") });
    }

    return NextResponse.json({
      ok: true,
      stored: true,
      emailed: failures.length === 0,
    });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong sending your message. Please call us instead.",
      },
      { status: 500 }
    );
  }
}
