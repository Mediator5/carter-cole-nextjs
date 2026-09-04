import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatDate, posts } from "@/lib/posts";
import { PageHero } from "@/components/Section";
import PostList from "@/components/PostList";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Practical education on taxes, credit, business formation and financial literacy from Carter Cole & Associates and SmartTaxIQ.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Straight answers on taxes, credit and running a business"
        intro="No fluff, no upsells buried in paragraph four. These are the explanations we give clients on the phone, written down."
      />

      {/* Featured */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <Link
              href={`/resources/${featured.slug}`}
              className="group grid gap-8 overflow-hidden rounded-3xl border border-navy/10 bg-cream lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <div className="flex items-center gap-3 text-[12.5px] text-navy/50">
                  <span className="rounded-full bg-emerald-700/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
                    {featured.category}
                  </span>
                  <time dateTime={featured.date}>
                    {formatDate(featured.date)}
                  </time>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span>{featured.readingTime}</span>
                </div>
                <h2 className="display mt-5 text-[30px] leading-tight sm:text-[36px]">
                  {featured.title}
                </h2>
                <p className="prose-body mt-4">{featured.excerpt}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-[14.5px] font-semibold text-emerald-700">
                  Read the article
                  <svg
                    width="16"
                    height="16"
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
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* All posts */}
      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          <PostList posts={rest} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-cream py-16">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-2xl border border-navy/10 bg-white p-9 text-center sm:p-12">
              <span className="eyebrow justify-center">Free guide</span>
              <h2 className="display mt-4 text-[28px] leading-tight">
                Everything You Need to Know About Business Credit
              </h2>
              <p className="prose-body mx-auto mt-4 max-w-md">
                Join our mailing list and we&rsquo;ll send the guide, plus
                occasional notes on deadlines that actually matter.
              </p>
              <NewsletterForm />
              <p className="mt-4 text-[12.5px] text-navy/40">
                No spam. Unsubscribe any time.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        title="Have a question these didn't answer?"
        intro="Bring it to a free consultation. We answer questions like these every day and we're happy to answer yours before you commit to anything."
      />
    </>
  );
}
