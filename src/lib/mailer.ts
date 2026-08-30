import nodemailer from "nodemailer";
import { site } from "./site";
import type { SequenceEmail } from "./sequence";
import type { Subscriber } from "./db";

/**
 * Sending transport.
 *
 * The app owns the list and the schedule; this file is the only place that
 * talks to an outbound mail service. Configure via .env.local:
 *
 *   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
 *   SMTP_PORT=587
 *   SMTP_USER=...
 *   SMTP_PASS=...
 *   MAIL_FROM="Lashanda Carter <lashanda@smarttaxiq.com>"
 *   MAIL_REPLY_TO=lashanda@smarttaxiq.com
 *   SITE_URL=https://cartercoleassociates.com
 *
 * Works with Amazon SES, your domain's own mail server, Postmark, Resend's
 * SMTP bridge, Mailgun — anything speaking SMTP. Swapping provider is a
 * change to these variables, not to any code.
 *
 * Do NOT send through a personal Gmail account for a list: consumer providers
 * rate-limit hard and it will damage your domain's sending reputation.
 */

let _transport: nodemailer.Transporter | null = null;

export function mailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
}

function transport() {
  if (_transport) return _transport;
  _transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });
  return _transport;
}

export function siteUrl() {
  return (process.env.SITE_URL || site.url).replace(/\/$/, "");
}

function linksFor(sub: Subscriber) {
  const base = siteUrl();
  return {
    checklist: `${base}/api/download/checklist?t=${sub.token}`,
    workbook: `${base}/workbook?ref=${sub.token}`,
    unsubscribe: `${base}/api/unsubscribe?t=${sub.token}`,
  };
}

function fill(text: string, sub: Subscriber) {
  const l = linksFor(sub);
  return text
    .replace(/\{\{name\}\}/g, sub.first_name)
    .replace(/\{\{checklist\}\}/g, l.checklist)
    .replace(/\{\{workbook\}\}/g, l.workbook)
    .replace(/\{\{unsubscribe\}\}/g, l.unsubscribe);
}

const NAVY = "#0f1d44";
const GOLD = "#ddb33c";
const EMERALD = "#0a6b4f";
const INK = "#28313f";
const MUTED = "#6b7789";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderBlocks(body: string[], sub: Subscriber) {
  return body
    .map((raw) => {
      const line = fill(raw, sub);

      const cta = line.match(/^\[\[CTA:(.+?)\|(.+?)\]\]$/);
      if (cta) {
        return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td style="border-radius:999px;background:${EMERALD}">
          <a href="${cta[2]}" style="display:inline-block;padding:14px 30px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">${escapeHtml(
            cta[1]
          )}</a></td></tr></table>`;
      }

      if (line.startsWith("> ")) {
        return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0"><tr>
          <td style="border-left:3px solid ${GOLD};padding:4px 0 4px 18px;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${NAVY};font-style:italic">${escapeHtml(
            line.slice(2)
          )}</td></tr></table>`;
      }

      if (line.startsWith("- ")) {
        return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
          <td width="16" valign="top" style="padding:4px 0 4px 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;color:${GOLD}">&bull;</td>
          <td style="padding:4px 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${INK}">${escapeHtml(
            line.slice(2)
          )}</td></tr></table>`;
      }

      return `<p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:${INK}">${escapeHtml(
        line
      )}</p>`;
    })
    .join("\n");
}

export function renderEmail(email: SequenceEmail, sub: Subscriber) {
  const l = linksFor(sub);
  const subject = fill(email.subject, sub);
  const preheader = fill(email.preheader, sub);

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f4f2ee">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(
    preheader
  )}</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f2ee;padding:28px 12px">
<tr><td align="center">
  <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e2da">

    <tr><td style="background:${NAVY};padding:26px 34px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td style="font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;color:#ffffff;letter-spacing:-.2px">
          Carter Cole <span style="color:${GOLD}">&amp;</span> Associates
        </td>
        <td align="right" style="font-family:Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${GOLD}">
          Clarity &middot; Transformation &middot; Legacy
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:36px 34px 30px">
      ${renderBlocks(email.body, sub)}
    </td></tr>

    <tr><td style="padding:0 34px 34px">
      <div style="height:1px;background:#e6e2da;margin-bottom:20px"></div>
      <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED}">
        <strong style="color:${NAVY}">Carter Cole &amp; Associates</strong> &mdash; tax, credit, business formation and bookkeeping.<br>
        SmartTaxIQ is our tax division.
      </p>
      <!-- CAN-SPAM requires a physical postal address in commercial email. -->
      <p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED}">
        ${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}<br>
        <a href="tel:${site.phone.replace(
          /\D/g,
          ""
        )}" style="color:${MUTED}">${site.phone}</a> &middot;
        <a href="mailto:${site.email}" style="color:${MUTED}">${site.email}</a>
      </p>
      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#94a0b0">
        You're receiving this because you downloaded the Foundation Checklist at ${siteUrl().replace(
          /^https?:\/\//,
          ""
        )}.<br>
        <a href="${l.unsubscribe}" style="color:#94a0b0;text-decoration:underline">Unsubscribe</a> &mdash; one click, no questions.
      </p>
    </td></tr>

  </table>
  <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#a4aebb">
    &copy; ${new Date().getFullYear()} Carter Cole &amp; Associates
  </p>
</td></tr></table>
</body></html>`;

  const text =
    email.body
      .map((raw) => {
        const line = fill(raw, sub);
        const cta = line.match(/^\[\[CTA:(.+?)\|(.+?)\]\]$/);
        if (cta) return `${cta[1]}: ${cta[2]}`;
        if (line.startsWith("> ")) return line.slice(2);
        if (line.startsWith("- ")) return `  * ${line.slice(2)}`;
        return line;
      })
      .join("\n\n") +
    `\n\n---\nCarter Cole & Associates\n${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}\n${site.phone}\nUnsubscribe: ${l.unsubscribe}\n`;

  return { subject, html, text, unsubscribeUrl: l.unsubscribe };
}

export async function sendSequenceEmail(email: SequenceEmail, sub: Subscriber) {
  const { subject, html, text, unsubscribeUrl } = renderEmail(email, sub);

  if (!mailerConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST / SMTP_USER / SMTP_PASS in .env.local."
    );
  }

  await transport().sendMail({
    from: process.env.MAIL_FROM || `Lashanda Carter <${site.email}>`,
    replyTo: process.env.MAIL_REPLY_TO || site.email,
    to: sub.email,
    subject,
    html,
    text,
    headers: {
      // One-click unsubscribe: required by Gmail and Yahoo for bulk senders.
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}
