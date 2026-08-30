/**
 * The nurture sequence sent after someone downloads the free checklist.
 *
 * `dayOffset` is days after subscribing. The dispatcher (/api/cron/dispatch)
 * sends every email whose offset has elapsed and which hasn't been sent yet,
 * so adding, reordering or re-timing emails here is safe at any point — a
 * subscriber mid-sequence simply picks up the new schedule.
 *
 * Body copy uses {{name}} for the subscriber's first name, {{checklist}} for
 * their personal download link, {{workbook}} for the sales page and
 * {{unsubscribe}} for their one-click opt-out. All four are substituted at
 * send time in lib/mailer.ts.
 */

export type SequenceEmail = {
  key: string;
  dayOffset: number;
  subject: string;
  preheader: string;
  /** Paragraphs. A line starting with "> " renders as a pull quote,
   *  "- " as a bullet, "[[CTA:label|url]]" as a button. */
  body: string[];
};

export const sequence: SequenceEmail[] = [
  {
    key: "delivery",
    dayOffset: 0,
    subject: "Here's your Foundation Checklist, {{name}}",
    preheader:
      "Your checklist is inside — plus the one question worth sitting with before you start.",
    body: [
      "Hi {{name}},",
      "Here it is — The Starter to Builder Foundation Checklist. Twenty-four things that hold a business up.",
      "[[CTA:Download your checklist|{{checklist}}]]",
      "A word before you open it: don't try to check everything off today. That's not what it's for.",
      "Go through it once and be honest. Check what you actually have — not what you've been meaning to set up. Circle what you're missing.",
      "> The unchecked boxes aren't a failure. They're your to-do list, finally written down in one place.",
      "Most people who go through this find the same thing: it isn't the big, expensive items that are missing. It's the small structural ones nobody ever told them to handle. A separate bank account. A written-down routine. Knowing the tax deadlines before they arrive.",
      "Score yourself at the bottom. Then keep the page somewhere you'll see it.",
      "I'll check in on Thursday with the part of this that took me years — and six businesses — to learn.",
      "— Lashanda",
    ],
  },
  {
    key: "story",
    dayOffset: 3,
    subject: "I paid everyone but myself",
    preheader: "Starting was never my problem. Building the foundation was.",
    body: [
      "Hi {{name}},",
      "I want to tell you why I built that checklist, because it didn't come from a template.",
      "I've always been a starter. Give me an idea and I'll run with it — find the clients, bring in the revenue, make it work. I've done it six times.",
      "But here's what I learned: starting was never my problem. Building the foundation was.",
      "I hired people. Paid them well. But without systems, the money went out faster than it came in. I was paying everyone but myself.",
      "> And when you're worn out and not seeing the return, you give up. Not because it couldn't work — but because you couldn't see how to make it work for you.",
      "That's the part nobody warns you about. It doesn't feel like a systems problem while it's happening. It feels like you're not cut out for this.",
      "You are. The structure just isn't there yet.",
      "If you scored low on the checklist, that's not bad news — it means you found the gaps while they're still cheap to fix. Fixing them at year three costs a great deal more.",
      "Pull the checklist back up and pick the single unchecked box that would take the most weight off your shoulders. Just one.",
      "[[CTA:Open your checklist|{{checklist}}]]",
      "— Lashanda",
    ],
  },
  {
    key: "teaching",
    dayOffset: 6,
    subject: "Goals don't build businesses. This does.",
    preheader: "The difference between a goal and a system, in about two minutes.",
    body: [
      "Hi {{name}},",
      "Quick one today, but it's the thing that changed how I run everything.",
      "A goal is a destination. A system is what moves you there whether or not you feel like moving.",
      "\"Get my bookkeeping in order\" is a goal. You'll feel good writing it down and you'll still be writing it down next year.",
      "\"Every Friday at 4pm I reconcile the week and file receipts\" is a system. It's boring. It works.",
      "Look at the four sections on your checklist and notice what they actually are:",
      "- Legal & Financial — the structure that makes you a business instead of a person with an idea",
      "- Operations & Systems — the routines that survive a bad week",
      "- Brand & Audience — how people find you and decide to trust you",
      "- Mindset & Growth — what keeps you going when it's slow",
      "Almost nobody is missing all four. Most people are strong in two and quietly avoiding the other two — usually the ones that feel least like the fun part of the business.",
      "The avoided ones are where your next real gain is.",
      "> You don't need another idea. You need a foundation.",
      "This week, take your single most-avoided section and give it thirty minutes. Not a weekend. Thirty minutes.",
      "— Lashanda",
    ],
  },
  {
    key: "offer",
    dayOffset: 9,
    subject: "The 30-day version of what you started",
    preheader:
      "The checklist shows you the gaps. This walks you through closing them.",
    body: [
      "Hi {{name}},",
      "The checklist does one job well: it shows you what's missing.",
      "What it doesn't do is walk you through fixing it. That's what I built next.",
      "From Starter to Builder is a 30-day workbook — the actual process I used to stop starting over. Not theory, and not a course you'll never finish. Pages you write on.",
      "- The Starter's Assessment — an honest read on where you're beginning",
      "- The Builder's Blueprint — what you're really building, and what freedom means for you specifically",
      "- The Foundation — building systems instead of collecting goals",
      "- 30 Days of Building — one focus per day, so it's never overwhelming",
      "- From Starter to Builder — the mindset shift that makes the rest stick",
      "It's $17. That was deliberate. I wanted it to cost less than the thing you'd otherwise buy without thinking, because the people who most need a foundation are usually the ones watching every dollar.",
      "[[CTA:Get the workbook — $17|{{workbook}}]]",
      "Print it or work through it on screen. Either way, it's yours permanently.",
      "> I spent years being the starter. Now I'm learning to be the builder. That's what this workbook is about.",
      "— Lashanda",
    ],
  },
  {
    key: "lastcall",
    dayOffset: 13,
    subject: "Where will you be in 30 days?",
    preheader: "A straight question, and then I'll leave you to it.",
    body: [
      "Hi {{name}},",
      "Last note about the workbook, then I'll get out of your inbox on this.",
      "Thirty days from now will arrive regardless. The only question is whether you get there with a foundation under you or with the same gaps you circled two weeks ago.",
      "I'm not going to tell you the workbook is the only way. Plenty of people build the structure on their own, slowly, by making the expensive mistakes first. That's how I did it.",
      "What $17 buys you is not having to.",
      "[[CTA:Get the workbook — $17|{{workbook}}]]",
      "And if it's not the right moment, that's genuinely fine. Keep the checklist. Work the gaps in whatever order makes sense for you. It's yours either way.",
      "One thing before I go: if you're stuck on something specific — the entity, the bookkeeping, the taxes, the credit — that's the work my firm does every day. Reply to this email and tell me what you're up against. A real person reads it.",
      "Go build something.",
      "— Lashanda",
      "P.S. Carter Cole & Associates handles tax preparation and strategy, credit repair and building, business formation and compliance, and bookkeeping. If the checklist showed you a gap you'd rather hand to someone, that's what we're here for.",
    ],
  },
];

export function emailByKey(key: string) {
  return sequence.find((e) => e.key === key);
}
