import nodemailer from "nodemailer";
import { site } from "./site";
import type { SequenceEmail } from "./sequence";
import type { Subscriber } from "./db";

/**
 * Sending transport — Google (smtp.gmail.com) via nodemailer, authenticating
 * as a free @gmail.com account.
 *
 * The app owns the list and the schedule; this file is the only place that
 * talks to an outbound mail service. Configure via .env.local:
 *
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=lashanda@smarttaxiq.com     <- the full Google address
 *   SMTP_PASS=abcd efgh ijkl mnop         <- a Google APP PASSWORD, not the
 *                                            account's login password
 *   MAIL_FROM="Lashanda Carter <lashanda@smarttaxiq.com>"
 *   MAIL_REPLY_TO=lashanda@smarttaxiq.com
 *   SITE_URL=https://...
 *
 * THREE THINGS GOOGLE WILL BITE YOU ON:
 *
 * 1. App Password required. Google rejects your normal password over SMTP.
 *    Turn on 2-Step Verification, then create an App Password at
 *    myaccount.google.com/apppasswords and use that as SMTP_PASS.
 *
 * 2. MAIL_FROM must match SMTP_USER, or be an address verified under
 *    Gmail -> Settings -> Accounts -> "Send mail as". Otherwise Google
 *    silently rewrites the From header to the authenticated account and your
 *    branding disappears without any error.
 *
 * 3. Hard daily cap. A free @gmail.com account is capped at roughly 500
 *    messages/day (paid Workspace: 2,000). Hit it and the account cannot send
 *    anything for 24 hours — contact form included. That is why sends are
 *    throttled below and why the dispatcher enforces MAIL_DAILY_LIMIT.
 *
 * 4. No DKIM for your own domain. Only paid Workspace can sign as
 *    @cartercoleandassociates.com. Mail sent from here is signed by gmail.com,
 *    so DMARC alignment fails. Neither domain enforces DMARC today, so it is
 *    delivered — but keep the SPF records correct to stay out of spam.
 *
 * Swapping provider later (Amazon SES, Postmark, Mailgun) is a change to
 * these variables, not to any code.
 */

let _transport: nodemailer.Transporter | null = null;

export function mailerConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

/** How many messages we allow ourselves per rolling 24h, kept under Google's
 *  own cap so a burst can never lock the account out of sending. */
export function dailySendLimit() {
  return Number(process.env.MAIL_DAILY_LIMIT || 400);
}

/** Pause between messages. Google throttles bursts; roughly one per second
 *  keeps a sequence run comfortably inside its tolerance. */
export function sendThrottleMs() {
  return Number(process.env.MAIL_THROTTLE_MS || 1200);
}

function transport() {
  if (_transport) return _transport;

  const port = Number(process.env.SMTP_PORT || 587);

  _transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS. 587 starts plaintext and upgrades via STARTTLS,
    // which `secure: false` means here — it is not "insecure".
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    tls: { minVersion: "TLSv1.2" },
    // Serverless functions get killed at the timeout; fail fast instead of
    // hanging the whole request on an unreachable mail host.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const from = process.env.MAIL_FROM || "";
  const user = process.env.SMTP_USER || "";
  if (user && from && !from.toLowerCase().includes(user.toLowerCase())) {
    console.warn(
      `[mailer] MAIL_FROM (${from}) does not contain SMTP_USER (${user}). ` +
        `Google will rewrite the From header unless that address is verified ` +
        `under Gmail -> Settings -> Accounts -> "Send mail as".`
    );
  }

  return _transport;
}

/**
 * The From header. Falls back to the authenticated Gmail account rather than
 * a domain address, because Google rewrites any unverified From anyway — and
 * a header that matches what was actually sent is better than one that
 * quietly doesn't.
 */
export function fromAddress() {
  return (
    process.env.MAIL_FROM ||
    process.env.SMTP_USER ||
    `Lashanda Carter <${site.email}>`
  );
}

/** Small sleep used to pace bulk sends. */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    from: fromAddress(),
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

/* ========================================================================== */
/*  Contact form email                                                        */
/* ========================================================================== */

export type ContactPayload = {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  department: string;
  departmentLabel: string;
  message: string;
};

