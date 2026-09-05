import type { SequenceEmail } from "./sequence";

/**
 * The email a buyer gets the moment their workbook payment clears.
 *
 * Shaped as a SequenceEmail so it renders through exactly the same branded
 * template as the nurture sequence — same header, same buttons, same postal
 * footer — but it is NOT part of `sequence` and the cron dispatcher never
 * touches it. It is sent once, by the Stripe webhook.
 *
 * `dayOffset` is meaningless here and set to 0.
 */
export const workbookDeliveryEmail: SequenceEmail = {
  key: "workbook-delivery",
  dayOffset: 0,
  subject: "Your workbook is ready, {{name}}",
  preheader:
    "Download From Starter to Builder — plus how to get the most out of the first week.",
  body: [
    "Hi {{name}},",
    "Thank you — your payment went through and the workbook is yours.",
    "[[CTA:Download your workbook|{{workbookDownload}}]]",
    "That link is tied to your purchase and won't expire, so you can come back to it whenever you need another copy. Save the PDF somewhere you'll actually find it again.",
    "One suggestion before you start.",
    "> Don't read it front to back. It isn't that kind of book.",
    "Work one section at a time and finish the exercise in it before moving on. The whole thing is built to be written in — the pages you fill are the point, not the pages you read.",
    "If you did the free Foundation Checklist first, start with whatever you left unchecked. The workbook is organised to take those exact gaps and turn them into something built.",
    "And if you get stuck on something that turns out to be a tax or entity question rather than a planning one, reply to this email. That part is what we do all day.",
    "— Lashanda",
  ],
};

/** Shown in the email footer in place of the checklist opt-in sentence. */
export const WORKBOOK_FOOTER_REASON =
  "You're receiving this because you purchased the From Starter to Builder workbook";
