import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/Section";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Business Services",
  description:
    "Business formation, entity selection, EIN registration, licenses and permits, registered agent service, annual compliance, bookkeeping and payroll from Carter Cole & Associates.",
  alternates: { canonical: "/business-services" },
};

const groups = [
  {
    id: "formation",
    stage: "Starting out",
    title: "Business formation & entity setup",
    intro:
      "The entity you choose determines how you're taxed, what you're liable for, and how easily you can raise money later. We help you pick it deliberately instead of defaulting into it.",
    items: [
      "LLC (single-member and multi-member)",
      "S corporation and C corporation",
      "Limited liability partnership (LLP)",
      "Professional corporation",
      "Nonprofit corporation and 501(c)(3) filings",
      "Sole proprietorship and general partnership",
      "Entity comparison and recommendation",
      "Operating agreements, bylaws and corporate minutes",
    ],
  },
  {
    id: "names",
    stage: "Protecting it",
    title: "Names, DBAs & trademark protection",
    intro:
      "Before you print anything, make sure the name is available, registered, and yours to defend.",
    items: [
      "Business name search and availability",
      "Name reservations",
      "Doing Business As (DBA) filings",
      "Trademark search",
      "Trademark registration",
    ],
  },
  {
    id: "licenses",
    stage: "Getting legal",
    title: "Licenses, permits & tax registrations",
    intro:
      "The paperwork that turns a registered entity into a business that can legally invoice, hire and collect.",
    items: [
      "Federal Tax ID numbers (EIN)",
      "Entity classification and S-corp elections",
      "Sales and use tax permits",
      "Business licenses",
      "Payroll registration",
      "Payroll tax registration (SUI / SIT)",
    ],
  },
  {
    id: "compliance",
    stage: "Staying in good standing",
    title: "Compliance & ongoing filings",
    intro:
      "Most businesses don't lose good standing on purpose — they lose it by forgetting. We keep the calendar so you don't have to.",
    items: [
      "Registered agent services",
      "Initial and annual reports",
      "Annual meeting minutes",
      "Certificates of good standing",
      "Certified copies and apostille",
      "Articles of amendment and entity conversions",
      "Foreign qualifications and reinstatements",
      "Articles of dissolution (closing a business)",
    ],
  },
  {
    id: "bookkeeping",
    stage: "Running it well",
    title: "Bookkeeping, payroll & records",
    intro:
      "Clean books are the difference between guessing and knowing — and between an approved loan application and a declined one.",
    items: [
      "Monthly bookkeeping and reconciliation",
      "Profit and loss and balance sheet reporting",
      "Payroll processing and tax filings",
      "Year-end close and tax-ready packages",
      "Corporate and LLC kits, seals and certificates",
    ],
  },
];

export default function BusinessServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Business services"
        title="Everything it takes to start a business — and everything it takes to keep it"
        intro="Formation is a single day. Compliance is every year after. We handle both, and we do it with your tax position in mind rather than in isolation."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="btn-gold">
            Book Consultation
          </Link>
          <Link href="/contact" className="btn-ghost-light">
            Ask a question
          </Link>
        </div>
      </PageHero>

      {/* Nav strip */}
      <section className="border-b border-navy/10 bg-cream py-8">
        <div className="container-x flex flex-wrap gap-2">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-navy/15 bg-white px-4 py-2 text-[13.5px] font-medium text-navy/75 transition hover:border-gold hover:text-navy"
            >
              {g.title}
            </a>
          ))}
        </div>
      </section>

      {/* Intro + image */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Two decades of filings"
              title="We have been doing this since before it was a website"
              intro="Registering entities, chasing down permits, fixing structures that were set up wrong by someone cheaper. That experience is why we can tell you in one call whether your plan is going to work — and what it will actually cost to fix if it doesn't."
            />
            <Reveal delay={120}>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {[
                  ["Formed", "Hundreds of entities registered"],
                  ["Filed", "Annual reports kept current"],
                  ["Coached", "Owners guided past year one"],
                ].map(([k, v]) => (
                  <div key={k} className="border-l-2 border-gold pl-4">
                    <span className="display block text-[20px] text-navy">
                      {k}
                    </span>
                    <span className="mt-1 block text-[14px] leading-snug text-navy/55">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[24px] lg:ml-auto">
              <Image
                src="/images/lashanda-mug.jpg"
                alt="Lashanda Carter at her desk"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Groups */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x space-y-16">
          {groups.map((g, i) => (
            <Reveal key={g.id} delay={i * 40}>
              <div id={g.id} className="scroll-mt-32">
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                  <div>
                    <span className="eyebrow">{g.stage}</span>
                    <h2 className="display mt-4 text-[28px] leading-tight sm:text-[32px]">
                      {g.title}
                    </h2>
                    <p className="mt-4 text-[15.5px] leading-[1.75] text-navy/60">
                      {g.intro}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-navy/10 bg-white p-7">
                    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {g.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[15px] leading-snug text-navy/70"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/book" className="btn-ghost mt-7 text-[13.5px]">
                      Get help with this
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Consulting callout */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="rounded-3xl border border-navy/10 bg-navy p-10 text-white sm:p-14">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <span className="eyebrow !text-gold-300">
                    Small business consulting
                  </span>
                  <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[36px]">
                    Why do some small businesses thrive while others quietly
                    close?
                  </h2>
                  <p className="mt-5 text-[16.5px] leading-[1.8] text-white/70">
                    It is rarely the product. It is almost always the
                    management — pricing that never got revisited, cash flow
                    nobody watched, a plan that lived in someone&rsquo;s head.
                    Our coaching program puts an experienced partner in the room
                    with you.
                  </p>
                  <Link href="/book" className="btn-gold mt-8">
                    Book a coaching consultation
                  </Link>
                </div>
                <ul className="space-y-4">
                  {[
                    "Work directly with an experienced business partner",
                    "Analyze your current processes for improvement",
                    "Develop action plans your team can execute",
                    "Receive honest feedback on performance and progress",
                    "Hold regular check-ins to keep momentum",
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 border-b border-white/10 pb-4 text-[15.5px] text-white/80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        title="Let's get your business set up right"
        intro="Whether you're forming your first LLC or cleaning up a structure someone else set up, start with a consultation."
        image="/images/lashanda-desk-writing.jpg"
      />
    </>
  );
}
