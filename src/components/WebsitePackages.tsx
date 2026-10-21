import Link from "next/link";
import Reveal from "./Reveal";
import { SectionHeading } from "./Section";

/**
 * Website design packages.
 *
 * Prices live here and nowhere else — change a number in this array and every
 * page that renders the component follows. Retail is set from the wholesale
 * build cost plus the agreed reseller margin, with card processing (roughly
 * 2.9% + 30c) absorbed inside the margin rather than added at checkout.
 */
export type WebsitePackage = {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  revisions: string;
  featured?: boolean;
};

export const websitePackages: WebsitePackage[] = [
  {
    slug: "starter",
    name: "Starter",
    price: 150,
    tagline:
      "A clean, credible presence for a business that needs to be findable and look the part.",
    features: [
      "1–3 custom-designed pages (home, about, contact)",
      "Responsive on phone, tablet and desktop",
      "Social media and contact form integration",
      "Basic on-page SEO setup",
      "Fast turnaround",
    ],
    revisions: "Up to 2 rounds of revisions",
  },
  {
    slug: "standard",
    name: "Standard",
    price: 275,
    tagline:
      "The one most businesses need — room to explain what you do, and built to bring in enquiries.",
    features: [
      "Up to 5–6 custom-designed pages",
      "Full mobile and tablet optimization",
      "Lead generation and contact form setup",
      "Speed and performance optimization",
      "On-page SEO and meta tags",
      "CRM or email integration (Mailchimp, GoHighLevel, custom)",
    ],
    revisions: "Up to 4 rounds of revisions",
    featured: true,
  },
  {
    slug: "premium",
    name: "Premium",
    price: 375,
    tagline:
      "A full site or storefront, with the functionality to take bookings and payments.",
    features: [
      "Full multi-page site, e-commerce or funnel build (up to 10 pages)",
      "Advanced functionality — custom styling, dynamic content, booking",
      "Payment gateway and lead capture integrations",
      "Advanced on-page SEO, speed and security configuration",
      "Priority support and a video walkthrough at handover",
    ],
    revisions: "Unlimited revisions within scope during a 14-day polish period",
  },
];

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-[3px] h-4 w-4 shrink-0 text-emerald-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export default function WebsitePackages({
  eyebrow = "Website design & development",
  title = "A website that works as hard as you do",
  intro = "Three straightforward packages. You own the finished site outright — there is no monthly fee to us, and nothing is held hostage.",
  ctaHref = "/contact?department=website",
  ctaLabel = "Start this package",
  showHeading = true,
  compact = false,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  ctaHref?: string;
  ctaLabel?: string;
  showHeading?: boolean;
  compact?: boolean;
}) {
  return (
    <section className={compact ? "py-16 sm:py-20" : "py-20 sm:py-24"}>
      <div className="container-x">
        {showHeading && (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            intro={intro}
            align="center"
          />
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
          {websitePackages.map((p, i) => (
            <Reveal key={p.slug} delay={i * 110} className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-7 transition-all duration-300 ${
                  p.featured
                    ? "border-gold/70 shadow-[0_24px_50px_-24px_rgba(15,29,68,0.35)] lg:-mt-4 lg:pb-10 lg:pt-10"
                    : "border-navy/10 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_24px_50px_-24px_rgba(15,29,68,0.35)]"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
                    Most popular
                  </span>
                )}

                <h3 className="display text-[26px] leading-tight">{p.name}</h3>

                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="display text-[40px] leading-none text-navy">
                    ${p.price}
                  </span>
                  <span className="text-[13.5px] text-navy/50">one-time</span>
                </p>

                <p className="prose-body mt-4 text-[15.5px]">{p.tagline}</p>

                <div className="rule-gold my-6" />

                <ul className="flex flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check />
                      <span className="text-[15px] leading-[1.6] text-navy/75">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-[13.5px] font-semibold text-emerald-800">
                  {p.revisions}
                </p>

                <div className="mt-auto pt-7">
                  <Link
                    href={`${ctaHref}${
                      ctaHref.includes("?") ? "&" : "?"
                    }package=${p.slug}`}
                    className={`${
                      p.featured ? "btn-primary" : "btn-ghost"
                    } w-full`}
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto mt-10 max-w-prose text-center text-[14px] leading-[1.7] text-navy/55">
            Domain and hosting are purchased in your own name and stay yours —
            we will connect them for you. Project timelines start once your
            branding, copy and access details are in hand.{" "}
            <Link
              href="/website-design#policies"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Read the full terms
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
