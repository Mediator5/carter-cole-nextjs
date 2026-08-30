import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/Section";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Tax preparation and strategy, W-2 and self-employed returns, business tax returns, credit repair and building, business formation, bookkeeping and payroll, and small business consulting.",
  alternates: { canonical: "/services" },
};

const anchors: Record<string, string> = {
  "credit-repair-building": "credit",
  "small-business-consulting": "consulting",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your money touches, handled in one place"
        intro="Seven services, built to work together. Whether you came for a refund, a score, or an LLC, the rest of the picture gets looked at too."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="btn-gold">
            Book Consultation
          </Link>
          <Link href="/smarttaxiq#start" className="btn-primary">
            Start Your Tax Return
          </Link>
        </div>
      </PageHero>

      {/* Quick index */}
      <section className="border-b border-navy/10 bg-cream py-8">
        <div className="container-x flex flex-wrap gap-2">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${anchors[s.slug] ?? s.slug}`}
              className="rounded-full border border-navy/15 bg-white px-4 py-2 text-[13.5px] font-medium text-navy/75 transition hover:border-gold hover:text-navy"
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-x space-y-20 sm:space-y-24">
          {services.map((s, i) => (
            <div
              key={s.slug}
              id={anchors[s.slug] ?? s.slug}
              className="scroll-mt-32"
            >
              <Reveal>
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                  <div>
                    <span className="display block text-[46px] leading-none text-gold/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="display mt-4 text-[30px] leading-tight sm:text-[34px]">
                      {s.title}
                    </h2>
                    <span
                      className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        s.division === "tax"
                          ? "bg-emerald-700/10 text-emerald-800"
                          : s.division === "credit"
                            ? "bg-gold/20 text-navy"
                            : "bg-navy/8 text-navy/70"
                      }`}
                    >
                      {s.division === "tax"
                        ? "SmartTaxIQ division"
                        : s.division === "credit"
                          ? "Credit division"
                          : "Business division"}
                    </span>
                  </div>

                  <div>
                    <p className="prose-body">{s.body}</p>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-[15px] leading-snug text-navy/70"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                            className="mt-0.5 shrink-0"
                          >
                            <circle cx="12" cy="12" r="10" fill="#0a6b4f" opacity="0.1" />
                            <path
                              d="M8 12.5l2.6 2.6L16 9.7"
                              stroke="#0a6b4f"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href="/book" className="btn-primary text-[13.5px]">
                        Book a consultation
                      </Link>
                      {s.division === "tax" && (
                        <Link
                          href="/smarttaxiq"
                          className="btn-ghost text-[13.5px]"
                        >
                          More on SmartTaxIQ
                        </Link>
                      )}
                      {s.division === "business" && (
                        <Link
                          href="/business-services"
                          className="btn-ghost text-[13.5px]"
                        >
                          Business services detail
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
              {i < services.length - 1 && (
                <div className="mt-20 h-px w-full bg-navy/10 sm:mt-24" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bundled approach */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionHeading
              eyebrow="Why one firm"
              title="These services are not separate problems"
              intro="Your entity choice changes your tax bill. Your tax return is what a lender reads. Your credit decides your funding. Your books decide whether any of it can be proven. Handled separately, they contradict each other. Handled together, they compound."
            />
            <Reveal delay={120}>
              <Link href="/book" className="btn-primary mt-9">
                Start with one conversation
              </Link>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <div className="relative aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-[24px]">
              <Image
                src="/images/lashanda-legacy-planner.jpg"
                alt="Lashanda Carter holding the Legacy in Motion planner"
                fill
                sizes="(max-width: 1024px) 90vw, 400px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}
