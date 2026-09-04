export const site = {
  name: "Carter Cole & Associates",
  shortName: "Carter Cole",
  tagline: "Clarity. Transformation. Legacy.",
  description:
    "Carter Cole & Associates helps individuals and business owners file smarter taxes, repair credit, form compliant businesses, and build financial legacies. Home of SmartTaxIQ.",
  url: "https://cartercoleandassociates.com",
  founder: "Lashanda Carter",
  founded: 2003,
  phone: "800-599-2880",
  phoneHref: "tel:+18005992880",
  email: "info@cartercoleandassociates.com",
  taxPhone: "810-493-6605",
  taxPhoneHref: "tel:+18104936605",
  taxEmail: "lashanda@smarttaxiq.com",
  hours: "Monday – Thursday, 9:30am – 5:00pm ET",
  city: "Detroit, Michigan",
  address: {
    street: "[Address to be confirmed]",
    city: "Detroit",
    state: "MI",
    zip: "[ZIP]",
  },
  jotform: {
    // Live SmartTaxIQ intake forms.
    personalTax: "https://form.jotform.com/253275423934056", // Personal & Schedule C combined
    businessTax: "https://form.jotform.com/253285600052550", // Business tax return intake
    // No scheduling form supplied yet. Add the JotForm URL here and the
    // booking page will surface it automatically; until then the
    // consultation route runs through the inquiry form and phone.
    consultation: "",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "SmartTaxIQ", href: "/smarttaxiq" },
  { label: "Business Services", href: "/business-services" },
  { label: "Workbook", href: "/workbook" },
  { label: "Resources", href: "/resources" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
] as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  body: string;
  bullets: string[];
  href: string;
  division: "tax" | "credit" | "business";
};

export const services: Service[] = [
  {
    slug: "tax-preparation-strategy",
    title: "Tax Preparation & Strategy",
    short:
      "Accurate filing plus a forward plan, so next year's return is decided before December.",
    body: "We prepare your return with the same care we'd give our own, then step back and look at the whole year. Strategy is where the real savings live: entity elections, estimated payments, retirement contributions, and timing decisions that most filers only discover after it's too late to use them.",
    bullets: [
      "Federal, state and local return preparation",
      "Multi-year review and amended returns",
      "Quarterly estimated payment planning",
      "Deduction and credit discovery",
      "IRS notice and letter response",
    ],
    href: "/smarttaxiq",
    division: "tax",
  },
  {
    slug: "w2-1099-self-employed",
    title: "W-2, 1099 & Self-Employed Taxes",
    short:
      "Whether you get one W-2 or a stack of 1099s, your return is handled by a licensed preparer.",
    body: "Gig work, contract income, side businesses and traditional employment often land in the same household. We sort out what belongs on a Schedule C, what qualifies as a deductible expense, and how to keep self-employment tax from becoming a spring surprise.",
    bullets: [
      "W-2 and multi-employer filings",
      "1099-NEC, 1099-K and gig income",
      "Schedule C preparation",
      "Mileage, home office and equipment deductions",
      "Self-employment tax planning",
    ],
    href: "/smarttaxiq",
    division: "tax",
  },
  {
    slug: "business-tax-returns",
    title: "Business Tax Returns",
    short:
      "LLC, S-corp, partnership and corporate returns prepared and filed on time.",
    body: "Your business return should reflect the structure you actually chose and the books you actually keep. We reconcile the two before we file, so the return matches reality and holds up under review.",
    bullets: [
      "1065, 1120 and 1120-S preparation",
      "K-1 preparation and distribution",
      "S-corp reasonable compensation review",
      "Depreciation and asset schedules",
      "Year-end book reconciliation",
    ],
    href: "/smarttaxiq",
    division: "tax",
  },
  {
    slug: "credit-repair-building",
    title: "Credit Repair & Credit Building",
    short:
      "Remove what shouldn't be there, then build the profile lenders actually approve.",
    body: "We start with a full read of your personal and business reports. Inaccurate, unverifiable and outdated items get disputed with supporting documentation. From there the work shifts to building — the positive history, utilization and account mix that move a score and keep it moving.",
    bullets: [
      "Personal and business credit report analysis",
      "Bureau disputes with documentation",
      "Business credit profile setup",
      "Utilization and account-mix strategy",
      "Lender readiness review",
    ],
    href: "/services#credit",
    division: "credit",
  },
  {
    slug: "business-formation-compliance",
    title: "Business Formation & Compliance",
    short:
      "Form it correctly the first time, then stay in good standing year after year.",
    body: "Choosing an entity is a tax decision as much as a legal one, which is why formation and tax planning belong in the same conversation. We handle the filings, the federal ID, the registrations — and the annual obligations most owners forget until a notice arrives.",
    bullets: [
      "LLC, S-corp, C-corp and nonprofit formation",
      "EIN and federal tax ID registration",
      "Registered agent and annual reports",
      "Licenses, permits and sales tax registration",
      "Operating agreements and corporate records",
    ],
    href: "/business-services",
    division: "business",
  },
  {
    slug: "bookkeeping-payroll",
    title: "Bookkeeping & Payroll",
    short:
      "Clean books all year means no scramble in April and no guessing in between.",
    body: "Monthly bookkeeping keeps your numbers current enough to make decisions with. Payroll keeps your team paid and your withholdings correct. Together they make tax season a formality instead of an emergency.",
    bullets: [
      "Monthly bookkeeping and reconciliation",
      "Profit and loss and balance sheet reporting",
      "Payroll processing and filings",
      "Payroll tax registration (SUI / SIT)",
      "Audit-ready recordkeeping",
    ],
    href: "/business-services#bookkeeping",
    division: "business",
  },
  {
    slug: "small-business-consulting",
    title: "Small Business Consulting",
    short:
      "A seasoned partner in your corner, reviewing what's working and fixing what isn't.",
    body: "Most small businesses don't fail on the product — they fail on the management. We look at your processes, your pricing, your cash flow and your goals, then build an action plan you can actually execute, with regular check-ins to keep it honest.",
    bullets: [
      "Business assessment and goal setting",
      "Process and pricing review",
      "Cash flow and funding readiness",
      "Written action plans with milestones",
      "Regular accountability check-ins",
    ],
    href: "/services#consulting",
    division: "business",
  },
];

export const testimonials = [
  {
    quote:
      "I was going through a rough time and my credit score was a 499. Since I have been working with her my credit is now 625, from January until now. I would definitely recommend her company.",
    name: "Tinka Cox",
    detail: "Credit repair client",
  },
  {
    quote:
      "She helped me take my credit score from 420 to 740 in just a few months — and went back to fix my taxes from previous years too. She filed my amendments, found deductions I didn't even know I missed, and made sure I got the max return.",
    name: "T. Gardner",
    detail: "Tax & credit client",
  },
  {
    quote:
      "Lashanda's been doing my taxes for years and I trust her completely. She breaks everything down so it's easy to understand and never misses a detail.",
    name: "J. Owens",
    detail: "Tax preparation client",
  },
  {
    quote:
      "She's been completely hands-on with the start-up process for my home care agency — EIN, LLC, business banking, website. She helped me set three strong goals to move my company in the right direction.",
    name: "LivingSolutions",
    detail: "Business formation client",
  },
  {
    quote:
      "Everything Carter Cole & Associates touches turns to gold. My work was done in a very professional way and my portfolio was set up with an expert touch.",
    name: "Darlene Harden",
    detail: "Business services client",
  },
  {
    quote:
      "Through their business coaching program, I'm on the path to creating the financial future my family and I deserve.",
    name: "Derrell Bowden",
    detail: "Consulting client",
  },
];
