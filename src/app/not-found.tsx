import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-navy py-28 text-white sm:py-36">
      <div className="container-x text-center">
        <span className="display block text-[80px] leading-none text-gold/40">
          404
        </span>
        <h1 className="display mt-6 text-[34px] leading-tight text-white sm:text-[42px]">
          That page doesn&rsquo;t exist
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[16.5px] leading-[1.75] text-white/65">
          The link may be outdated. Here&rsquo;s where most people are heading.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold">
            Home
          </Link>
          <Link href="/smarttaxiq" className="btn-primary">
            SmartTaxIQ
          </Link>
          <Link href="/book" className="btn-ghost-light">
            Book a consultation
          </Link>
        </div>
        <p className="mt-8 text-[14px] text-white/45">
          Or call us at{" "}
          <a href={site.phoneHref} className="text-gold-300 hover:underline">
            {site.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
