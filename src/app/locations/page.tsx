import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/Section";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Carter Cole & Associates and SmartTaxIQ serve clients in Detroit, Michigan — in person and fully remote across the state.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="Detroit, Michigan — in person or fully remote"
        intro="Meet us at the office or handle everything through the secure client portal. The service and the people are the same either way."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="btn-gold">
            Book Consultation
          </Link>
          <a href={site.phoneHref} className="btn-ghost-light">
            Call {site.phone}
          </a>
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Main office"
              title="Detroit"
              intro="Carter Cole & Associates — main office and home of the SmartTaxIQ tax division."
            />

            <Reveal delay={100}>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="card">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Address
                  </span>
                  <address className="mt-3 not-italic text-[16px] leading-relaxed text-navy/75">
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </address>
                  <p className="mt-3 text-[13px] text-navy/45">
                    Visits by appointment.
                  </p>
                </div>

                <div className="card">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Hours
                  </span>
                  <p className="mt-3 text-[16px] leading-relaxed text-navy/75">
                    Monday – Thursday
                    <br />
                    9:30am – 5:00pm ET
                  </p>
                  <p className="mt-3 text-[13px] text-navy/45">
                    Extended hours during tax season.
                  </p>
                </div>

                <div className="card">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Main office
                  </span>
                  <p className="mt-3 text-[16px] leading-relaxed">
                    <a
                      href={site.phoneHref}
                      className="font-semibold text-navy hover:text-emerald-700"
                    >
                      {site.phone}
                    </a>
                    <br />
                    <a
                      href={`mailto:${site.email}`}
                      className="text-navy/70 hover:text-emerald-700"
                    >
                      {site.email}
                    </a>
                  </p>
                  <p className="mt-3 text-[13px] text-navy/45">
                    Credit, formation, bookkeeping, consulting.
                  </p>
                </div>

                <div className="card">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    SmartTaxIQ
                  </span>
                  <p className="mt-3 text-[16px] leading-relaxed">
                    <a
                      href={site.taxPhoneHref}
                      className="font-semibold text-navy hover:text-emerald-700"
                    >
                      {site.taxPhone}
                    </a>
                    <br />
                    <span className="text-navy/70">Tax division direct line</span>
                  </p>
                  <p className="mt-3 text-[13px] text-navy/45">
                    Preparation, strategy, IRS notices.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 rounded-2xl border border-navy/10 bg-cream p-7">
                <h3 className="text-[17px] font-semibold text-navy">
                  Prefer not to come in?
                </h3>
                <p className="mt-3 text-[15.5px] leading-[1.7] text-navy/65">
                  Most of our clients never do. Documents are uploaded, reviewed
                  and signed through an encrypted portal, consultations happen by
                  phone or video, and returns are filed electronically. We serve
                  clients across Michigan and beyond.
                </p>
                <Link href="/book" className="btn-primary mt-6 text-[13.5px]">
                  Book a remote consultation
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px]">
                <Image
                  src="/images/lashanda-legacy-planner.jpg"
                  alt="Lashanda Carter at the Carter Cole & Associates office"
                  fill
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 rounded-2xl bg-navy p-7 text-white">
                <span className="eyebrow !text-gold-300">Service area</span>
                <p className="mt-4 text-[15.5px] leading-[1.75] text-white/75">
                  Detroit and Metro Detroit in person. All of Michigan and most
                  U.S. states remotely — federal returns and multi-state filings
                  included.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        title="Come see us, or don't — either works"
        intro="Book a consultation at the Detroit office or handle the whole engagement from wherever you are."
      />
    </>
  );
}
