export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Tax" | "Credit" | "Business" | "Financial Education";
  date: string; // ISO
  readingTime: string;
  image: string;
  body: string[]; // paragraphs; lines starting with "## " become headings, "- " become list items
};

export const categories = [
  "All",
  "Tax",
  "Credit",
  "Business",
  "Financial Education",
] as const;

export const posts: Post[] = [
  {
    slug: "what-to-bring-to-your-tax-appointment",
    title: "What to Actually Bring to Your Tax Appointment",
    excerpt:
      "The checklist that keeps a one-hour appointment from turning into three weeks of back-and-forth email.",
    category: "Tax",
    date: "2026-01-14",
    readingTime: "5 min read",
    image: "/images/planner-desk-flatlay.jpg",
    body: [
      "Every year, the same thing slows returns down: not complexity, but missing paper. A preparer can work around a complicated situation. What nobody can work around is a 1099 that arrives in March after the return has already been assembled.",
      "Here is the honest version of the list.",
      "## Identity and prior filings",
      "- A copy of last year's return, federal and state",
      "- Social Security cards or ITIN letters for everyone on the return",
      "- A government-issued photo ID",
      "Prior-year returns matter more than people expect. They carry forward losses, depreciation schedules, and credits that phase in over multiple years. Without last year's return, your preparer is rebuilding history from memory — yours.",
      "## Income",
      "- W-2s from every employer, including the job you held for six weeks",
      "- 1099-NEC and 1099-MISC for contract work",
      "- 1099-K from payment platforms, even if the amount looks wrong",
      "- 1099-INT, 1099-DIV and 1099-B for interest, dividends and investment sales",
      "- 1099-R for retirement distributions, and SSA-1099 for Social Security",
      "- Records of income that never generated a form at all",
      "That last one is where most self-employed filers get into trouble. If you were paid in cash, through a friend's app, or by a client who never bothered with a 1099, that income is still reportable. Bring your own record of it — a spreadsheet is fine.",
      "## Deductions and credits",
      "- Childcare provider name, address and tax ID",
      "- Tuition statements (1098-T) and student loan interest (1098-E)",
      "- Mortgage interest (1098) and property tax records",
      "- Medical expenses, if they were substantial",
      "- Charitable contribution receipts",
      "- Business expense records: mileage log, home office square footage, equipment purchases",
      "## The one people forget",
      "Any letter the IRS sent you. Notices are not something to hide in a drawer until they stop coming. Most are routine — a math adjustment, a request for a missing form, a balance notice. They are also time-sensitive, and the options available at day 30 are broader than the options at day 120.",
      "Bring what you have. Nobody has all of it on the first visit, and part of our job is helping you find the rest.",
    ],
  },
  {
    slug: "why-your-credit-score-stopped-moving",
    title: "Why Your Credit Score Stopped Moving",
    excerpt:
      "You paid everything down and the number didn't budge. Here's what is usually happening underneath.",
    category: "Credit",
    date: "2026-02-03",
    readingTime: "6 min read",
    image: "/images/lashanda-desk-writing.jpg",
    body: [
      "There is a specific kind of frustration that comes from doing everything right and watching the score sit still. You paid the cards down. You stopped applying for things. Months went by. Nothing.",
      "Usually one of four things is happening.",
      "## 1. Utilization is calculated per card, not just overall",
      "Total utilization matters, but so does the utilization on each individual account. Paying one card to zero while another sits at 90% can leave your score flat. The fix is often just redistributing balances rather than paying more.",
      "There is also a timing issue nobody explains: most issuers report your balance on the statement date, not the due date. If you pay in full after the statement closes, the bureaus still see the high balance. Paying a few days before the statement date can move a score without changing a dollar of what you spend.",
      "## 2. Your oldest account got closed",
      "Length of credit history is roughly 15% of a score. Closing your oldest card — often the one with the annual fee you resented — shortens the average age of your accounts and removes its available limit from your utilization calculation. Two hits from one decision.",
      "If a card has a fee you no longer want to pay, ask the issuer to downgrade it to a no-fee product rather than closing it. The account age usually survives.",
      "## 3. Something inaccurate is still sitting there",
      "This is more common than people assume. Accounts that were paid still reported as delinquent. Collections that were sold and now appear twice under two different agency names. Balances that never updated after a payoff. Addresses and names that belong to someone else entirely.",
      "You are entitled to dispute anything inaccurate, incomplete, or unverifiable — and the burden is on the furnisher to verify it, not on you to disprove it. Disputes work best with documentation attached, not as a bare assertion.",
      "## 4. You have nothing positive to report",
      "Removing negative items is only half the work, and it is the half that gets all the attention. A report with nothing bad on it and nothing good on it produces a thin file, and thin files do not score well.",
      "Building means adding: a secured card used lightly and paid on time, a credit-builder loan, being added as an authorized user on a well-managed account. It is slower than disputing, and it is the part that actually holds.",
      "## What this means practically",
      "If your score has been flat for six months while you have been doing the right things, the problem is probably structural rather than behavioral. Pull all three reports, read them line by line, and look for the four patterns above before you change anything else about how you are paying.",
    ],
  },
  {
    slug: "llc-vs-s-corp-what-actually-changes",
    title: "LLC vs. S-Corp: What Actually Changes for a Small Business Owner",
    excerpt:
      "The comparison usually gets explained badly. Here's the version that affects your actual tax bill.",
    category: "Business",
    date: "2026-02-20",
    readingTime: "7 min read",
    image: "/images/lashanda-legacy-planner.jpg",
    body: [
      "The first confusion to clear up: an LLC and an S-corp are not the same category of thing. An LLC is a legal entity created under state law. An S-corp is a federal tax election. An LLC can elect to be taxed as an S-corp — which is exactly what most people mean when they ask which one to choose.",
      "## What an LLC gives you",
      "Liability separation between your business and your personal assets, a formal structure, and a name registered with the state. By default, a single-member LLC is taxed as a sole proprietorship: profit flows onto your personal return and the entire net profit is subject to self-employment tax at 15.3%.",
      "That last part is the whole reason the S-corp conversation exists.",
      "## What the S-corp election changes",
      "Under an S-corp election, you become an employee of your own company. You pay yourself a reasonable salary through payroll, which is subject to employment taxes. Profit above that salary is distributed to you as an owner distribution — and distributions are not subject to self-employment tax.",
      "On $120,000 of profit, the difference between taxing all of it as self-employment income versus splitting it into a $70,000 salary and $50,000 in distributions can be several thousand dollars a year. That is the appeal, and it is real.",
      "## What it costs you",
      "- Payroll has to actually run, with filings, withholdings and deadlines",
      "- A separate business return (Form 1120-S) has to be filed, plus a K-1 to yourself",
      "- The salary must be *reasonable* — the IRS scrutinizes owners who pay themselves $15,000 and distribute $200,000",
      "- Accounting costs go up, meaningfully",
      "The rough guidance many practitioners use is that the election starts making sense somewhere around $50,000–$80,000 of consistent net profit, because below that the added compliance cost eats the savings. But it depends heavily on your state, your health insurance situation, and how steady the profit actually is.",
      "## The question nobody asks first",
      "Is the profit reliable? An S-corp election is not something to switch on and off casually. If your business had one strong year and you are not confident about the next two, the added structure may cost you more than it saves.",
      "## What to do with this",
      "Run the actual numbers for your actual profit before making the election, and account for the compliance cost honestly rather than optimistically. This is a decision that pays for a proper conversation — and it is one of the most common things we look at when a business owner comes in for the first time.",
    ],
  },
  {
    slug: "quarterly-taxes-for-the-newly-self-employed",
    title: "Quarterly Taxes for the Newly Self-Employed",
    excerpt:
      "Nobody withholds for you anymore. Here's how to keep April from becoming an emergency.",
    category: "Tax",
    date: "2026-03-05",
    readingTime: "5 min read",
    image: "/images/planner-open-pages.jpg",
    body: [
      "The first year of self-employment catches almost everyone the same way. Money comes in, it feels like income, and then a tax bill arrives that assumes you had been setting some of it aside all along.",
      "## Why it happens",
      "As a W-2 employee, taxes are withheld from every paycheck before you ever see the money. As a contractor or business owner, nothing is withheld. You receive the full amount and are responsible for remitting the tax yourself — federal income tax plus 15.3% self-employment tax covering both halves of Social Security and Medicare.",
      "## Who needs to pay quarterly",
      "Generally, if you expect to owe $1,000 or more when you file, the IRS expects estimated payments during the year rather than a lump sum at the end. Missing them can trigger an underpayment penalty even if you pay in full by the deadline.",
      "## The safe harbor",
      "There is a useful rule here. If you pay in at least 100% of last year's total tax liability (110% if your income was above $150,000), you generally avoid the underpayment penalty regardless of what this year turns out to be.",
      "This is genuinely helpful for anyone whose income is unpredictable. You do not have to forecast a volatile year accurately — you only have to match a number you already know.",
      "## A practical system",
      "- Open a second checking account used only for taxes",
      "- Move a fixed percentage of every payment into it the day it clears, not at month end",
      "- Start around 25–30% if you have no other withholding, and adjust once you have a real return to calibrate against",
      "- Pay from that account on the quarterly deadlines and never touch it otherwise",
      "The percentage matters less than the habit. Money that stays in your operating account gets spent — not recklessly, just gradually.",
      "## The deadlines",
      "Estimated payments are generally due in mid-April, mid-June, mid-September, and mid-January of the following year. The exact dates shift when they land on weekends or holidays, so confirm them each year rather than relying on memory.",
      "## If you are already behind",
      "Pay what you can as soon as you can. Penalties and interest accrue on the unpaid balance over time, so a late partial payment costs less than a later full one. And if the number is large enough to be frightening, that is a reason to get help with it now rather than in April.",
    ],
  },
  {
    slug: "business-credit-is-not-personal-credit",
    title: "Business Credit Is Not Personal Credit — and Building It Is Deliberate",
    excerpt:
      "Your EIN does not automatically build a credit profile. Here's what actually does.",
    category: "Credit",
    date: "2026-03-22",
    readingTime: "6 min read",
    image: "/images/lashanda-arms-crossed.jpg",
    body: [
      "A common assumption: form an LLC, get an EIN, and business credit starts building on its own. It does not. Business credit profiles are built intentionally, through specific types of accounts that report to specific bureaus.",
      "## Different bureaus, different rules",
      "Personal credit runs through Equifax, Experian and TransUnion. Business credit runs primarily through Dun & Bradstreet, Experian Business and Equifax Business — and their scoring works differently. D&B's PAYDEX score, for instance, runs 0–100 and is driven almost entirely by whether you pay on time or early.",
      "Business credit reports are also, unlike personal ones, largely public. Anyone can pull yours.",
      "## The foundation nobody skips successfully",
      "- A registered entity in good standing with your state",
      "- An EIN from the IRS",
      "- A business bank account in the exact legal name of the entity",
      "- A real business address and phone number, listed consistently",
      "- A D-U-N-S number from Dun & Bradstreet",
      "The word to notice there is *consistently*. If your entity is registered as one thing, your bank account says another, and your vendor applications say a third, the bureaus cannot connect them into a single profile. Mismatched details are the most common reason a profile fails to build.",
      "## Building the file",
      "The typical path starts with vendor accounts that extend net-30 terms and report payment history. Pay those early rather than merely on time — with PAYDEX, early payment scores higher than on-time.",
      "From there, business credit cards and store accounts that report to the business bureaus add depth. Later, once there is a payment history to point to, larger lines and lender financing become realistic.",
      "## Why it is worth the effort",
      "A strong business credit profile lets the business borrow on its own strength rather than on your personal guarantee. That protects your personal score from your business's fluctuations, and it means a slow quarter does not follow you home.",
      "It takes time — realistically a year or more to build something meaningful. The businesses that have it started before they needed it.",
    ],
  },
  {
    slug: "reading-your-profit-and-loss-statement",
    title: "How to Actually Read Your Profit and Loss Statement",
    excerpt:
      "Most owners glance at the bottom line and close the file. There are four numbers worth more attention.",
    category: "Financial Education",
    date: "2026-04-08",
    readingTime: "6 min read",
    image: "/images/lashanda-mug.jpg",
    body: [
      "If your bookkeeper sends a monthly profit and loss statement and you look only at the last line, you are getting maybe a tenth of the value. The bottom line tells you whether the month was good. The rest of the statement tells you why.",
      "## Revenue, but by source",
      "Total revenue is less useful than the composition of it. If 70% of your revenue comes from one client, that is not a revenue number — it is a risk number. Break the top line into segments and watch how the mix shifts over quarters, not months.",
      "## Cost of goods sold and gross margin",
      "Gross margin is revenue minus the direct cost of delivering what you sold, expressed as a percentage. It is the single most diagnostic number on the statement, because it tells you whether the business model works before overhead enters the picture.",
      "A declining gross margin while revenue grows is the classic warning sign: you are getting busier and keeping less of it. That usually traces back to pricing that never got revisited, or to delivery costs that crept up quietly.",
      "## Fixed versus variable operating expenses",
      "Group your expenses by behavior, not just by category. Rent, software subscriptions and salaried staff are fixed — they arrive whether you sell anything or not. Contractor payments, materials and commissions scale with volume.",
      "The reason this grouping matters: it tells you your break-even point. Fixed costs divided by gross margin percentage gives you the revenue you must produce each month before anything is actually yours. Most owners have never calculated it, and almost all of them find the number sobering and useful.",
      "## Net profit versus cash",
      "Profit is not the same as money in the account. A profitable business can run out of cash — through receivables that have not been collected, inventory that has been paid for but not sold, or loan principal payments that reduce cash without appearing as an expense.",
      "If your statement says you made money and your bank account disagrees, the answer is almost always in one of those three places.",
      "## What to do monthly",
      "- Compare against the same month last year, not just last month",
      "- Track gross margin as a percentage, on a chart, over time",
      "- Recalculate break-even whenever fixed costs change",
      "- Reconcile profit against actual cash movement",
      "Fifteen minutes a month on a statement you are already paying to have produced is one of the highest-return habits available to a small business owner.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