/** The branded card every transactional email sits inside. */
function shell(opts: {
  subject: string;
  preheader: string;
  inner: string;
  footer: string;
}) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(opts.subject)}</title></head>
<body style="margin:0;padding:0;background:#f4f2ee">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(
    opts.preheader
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
    <tr><td style="padding:36px 34px 30px">${opts.inner}</td></tr>
    <tr><td style="padding:0 34px 34px">
      <div style="height:1px;background:#e6e2da;margin-bottom:20px"></div>
      ${opts.footer}
    </td></tr>
  </table>
  <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#a4aebb">
    &copy; ${new Date().getFullYear()} Carter Cole &amp; Associates
  </p>
</td></tr></table>
</body></html>`;
}

function para(text: string) {
  return `<p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:${INK}">${text}</p>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td width="130" valign="top" style="padding:9px 14px 9px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:${MUTED};border-bottom:1px solid #eeeae2">${escapeHtml(
      label
    )}</td>
    <td valign="top" style="padding:9px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${NAVY};border-bottom:1px solid #eeeae2">${value}</td>
  </tr>`;
}

const officeFooter = `<p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED}">
  <strong style="color:${NAVY}">Carter Cole &amp; Associates</strong> &mdash; tax, credit, business formation and bookkeeping.<br>
  ${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}<br>
  <a href="tel:${site.phone.replace(/\D/g, "")}" style="color:${MUTED}">${
  site.phone
}</a> &middot; <a href="mailto:${site.email}" style="color:${MUTED}">${
  site.email
}</a>
</p>`;

/**
 * Internal notification: goes to whichever inbox owns the department the
 * visitor picked. Reply-To is the visitor, so hitting reply in any mail
 * client answers them directly.
 */
export async function sendContactNotification(
  payload: ContactPayload,
  routedTo: string
) {
  if (!mailerConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST / SMTP_USER / SMTP_PASS."
    );
  }

  const name = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
  const subject = `New ${payload.departmentLabel} inquiry — ${name}`;

  const inner = `
    <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};font-weight:700">New inquiry</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:${NAVY}">${escapeHtml(
      name
    )}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #eeeae2">
      ${row(
        "Email",
        `<a href="mailto:${escapeHtml(payload.email)}" style="color:${EMERALD}">${escapeHtml(
          payload.email
        )}</a>`
      )}
      ${
        payload.phone
          ? row(
              "Phone",
              `<a href="tel:${payload.phone.replace(/\D/g, "")}" style="color:${EMERALD}">${escapeHtml(
                payload.phone
              )}</a>`
            )
          : ""
      }
      ${row("Needs help with", escapeHtml(payload.departmentLabel))}
      ${row("Received", new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET")}
    </table>
    <p style="margin:26px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:${MUTED}">Their message</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="border-left:3px solid ${GOLD};padding:6px 0 6px 18px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:${INK};white-space:pre-wrap">${escapeHtml(
        payload.message
      )}</td>
    </tr></table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0"><tr><td style="border-radius:999px;background:${EMERALD}">
      <a href="mailto:${escapeHtml(payload.email)}" style="display:inline-block;padding:14px 30px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">Reply to ${escapeHtml(
        payload.firstName
      )}</a>
    </td></tr></table>`;

  const text = [
    `New ${payload.departmentLabel} inquiry`,
    ``,
    `Name:    ${name}`,
    `Email:   ${payload.email}`,
    payload.phone ? `Phone:   ${payload.phone}` : null,
    `Needs:   ${payload.departmentLabel}`,
    ``,
    `Message:`,
    payload.message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  await transport().sendMail({
    from: fromAddress(),
    to: routedTo,
    replyTo: payload.email,
    subject,
    text,
    html: shell({
      subject,
      preheader: `${name} — ${payload.message.slice(0, 90)}`,
      inner,
      footer: `<p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#94a0b0">
        Sent automatically from the contact form at ${siteUrl().replace(/^https?:\/\//, "")}.<br>
        A copy is stored in the admin dashboard.
      </p>`,
    }),
  });
}

/**
 * Confirmation to the person who wrote in. Deliberately short: it exists so
 * nobody wonders whether the form worked.
 */
export async function sendContactAutoReply(payload: ContactPayload) {
  if (!mailerConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  const subject = "We've got your message — Carter Cole & Associates";

  const inner = `
    <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};font-weight:700">Message received</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:${NAVY}">Thank you, ${escapeHtml(
      payload.firstName
    )}.</h1>
    ${para(
      "Your message reached us and it's already with the right person on our team. We answer every inquiry within two business days &mdash; usually sooner."
    )}
    ${para(
      `You wrote in about <strong style="color:${NAVY}">${escapeHtml(
        payload.departmentLabel
      )}</strong>. Here's what you sent, for your records:`
    )}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px"><tr>
      <td style="border-left:3px solid #e6e2da;padding:4px 0 4px 18px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${MUTED};white-space:pre-wrap">${escapeHtml(
        payload.message
      )}</td>
    </tr></table>
    ${para(
      `If it's urgent, don't wait on email &mdash; call us at <a href="tel:${site.phone.replace(
        /\D/g,
        ""
      )}" style="color:${EMERALD};font-weight:700">${site.phone}</a>.`
    )}
    ${para("&mdash; Lashanda Carter")}`;

  const text = `Thank you, ${payload.firstName}.

Your message reached us and it's already with the right person on our team. We answer every inquiry within two business days.

You wrote in about: ${payload.departmentLabel}

Your message:
${payload.message}

If it's urgent, call us at ${site.phone}.

— Lashanda Carter
Carter Cole & Associates
${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}
`;

  await transport().sendMail({
    from: fromAddress(),
    replyTo: process.env.MAIL_REPLY_TO || site.email,
    to: payload.email,
    subject,
    text,
    html: shell({
      subject,
      preheader:
        "We received your message and will be in touch within two business days.",
      inner,
      footer: `${officeFooter}
        <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#94a0b0">
          You're receiving this because you submitted the contact form at ${siteUrl().replace(
            /^https?:\/\//,
            ""
          )}. This is a one-time confirmation, not a subscription.
        </p>`,
    }),
  });
}
