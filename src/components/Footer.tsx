import Link from "next/link";
import { services, site } from "@/lib/site";
import Logo from "./Logo";
import SmartTaxLogo from "./SmartTaxLogo";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <Logo variant="light" markWidth={92} />
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/65">
            Tax strategy, credit, and business services for individuals and
            owners who are building something meant to outlast them.
          </p>
          <p className="mt-6 text-[13px] uppercase tracking-[0.18em] text-gold-300">
            Serving clients since {site.founded}
          </p>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Company
          </h3>
          <ul className="mt-5 space-y-3 text-[15px]">
            {[
              ["About", "/about"],
              ["Services", "/services"],
              ["SmartTaxIQ", "/smarttaxiq"],
              ["Business Services", "/business-services"],
              ["Free Checklist", "/checklist"],
              ["The Workbook", "/workbook"],
              ["Resources", "/resources"],
              ["Locations", "/locations"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/70 transition hover:text-gold-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Services
          </h3>
          <ul className="mt-5 space-y-3 text-[15px]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  className="text-white/70 transition hover:text-gold-300"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Get in touch
          </h3>
          <ul className="mt-5 space-y-4 text-[15px] text-white/70">
            <li>
              <span className="block text-[12px] uppercase tracking-wide text-white/40">
                Main office
              </span>
              <a
                href={site.phoneHref}
                className="text-white transition hover:text-gold-300"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <span className="block text-[12px] uppercase tracking-wide text-white/40">
                SmartTaxIQ (tax division)
              </span>
              <a
                href={site.taxPhoneHref}
                className="text-white transition hover:text-gold-300"
              >
                {site.taxPhone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition hover:text-gold-300"
              >
                {site.email}
              </a>
            </li>
            <li>{site.hours}</li>
            <li>{site.city}</li>
          </ul>

          <div className="mt-7 flex gap-3">
            <Link href="/book" className="btn-gold text-[13px]">
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-[13px] text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <span className="flex items-center gap-2.5">
            <SmartTaxLogo variant="light" width={120} className="w-[120px]" />
            <span>is the tax division of {site.name}.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
