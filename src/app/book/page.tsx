import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import JotFormEmbed from "@/components/JotFormEmbed";
import SmartTaxLogo from "@/components/SmartTaxLogo";
import TaxFormTabs from "@/components/TaxFormTabs";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a free consultation with Carter Cole & Associates, start your tax return with SmartTaxIQ, or send an inquiry to the right department.",
  alternates: { canonical: "/book" },
};

const paths = [
  {
    title: "Book a consultation",
    tag: "Most people start here",
    body: "A complimentary 30-minute conversation about your taxes, credit, entity or books. You'll leave knowing what to do next, whether or not you hire us.",
    cta: `Call ${site.phone}`,
    href: site.phoneHref,
    external: true,
    accent: "emerald" as const,
  },
  {
    title: "Start your tax return",
    tag: "SmartTaxIQ",
    body: "Ready to file? Choose personal or business below and submit your information securely to a licensed preparer.",
    cta: "Go to the intake form",
    href: "#start-return",
    external: false,
    accent: "gold" as const,
  },
  {
    title: "Send an inquiry",
    tag: "Questions first",
    body: "Not sure what you need, or just want a straight answer before committing to anything? Send a message and we'll route it to the right department.",
    cta: "Use the form below",
    href: "#inquiry",
    external: false,
    accent: "navy" as const,
  },
];

const expect = [
  {
    n: "01",
    title: "Before the call",
    body: "You'll get a confirmation with the time and, if relevant, a short list of what to have handy. Nothing lengthy — we're not going to make you do homework to talk to us.",
  },
  {
    n: "02",
    title: "During the call",
    body: "30 minutes. We ask about your income, your filings, your entity and your goals, and we tell you honestly what we see — including when the answer is that you don't need us yet.",
  },
  {
    n: "03",
    title: "After the call",
    body: "A written summary of the recommended next steps with a clear scope and cost. No pressure and no surprise invoices.",
  },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Get started"
        title="Book a consultation, start a return, or just ask us a question"
        intro="Three ways in, all of them free to begin. Choose whichever matches where you are right now."
      >
        <p className="text-[14px] text-white/55">
          {site.hours} · Every inquiry answered within 2 business days.
        </p>
      </PageHero>

      {/* Three paths */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          {paths.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div
                className={`flex h-full flex-col rounded-2xl border-2 p-8 transition ${
                  p.accent === "emerald"
                    ? "border-emerald-700/30 bg-emerald-700/[0.04]"
                    : p.accent === "gold"
                      ? "border-gold/40 bg-gold/[0.06]"
                      : "border-navy/12 bg-white"
                }`}
              >
                {p.accent === "gold" ? (
                  <SmartTaxLogo width={150} className="w-[150px]" />
                ) : (
                  <span className="eyebrow">{p.tag}</span>
                )}
                <h2 className="display mt-4 text-[25px] leading-tight">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-navy/60">
                  {p.body}
                </p>
                {p.external ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-7 w-full"
                  >
                    {p.cta}
                  </a>
                ) : (
                  <Link
                    href={p.href}
                    className={`mt-7 w-full ${
                      p.accent === "gold" ? "btn-gold" : "btn-ghost"
                    }`}
                  >
                    {p.cta}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tax intake forms */}
      <section
        id="start-return"
        className="scroll-mt-28 bg-cream py-20 sm:py-24"
      >
        <div className="container-x">
          <SectionHeading
            eyebrow="Start your return"
            title="Choose the form that fits your situation"
            intro="Both forms go straight to a licensed preparer — you can upload documents as you go and save your progress. Pick personal or business to begin."
            align="center"
          />
          <Reveal delay={100}>
            <div className="mx-auto mt-12 max-w-3xl">
              <TaxFormTabs />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Consultation scheduling */}
      {site.jotform.consultation ? (
        <section className="py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading
              eyebrow="Schedule"
              title="Pick a time that works for you"
              align="center"
            />
            <Reveal delay={100}>
              <div className="mx-auto mt-12 max-w-3xl">
                <JotFormEmbed
                  src={site.jotform.consultation}
                  title="Book a consultation with Carter Cole & Associates"
                />
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="py-20 sm:py-24">
          <div className="container-x">
            <Reveal>
              <div className="mx-auto max-w-3xl rounded-2xl border border-navy/10 bg-white p-9 text-center sm:p-12">
                <span className="eyebrow justify-center">
                  Booking a consultation
                </span>
                <h2 className="display mt-4 text-[28px] leading-tight sm:text-[32px]">
                  Call us and we&rsquo;ll find a time
                </h2>
                <p className="prose-body mx-auto mt-4 max-w-lg">
                  Consultations are scheduled by phone or through the inquiry
                  form below — whichever is easier for you. Either way you
                  hear back within two business days.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href={site.phoneHref} className="btn-primary">
                    Call {site.phone}
                  </a>
                  <a href={site.taxPhoneHref} className="btn-ghost">
                    Tax division: {site.taxPhone}
                  </a>
                  <Link href="#inquiry" className="btn-ghost">
                    Send an inquiry
                  </Link>
                </div>
                <p className="mt-6 text-[13.5px] text-navy/45">{site.hours}</p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* What to expect */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What to expect"
            title="No mystery, no pressure"
            align="center"
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {expect.map((e, i) => (
              <Reveal key={e.n} delay={i * 90}>
                <div>
                  <span className="display block text-[46px] leading-none text-gold/45">
                    {e.n}
                  </span>
                  <h3 className="mt-4 text-[18.5px] font-semibold text-navy">
                    {e.title}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.75] text-navy/60">
                    {e.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="scroll-mt-28 bg-navy py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <span className="eyebrow !text-gold-300">Send an inquiry</span>
            <h2 className="display mt-4 text-[30px] leading-tight text-white sm:text-[36px]">
              Tell us what you need and we&rsquo;ll route it correctly
            </h2>
            <p className="mt-5 text-[16.5px] leading-[1.8] text-white/70">
              Tax questions go to SmartTaxIQ. Credit, formation, bookkeeping and
              consulting go to the main office. Choose the department in the form
              and it lands in the right inbox.
            </p>
            <div className="mt-9 space-y-4 border-t border-white/12 pt-8 text-[15px] text-white/70">
              <p>
                <span className="block text-[12px] uppercase tracking-wide text-white/40">
                  Main office
                </span>
                <a href={site.phoneHref} className="text-white hover:text-gold-300">
                  {site.phone}
                </a>{" "}
                ·{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-gold-300"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <span className="block text-[12px] uppercase tracking-wide text-white/40">
                  SmartTaxIQ tax division
                </span>
                <a
                  href={site.taxPhoneHref}
                  className="text-white hover:text-gold-300"
                >
                  {site.taxPhone}
                </a>
              </p>
              <p>{site.hours}</p>
            </div>
          </div>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
