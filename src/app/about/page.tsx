import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/Section";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "About Lashanda Carter, Founder",
  description:
    "Meet Lashanda Carter — serial entrepreneur, realtor and founder of Carter Cole & Associates. Two decades helping individuals and business owners build businesses and financial legacies.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Everyone starts somewhere",
    body: "We have never once told a client what they can't do. A 499 score, an unfiled year, a business idea with no capital behind it — those are starting points, not verdicts.",
  },
  {
    title: "Clarity over jargon",
    body: "If you don't understand your own return, your own score, or your own entity, you can't make decisions about them. We explain until it's clear.",
  },
  {
    title: "Build for the generation after you",
    body: "A refund is a moment. A business with clean books, good credit and a compliant structure is something you can hand to someone. We aim for the second one.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the firm"
        title="Founded by someone who has actually built the thing she's teaching"
        intro={`Lashanda Carter has been starting, growing and rescuing businesses since ${site.founded}. Carter Cole & Associates is where that experience became a firm.`}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="btn-gold">
            Book Consultation
          </Link>
          <Link href="/services" className="btn-ghost-light">
            See our services
          </Link>
        </div>
      </PageHero>

      {/* STORY */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Her story"
              title="From the rat race to the room where the decisions get made"
            />
            <Reveal delay={100}>
              <div className="prose-body mt-8 space-y-6">
                <p>
                  Carter Cole &amp; Associates began with the vision of its
                  founder, <strong className="text-navy">Lashanda Carter</strong>{" "}
                  — a serial entrepreneur and realtor who has been dedicated to
                  starting and growing businesses since {site.founded}. What
                  drove her from the beginning was a conviction that financial
                  freedom shouldn&rsquo;t be reserved for people who happened to
                  be born knowing how the system works.
                </p>
                <p>
                  She learned it the way most people do: by doing it, getting it
                  wrong, and doing it again. Entity structures. Credit lines that
                  approved and credit lines that didn&rsquo;t. Tax bills that
                  arrived larger than expected because nobody had planned for
                  them. Every one of those lessons cost something — and every one
                  of them is now part of what clients get in a single
                  conversation.
                </p>
                <p>
                  Today Lashanda leads a team of entrepreneurs who are as
                  invested in your business as they are in their own. Together
                  they have helped hundreds of aspiring business owners not just
                  meet their goals for real-world growth and profitability, but
                  pass them.
                </p>
                <p>
                  The firm now spans two divisions:{" "}
                  <strong className="text-navy">Carter Cole &amp; Associates</strong>{" "}
                  for credit, formation, compliance, bookkeeping and consulting,
                  and{" "}
                  <Link
                    href="/smarttaxiq"
                    className="font-semibold text-emerald-700 underline decoration-gold underline-offset-4"
                  >
                    SmartTaxIQ
                  </Link>{" "}
                  for everything tax. One relationship, one strategy, one team
                  who knows your full picture.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px]">
                <Image
                  src="/images/lashanda-headshot-polo.jpg"
                  alt="Portrait of Lashanda Carter"
                  fill
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 rounded-2xl border border-navy/10 bg-cream p-7">
                <span className="display block text-[24px]">
                  Lashanda Carter
                </span>
                <span className="mt-1 block text-[12px] uppercase tracking-[0.16em] text-emerald-700">
                  Founder &amp; Principal
                </span>
                <ul className="mt-5 space-y-3 text-[14.5px] text-navy/65">
                  {[
                    "Serial entrepreneur and licensed realtor",
                    "Tax preparation with active PTIN & EFIN credentials",
                    "Credit repair and business credit strategist",
                    `Building and advising businesses since ${site.founded}`,
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
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

      {/* MISSION / VISION */}
      <section className="bg-navy py-20 text-white sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow !text-gold-300">Our mission</span>
            <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[36px]">
              To put the tools of financial control in ordinary hands
            </h2>
            <p className="mt-6 text-[16.5px] leading-[1.8] text-white/70">
              We help people repair and build credit so they can start or grow a
              business, file returns that are both accurate and strategic, and
              understand the practices that keep a company running long after the
              excitement of launch wears off. We do it through expert coaching,
              honest consultation, and work we&rsquo;re willing to put our name
              on.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <span className="eyebrow !text-gold-300">Our vision</span>
            <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[36px]">
              A generation of owners, not just earners
            </h2>
            <p className="mt-6 text-[16.5px] leading-[1.8] text-white/70">
              We want every client to walk away with something transferable — a
              business that stands on its own, credit that opens doors, records
              that hold up, and knowledge they can pass down. That&rsquo;s what
              we mean by legacy, and it&rsquo;s the standard we measure our work
              against.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we believe"
            title="Three convictions that shape every engagement"
            align="center"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="card h-full">
                  <div className="rule-gold" />
                  <h3 className="display mt-5 text-[22px] leading-tight">
                    {v.title}
                  </h3>
                  <p className="mt-4 text-[15.5px] leading-[1.75] text-navy/60">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Track record"
            title="Numbers from the work, not from a brochure"
            align="center"
          />
          <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3">
            {[
              ["91%", "of client businesses saw increased revenue"],
              ["89%", "of clients improved their credit score"],
              ["93%", "positive feedback from businesses we coached"],
            ].map(([stat, label], i) => (
              <Reveal key={label} delay={i * 90}>
                <div className="text-center">
                  <span className="display block text-[48px] leading-none text-emerald-700">
                    {stat}
                  </span>
                  <p className="mx-auto mt-4 max-w-[220px] text-[14.5px] leading-snug text-navy/60">
                    {label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials limit={6} />
      <CTA
        title="Let's talk about what you're building"
        image="/images/lashanda-gold-gown.jpg"
      />
    </>
  );
}
