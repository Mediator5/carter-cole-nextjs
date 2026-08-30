import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/Section";
import Accordion, { type FaqItem } from "@/components/Accordion";
import SmartTaxLogo from "@/components/SmartTaxLogo";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "SmartTaxIQ — Tax Division",
  description:
    "SmartTaxIQ is the tax division of Carter Cole & Associates. Licensed preparers with active PTIN and EFIN credentials, secure digital filing, accuracy guarantee. Personal, self-employed and business returns.",
  alternates: { canonical: "/smarttaxiq" },
};

const pillars = [
  {
    title: "Licensed & experienced professionals",
    body: "Our team holds active PTINs and verified EFIN credentials — your return is prepared by qualified, licensed experts who follow current IRS regulations closely.",
  },
  {
    title: "Accuracy you can count on",
    body: "Every return is reviewed for precision and compliance. We stand behind our work with an accuracy guarantee and full support from start to finish.",
  },
  {
    title: "Secure digital process",
    body: "Upload, review and sign your documents safely through our encrypted client portal. Your personal and financial information stays private and protected.",
  },
  {
    title: "Clear communication",
    body: "We take the time to explain your return, answer your questions, and help you understand your financial picture in plain language.",
  },
  {
    title: "Comprehensive tax & bookkeeping",
    body: "From W-2s and 1099s to Schedule C filings and business returns, we manage every tax need under one roof — including bookkeeping that keeps you audit-ready year-round.",
  },
  {
    title: "Rooted in the community",
    body: "We serve individuals and small businesses across Michigan with honesty, care, and a personal touch that large national chains can't match.",
  },
];

const steps = [
  {
    n: "1",
    title: "Book your session",
    body: "Schedule a complimentary 30-minute discovery call or in-person meeting. We'll discuss your goals, your situation, and how SmartTaxIQ can support you.",
  },
  {
    n: "2",
    title: "Review & organize",
    body: "Meet with your licensed preparer to review your documents and identify every opportunity for savings before anything gets filed.",
  },
  {
    n: "3",
    title: "File with confidence",
    body: "We prepare and file your return securely, keeping you informed at every stage — and we're here after filing if the IRS has questions.",
  },
];

const bring = [
  "Last year's tax return",
  "W-2s, 1099s, and any income documents",
  "Receipts for deductions — childcare, education, medical, business expenses",
  "Bank account information for direct deposit",
  "Any IRS letters or notices you've received",
  "Business books or profit-and-loss statement, if you file for a business",
];

const faqs: FaqItem[] = [
  {
    q: "How do I get started with SmartTaxIQ?",
    a: "Book your complimentary 30-minute discovery session using the button on this page, or call us directly. We'll confirm what documents you need and schedule your preparation appointment — in person or fully remote, whichever you prefer.",
  },
  {
    q: "Do I need to bring all my tax documents to the first meeting?",
    a: "Not to the discovery session — that conversation is about understanding your situation. Bring what you have. For your actual preparation appointment, use the checklist on this page, and if something is missing we'll help you track it down.",
  },
  {
    q: "Are my personal and financial details secure?",
    a: "Yes. Documents are uploaded, reviewed and signed through an encrypted client portal with bank-level protection. We never ask you to email sensitive documents unprotected.",
  },
  {
    q: "Can SmartTaxIQ help with business taxes too?",
    a: "That's a large part of what we do. Sole proprietors and Schedule C filers, single- and multi-member LLCs, S-corps, partnerships and corporations. We also prepare K-1s and handle year-end book reconciliation before filing.",
  },
  {
    q: "How long does it take to complete my return?",
    a: "Most straightforward personal returns are prepared within a few business days of receiving complete documents. Business returns and multi-year filings take longer, and we'll give you a realistic timeline at the start rather than a hopeful one.",
  },
  {
    q: "What if I haven't filed for a few years?",
    a: "You are far from the first. We handle back filings and amended returns regularly, including cases where earlier returns missed deductions you were entitled to. The sooner we start, the more options remain available.",
  },
  {
    q: "Do you handle IRS letters and notices?",
    a: "Yes. Bring us the notice — don't ignore it and don't panic. Most letters are routine and resolvable, and we'll tell you plainly which kind you're holding.",
  },
];

