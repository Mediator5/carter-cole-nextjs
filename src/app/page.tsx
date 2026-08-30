import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/Section";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import SmartTaxLogo from "@/components/SmartTaxLogo";

const steps = [
  {
    n: "01",
    title: "Book a consultation",
    body: "A no-cost conversation about where you actually are — income, filings, credit, entity, goals. No sales pitch, just a read on the situation.",
  },
  {
    n: "02",
    title: "Get a written plan",
    body: "We come back with the specific moves: what to file, what to fix, what to form, and in what order. You'll know the cost and the timeline before anything starts.",
  },
  {
    n: "03",
    title: "We do the work with you",
    body: "Returns filed, disputes sent, entity formed, books cleaned. You stay informed at every stage and never wonder what's happening.",
  },
];

export default function HomePage() {
  // Computed rather than hardcoded, so it never silently goes stale.
  const years = Math.max(1, new Date().getFullYear() - site.founded);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[560px] w-[560px] rounded-full bg-emerald-700/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-1/3 h-[380px] w-[380px] rounded-full bg-gold/10 blur-3xl"
        />

        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-[1.25fr_0.85fr] lg:py-24">
          <div>
            <Reveal>
              <span className="eyebrow !text-gold-300">
                Tax · Credit · Business — since {site.founded}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display mt-6 text-balance text-[40px] leading-[1.05] text-white sm:text-[54px] lg:text-[60px]">
                Clarity in your taxes.
                <br />
                Confidence in your credit.
                <br />
                <span className="text-gold-300">A legacy in your name.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-[17.5px] leading-[1.75] text-white/70">
                Carter Cole &amp; Associates is a Detroit-based firm helping
                individuals and business owners file smarter, repair and build
                credit, form compliant businesses, and keep clean books — all
                under one roof. Our tax division,{" "}
                <span className="font-semibold text-white">SmartTaxIQ</span>,
                handles everything from a single W-2 to a multi-member return.
              </p>
            </Reveal>

            <Reveal delay={230}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/book" className="btn-gold">
                  Get Started
                </Link>
                <Link href="/book" className="btn-primary">
                  Book Consultation
                </Link>
                <Link href="/smarttaxiq#start" className="btn-ghost-light">
                  Start Your Tax Return
                </Link>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/12 pt-8">
                {[
                  [`${years}+`, "Years in business"],
                  ["Hundreds", "Businesses launched"],
                  ["11", "5-star reviews"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="display text-[26px] text-gold-300 sm:text-[30px]">
                      {value}
                    </dt>
                    <dd className="mt-1 text-[13px] leading-snug text-white/50">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={140} className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[28px] border border-gold/25"
              />
              <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                <Image
                  src="/images/lashanda-arms-crossed.jpg"
                  alt="Lashanda Carter, Founder of Carter Cole & Associates"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 460px"
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 max-w-[230px] rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:-left-8">
                <span className="display block text-[19px] text-navy">
                  Lashanda Carter
                </span>
                <span className="mt-1 block text-[12px] uppercase tracking-[0.14em] text-emerald-700">
                  Founder
                </span>
                <p className="mt-3 text-[13px] leading-snug text-navy/55">
                  Serial entrepreneur, tax professional, and credit strategist.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- TAX BANNER ---------------- */}
      <section className="border-b border-navy/10 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SmartTaxLogo
              variant="light"
              width={230}
              className="w-[200px] shrink-0 sm:w-[230px]"
            />
            <span
              aria-hidden
              className="hidden h-12 w-px shrink-0 bg-white/25 sm:block"
            />
            <div>
              <p className="text-[16.5px] font-semibold">
                Tax season is handled by our tax division
              </p>
              <p className="mt-1 text-[14.5px] text-white/75">
                Licensed preparers, active PTIN and EFIN credentials, secure
                document upload, accuracy guarantee.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/smarttaxiq" className="btn-gold text-[13.5px]">
              Explore SmartTaxIQ
            </Link>
            <a href={site.taxPhoneHref} className="btn-ghost-light text-[13.5px]">
              {site.taxPhone}
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- WHO WE ARE ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-[24px]">
              <Image
                src="/images/lashanda-desk-writing.jpg"
                alt="Lashanda Carter working at her desk"
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 right-2 hidden rounded-2xl bg-navy px-6 py-5 text-white shadow-xl sm:block lg:right-0">
              <span className="display block text-[30px] text-gold-300">
                {years}+
              </span>
              <span className="mt-1 block max-w-[120px] text-[12.5px] leading-snug text-white/60">
                years helping people build businesses that last
              </span>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Who we are"
              title="One firm for the money decisions that shape your future"
              intro="Most people are handed off between a tax preparer, a credit company, a registered agent, and a bookkeeper — and none of them talk to each other. We built Carter Cole & Associates so that all of it sits in one place, with one person who knows your whole picture."
            />
            <Reveal delay={120}>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  {
                    title: "We file it",
                    body: "Personal, self-employed and business returns prepared by licensed professionals through SmartTaxIQ.",
                  },
                  {
                    title: "We fix it",
                    body: "Credit reports analyzed, inaccurate items disputed, and a real profile built in their place.",
                  },
                  {
                    title: "We form it",
                    body: "LLCs, S-corps and nonprofits set up correctly — with the compliance calendar to keep them standing.",
                  },
                  {
                    title: "We keep it clean",
                    body: "Monthly bookkeeping and payroll so your numbers are always ready for a lender, a buyer, or the IRS.",
                  },
                ].map((item) => (
                  <div key={item.title} className="border-l-2 border-gold pl-5">
                    <h3 className="text-[16.5px] font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-navy/60">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <Link href="/about" className="btn-ghost mt-10">
                Read Lashanda&rsquo;s story
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section id="services" className="bg-cream py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we do"
            title="Seven services, one coordinated strategy"
            intro="Start with whatever is most urgent. Everything else connects to it — because your entity affects your taxes, your taxes affect your credit, and your credit decides what you can build next."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link href={s.href} className="card-hover group flex h-full flex-col">
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      s.division === "tax"
                        ? "bg-emerald-700/10 text-emerald-800"
                        : s.division === "credit"
                          ? "bg-gold/20 text-navy"
                          : "bg-navy/8 text-navy/70"
                    }`}
                  >
                    {s.division === "tax"
                      ? "SmartTaxIQ"
                      : s.division === "credit"
                        ? "Credit"
                        : "Business"}
                  </span>
                  <h3 className="display mt-5 text-[23px] leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-navy/60">
                    {s.short}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-emerald-700">
                    Learn more
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={services.length * 60}>
              <div className="flex h-full flex-col justify-between rounded-2xl bg-navy p-7 text-white">
                <div>
                  <h3 className="display text-[23px] leading-tight text-white">
                    Not sure where to start?
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-white/65">
                    Most people aren&rsquo;t. Book the consultation and
                    we&rsquo;ll tell you which of these you actually need — and
                    which you don&rsquo;t.
                  </p>
                </div>
                <Link href="/book" className="btn-gold mt-7 w-full">
                  Book Consultation
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="How we help"
            title="Three steps, no mystery"
            intro="You should never wonder what stage you're in or what it's going to cost. Here's exactly how working together goes."
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="relative">
                  <span className="display block text-[52px] leading-none text-gold/45">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-[19px] font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.75] text-navy/60">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <div className="mt-14 flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary">
                Get Started
              </Link>
              <Link href="/services" className="btn-ghost">
                See all services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="border-y border-navy/10 bg-white py-16">
        <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Licensed & credentialed",
              body: "Active PTIN and verified EFIN. Your return is prepared by a qualified professional, not seasonal help.",
            },
            {
              title: "Accuracy guarantee",
              body: "Every return is reviewed for precision and compliance, and we stand behind the work we file.",
            },
            {
              title: "Secure digital process",
              body: "Upload, review and sign through an encrypted client portal. Your information stays protected.",
            },
            {
              title: "Plain-language answers",
              body: "We explain the return, the score, and the strategy in language you can actually act on.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div>
                <div className="rule-gold" />
                <h3 className="mt-5 text-[16.5px] font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-navy/60">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials limit={3} />
      <CTA />
    </>
  );
}
