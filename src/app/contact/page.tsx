import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Carter Cole & Associates in Detroit. Main office 800-599-2880, SmartTaxIQ tax division 810-493-6605. Every inquiry answered within 2 business days.",
  alternates: { canonical: "/contact" },
};

const departments = [
  {
    name: "SmartTaxIQ — Tax division",
    detail: "Preparation, strategy, amended returns, IRS notices",
    phone: site.taxPhone,
    phoneHref: site.taxPhoneHref,
    email: site.email,
  },
  {
    name: "Credit repair & building",
    detail: "Personal and business credit analysis, disputes, credit building",
    phone: site.phone,
    phoneHref: site.phoneHref,
    email: site.email,
  },
  {
    name: "Business formation & compliance",
    detail: "Entity setup, EIN, licenses, annual reports, registered agent",
    phone: site.phone,
    phoneHref: site.phoneHref,
    email: site.email,
  },
  {
    name: "Bookkeeping, payroll & consulting",
    detail: "Monthly books, payroll processing, small business coaching",
    phone: site.phone,
    phoneHref: site.phoneHref,
    email: site.email,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch with the right person the first time"
        intro="If you're serious about your business or your filing situation, reach out. We follow up on every inquiry within two business days."
      >
        <div className="flex flex-wrap gap-3">
          <a href={site.phoneHref} className="btn-gold">
            Call {site.phone}
          </a>
          <Link href="/book" className="btn-ghost-light">
            Book a consultation
          </Link>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Reveal>
              <span className="eyebrow">Direct lines</span>
              <h2 className="display mt-4 text-[30px] leading-tight">
                Reach the correct department
              </h2>
              <p className="prose-body mt-4">
                Tax matters route to SmartTaxIQ. Everything else goes to the main
                office. You can also use the form and choose a department —
                it lands in the right inbox either way.
              </p>
            </Reveal>

            <div className="mt-9 space-y-4">
              {departments.map((d, i) => (
                <Reveal key={d.name} delay={i * 70}>
                  <div className="rounded-2xl border border-navy/10 bg-white p-6">
                    <h3 className="text-[16.5px] font-semibold text-navy">
                      {d.name}
                    </h3>
                    <p className="mt-1.5 text-[14px] text-navy/55">
                      {d.detail}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                      <a
                        href={d.phoneHref}
                        className="font-semibold text-emerald-700 hover:underline"
                      >
                        {d.phone}
                      </a>
                      <a
                        href={`mailto:${d.email}`}
                        className="text-navy/65 hover:text-emerald-700"
                      >
                        {d.email}
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={320}>
              <div className="mt-8 rounded-2xl bg-navy p-7 text-white">
                <span className="eyebrow !text-gold-300">Office</span>
                <address className="mt-4 not-italic text-[15.5px] leading-relaxed text-white/75">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </address>
                <p className="mt-4 text-[15px] text-white/60">{site.hours}</p>
                <Link
                  href="/locations"
                  className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-gold-300"
                >
                  Location details
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="lg:sticky lg:top-28">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