export default function SmartTaxIQPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-navy to-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-emerald-600/25 blur-3xl"
        />
        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                The tax division of {site.shortName} &amp; Associates
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7">
                <span className="sr-only">SmartTaxIQ</span>
                <SmartTaxLogo
                  variant="light"
                  width={430}
                  priority
                  className="w-[280px] sm:w-[360px] lg:w-[430px]"
                />
              </h1>
              <p className="mt-5 text-[14px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                Clarity · Transformation · Legacy
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-7 max-w-xl text-[17.5px] leading-[1.75] text-white/75">
                We go beyond tax preparation to help you build lasting financial
                clarity and confidence. Secure modern tools, licensed
                professionals, and a process that makes filing simple, accurate
                and stress-free — whether you file as an individual or run a
                business.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="#start" className="btn-gold">
                  Start Your Tax Return
                </Link>
                <Link href="/book" className="btn-ghost-light">
                  Book a Discovery Session
                </Link>
                <a href={site.taxPhoneHref} className="btn-ghost-light">
                  Call {site.taxPhone}
                </a>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-7 text-[13.5px] text-white/60">
                <span>✓ Active PTIN &amp; EFIN credentials</span>
                <span>✓ Accuracy guarantee</span>
                <span>✓ Encrypted client portal</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[24px] border border-white/10">
              <Image
                src="/images/lashanda-laptop-laughing.jpg"
                alt="Lashanda Carter preparing a client return"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why SmartTaxIQ"
            title="Expertise, integrity, and tools built for this decade"
            intro="Filing is the easy part. Doing it accurately, defensibly and in a way that sets up next year — that's the work."
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="card h-full">
                  <div className="rule-gold" />
                  <h3 className="mt-5 text-[17.5px] font-semibold text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-navy/60">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-navy py-20 text-white sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <span className="eyebrow !text-gold-300">Our mission</span>
            <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[38px]">
              Tax season should bring clarity, not confusion
            </h2>
            <p className="mt-6 text-[17px] leading-[1.8] text-white/70">
              Our mission is to give every client the confidence that comes from
              working with people who care about your goals as much as you do.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Personalized, professional service for individuals and businesses",
                "Organized bookkeeping that keeps your finances audit-ready",
                "Clear explanations and transparent communication",
                "Strategies built to save you time, stress, and money",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-[16px] text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[3/4] w-full max-w-[400px] overflow-hidden rounded-[24px] border border-white/10 lg:ml-auto">
              <Image
                src="/images/planner-desk-flatlay.jpg"
                alt="SmartTaxIQ planner and materials on a desk"
                fill
                sizes="(max-width: 1024px) 90vw, 400px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="How it works"
            title="Simple, fast and secure — in three steps"
            align="center"
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="card h-full text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-[20px] font-semibold text-white">
                    {s.n}
                  </span>
                  <h3 className="display mt-6 text-[22px]">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-navy/60">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT TO BRING */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Come prepared"
              title="What to bring to your first meeting"
              intro="Nothing here is a hard requirement for the discovery session — bring what you have and we'll help you find the rest."
            />
          </div>
          <Reveal delay={120}>
            <ul className="grid gap-4">
              {bring.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-4 rounded-xl border border-navy/10 bg-white px-5 py-4 text-[15.5px] text-navy/75"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="mt-0.5 shrink-0"
                  >
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="18"
                      rx="2"
                      stroke="#ddb33c"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8.5 12l2.2 2.2L15.5 9.4"
                      stroke="#0a6b4f"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* START YOUR RETURN */}
      <section id="start" className="scroll-mt-28 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Start your return"
            title="Choose the form that fits your situation"
            intro="Select personal or business filing to begin. Both start with a licensed preparer reviewing your information — there is no automated black box here."
            align="center"
          />

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border-2 border-navy/10 bg-white p-8 transition hover:border-emerald-700/40">
                <span className="eyebrow">Individuals</span>
                <h3 className="display mt-4 text-[26px]">Personal Tax</h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-navy/60">
                  W-2 employees, 1099 contractors, gig income, families claiming
                  credits, and anyone with a return from a prior year that
                  needs a second look.
                </p>
                <a
                  href={site.jotform.personalTax}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-7 w-full"
                >
                  Start Personal Return
                </a>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="flex h-full flex-col rounded-2xl border-2 border-navy/10 bg-white p-8 transition hover:border-emerald-700/40">
                <span className="eyebrow">Business owners</span>
                <h3 className="display mt-4 text-[26px]">Business Tax</h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-navy/60">
                  Sole proprietors and Schedule C filers, LLCs, S-corps,
                  partnerships and corporations — including K-1s and year-end
                  book reconciliation.
                </p>
                <a
                  href={site.jotform.businessTax}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-navy mt-7 w-full"
                >
                  Start Business Return
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <p className="mt-8 text-center text-[13.5px] text-navy/45">
              Prefer to talk first?{" "}
              <Link
                href="/book"
                className="font-semibold text-emerald-700 underline decoration-gold underline-offset-4"
              >
                Book a free 30-minute discovery session
              </Link>{" "}
              or call {site.taxPhone}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Questions"
              title="Frequently asked"
              intro="Still unsure about something? Call us — we answer these on the phone every day."
            />
          </div>
          <Reveal delay={100}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTA
        title="Ready to file with someone who actually reads your return?"
        intro="Start with a free 30-minute discovery session. We'll tell you where you stand, what's recoverable from prior years, and what to do differently this year."
        image="/images/lashanda-laptop-laughing.jpg"
      />
    </>
  );
}
