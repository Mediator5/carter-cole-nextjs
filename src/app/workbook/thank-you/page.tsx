import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank you — your workbook is on its way",
  description:
    "Your purchase is confirmed. Your download link is on its way to your inbox.",
  // Nothing here should ever turn up in search results.
  robots: { index: false, follow: false },
};

/**
 * Where Stripe returns the buyer after a successful payment.
 * Set as STRIPE_SUCCESS_URL and as the Payment Link's "After the payment"
 * redirect.
 *
 * This page deliberately does NOT contain the download link. It's a public
 * URL that anybody could open or share, so the file only ever goes out
 * through the tokenised link in the delivery email, which is tied to a
 * recorded purchase.
 */
export default function WorkbookThankYouPage() {
  return (
    <section className="bg-navy py-24 text-white sm:py-32">
      <div className="container-x max-w-2xl text-center">
        <Reveal>
          <span
            aria-hidden
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <h1 className="display mt-8 text-[34px] leading-tight text-white sm:text-[44px]">
            Thank you — it&rsquo;s yours
          </h1>

          <p className="mt-6 text-[17px] leading-[1.75] text-white/70">
            Your payment went through and your download link is on its way to
            the email address you paid with. It usually lands within a minute.
          </p>

          <div className="mt-10 rounded-2xl border border-white/12 bg-white/[0.04] p-7 text-left">
            <h2 className="text-[15px] font-semibold text-gold-300">
              If it hasn&rsquo;t arrived in a few minutes
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-[1.7] text-white/70">
              <li>
                Check your spam or promotions folder — a first email from a new
                sender often lands there.
              </li>
              <li>
                Check the address you used at checkout is one you can actually
                open.
              </li>
              <li>
                Still nothing? Email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-white underline underline-offset-4"
                >
                  {site.email}
                </a>{" "}
                or call{" "}
                <a
                  href={`tel:${site.phone.replace(/\D/g, "")}`}
                  className="font-semibold text-white underline underline-offset-4"
                >
                  {site.phone}
                </a>
                . We&rsquo;ll send it straight over — your purchase is already
                recorded on our side, so nothing is lost.
              </li>
            </ul>
          </div>

          <p className="mt-8 text-[14.5px] leading-[1.7] text-white/50">
            A receipt from Stripe is on its way separately. Keep it — if you
            bought the workbook to build a business, it&rsquo;s a deductible
            expense.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/resources" className="btn-gold">
              Read the resources
            </Link>
            <Link href="/book" className="btn-ghost-light">
              Book a consultation
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
