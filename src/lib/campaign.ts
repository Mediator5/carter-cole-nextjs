import type { SequenceEmail } from "./sequence";

/**
 * The workbook sales push.
 *
 * This is NOT the welcome sequence. The welcome sequence is timed from the day
 * each person subscribed, which is right for onboarding and wrong for a sales
 * push: a list that signed up across two weeks would be pitched across two
 * weeks. These emails are timed from PUSH_START instead, so everybody on the
 * list moves through the push together, whenever they joined.
 *
 * To run it again for a later cohort: change PUSH_START (or set
 * WORKBOOK_PUSH_START) and clear the push-* rows in `sends` for the people who
 * should receive it again. Everything else is automatic.
 *
 * Who gets it: every active subscriber who has NOT bought the workbook.
 * Buyers are excluded in the dispatcher — nobody is sold what they already own.
 */

/** Day 0 of the push. Set WORKBOOK_PUSH_START=YYYY-MM-DD to override. */
export const PUSH_START = process.env.WORKBOOK_PUSH_START || "2026-10-19";

/** Set WORKBOOK_PUSH=off to halt the push without deploying a code change. */
export const pushEnabled = () => process.env.WORKBOOK_PUSH !== "off";

/** The welcome sequence's own sales emails. While the push is running these
 *  are redundant — it makes the same argument, harder and on a tighter clock —
 *  so the dispatcher suppresses them rather than sending both. */
export const SUPERSEDED_KEYS = ["offer", "lastcall"];

export const workbookPush: SequenceEmail[] = [
  {
    key: "push-1",
    dayOffset: 0,
    subject: "The boxes you didn't check, {{name}}",
    preheader:
      "That list of gaps is the most useful thing you own right now. Here's what to do with it.",
    body: [
      "Hi {{name}},",
      "A little while ago you went through the Foundation Checklist — twenty-four things that hold a business up.",
      "If you did it honestly, you came out with two lists. The boxes you checked, and the ones you didn't.",
      "> Most people put the second list in a drawer. That is the whole problem.",
      "The unchecked boxes aren't the hard part. Knowing which one to fix first, and what to actually do about it on Tuesday morning — that's the hard part. Nobody hands you that.",
      "So I wrote it down.",
      "From Starter to Builder is thirty days, one task at a time, in the order that actually works. Not theory. The specific things I had to learn across six businesses, set out so you don't have to learn them the way I did — by paying for them.",
      "It's $17.",
      "[[CTA:Get the workbook — $17|{{workbook}}]]",
      "And if you'd rather keep working from the checklist on your own — genuinely, do that. It's yours and it works. But if you've looked at those empty boxes more than once and still not known where to start, this is the part that tells you.",
      "— Lashanda",
    ],
  },
  {
    key: "push-2",
    dayOffset: 1,
    subject: "What's actually in the 30 days",
    preheader: "A fair question before you spend $17. Here's the plain answer.",
    body: [
      "Hi {{name}},",
      "I wrote to you yesterday about the workbook, and I know what the reasonable reaction is: what do I actually get for $17?",
      "Here it is, plainly.",
      "- Days 1–7 — your foundation. Entity, business bank account, bookkeeping, the paperwork that quietly decides how much tax you pay later.",
      "- Days 8–14 — your money. Knowing your real numbers, pricing properly, and paying yourself first instead of last.",
      "- Days 15–21 — your systems. The routines that keep running on the weeks when you are tired.",
      "- Days 22–30 — your build. What you're actually growing toward, and a quarterly rhythm that keeps you pointed at it.",
      "Every day is one page: one task, and room to write. It is a workbook, not a book — the pages you fill in are the point, not the pages you read.",
      "> Thirty days is long enough to change how the business runs. Short enough that you'll actually finish it.",
      "[[CTA:Start day one|{{workbook}}]]",
      "— Lashanda",
    ],
  },
  {
    key: "push-3",
    dayOffset: 2,
    subject: "What another year of it costs",
    preheader: "The gaps don't stay the same size.",
    body: [
      "Hi {{name}},",
      "Let me be straight with you about why I keep bringing this up.",
      "The gaps on that checklist don't stay the same size. A missing business bank account is one afternoon to fix today. At year three it is an accountant untangling three years of mixed-up transactions, and it costs real money — far more than the afternoon would have.",
      "Same with the entity you meant to set up. Same with the books you meant to start in January.",
      "> I didn't learn that from a course. I learned it by paying for it. Six times.",
      "Thirty days of one-page tasks, against another year of that. That's the trade.",
      "It's $17 once. No subscription, no upsell, and the download link never expires — it's yours to come back to whenever you need it.",
      "[[CTA:Get the workbook — $17|{{workbook}}]]",
      "— Lashanda",
    ],
  },
  {
    key: "push-4",
    dayOffset: 3,
    subject: "Thirty days from now",
    preheader: "Start this week and you're finished before tax season starts.",
    body: [
      "Hi {{name}},",
      "Last one from me about this, then I'll leave it alone.",
      "It's a thirty-day workbook. Start it this week and you're done in November — entity sorted, books started, your numbers written down somewhere you can find them — before January arrives and everything gets loud.",
      "Start it in January instead and you'll be doing it in the middle of tax season, which is the worst possible time to discover your records are a mess. I see that every single year.",
      "> That's not a sales deadline. It's just the calendar.",
      "[[CTA:Get the workbook — $17|{{workbook}}]]",
      "Thirty days. $17. Yours to keep.",
      "And if it isn't for you, that is completely fine — the checklist is still yours and I'll stop asking. You'll hear from me next when I have something useful to say about the tax year.",
      "— Lashanda",
      "P.S. Carter Cole & Associates handles tax preparation and strategy, credit, business formation and bookkeeping. If the checklist showed you a gap you'd rather just hand to someone, reply and tell me which one.",
    ],
  },
];

export function pushEmailByKey(key: string) {
  return workbookPush.find((e) => e.key === key);
}

/** True for any key belonging to the push. */
export const isPushKey = (key: string) => key.startsWith("push-");
