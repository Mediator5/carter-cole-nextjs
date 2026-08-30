import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, posts } from "@/lib/posts";
import { site } from "@/lib/site";
import CTA from "@/components/CTA";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/resources/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
  };
}

function renderBody(body: string[]) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} className="my-6 space-y-3">
          {list.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[17px] leading-[1.75] text-navy/70"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  body.forEach((line, i) => {
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList(`list-${i}`);
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={i}
          className="display mt-12 text-[27px] leading-tight sm:text-[30px]"
        >
          {line.slice(3)}
        </h2>
      );
    } else {
      blocks.push(
        <p key={i} className="mt-5 text-[17px] leading-[1.8] text-navy/75">
          {line}
        </p>
      );
    }
  });
  flushList("list-final");
  return blocks;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article>
        {/* Header */}
        <header className="bg-navy pb-14 pt-14 text-white sm:pb-16 sm:pt-16">
          <div className="container-x">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[13.5px] text-white/55 transition hover:text-gold-300"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M19 12H5M11 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All resources
            </Link>
            <div className="mt-7 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-[13px] text-white/50">
                <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-300">
                  {post.category}
                </span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span>{post.readingTime}</span>
              </div>
              <h1 className="display mt-5 text-[34px] leading-[1.1] text-white sm:text-[46px]">
                {post.title}
              </h1>
              <p className="mt-5 text-[17.5px] leading-[1.75] text-white/70">
                {post.excerpt}
              </p>
            </div>
          </div>
        </header>

        {/* Hero image */}
        <div className="container-x -mt-8 sm:-mt-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:aspect-[21/9]">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1140px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Body */}
        <div className="container-x py-16 sm:py-20">
          <div className="mx-auto max-w-[720px]">
            {renderBody(post.body)}

            <div className="mt-14 rounded-2xl border border-navy/10 bg-cream p-8">
              <span className="eyebrow">Need help with this?</span>
              <h2 className="display mt-4 text-[24px] leading-tight">
                We do this work every day
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-navy/65">
                If any of this applies to your situation, bring it to a free
                consultation — or call {site.phone} and ask.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/book" className="btn-primary text-[13.5px]">
                  Book Consultation
                </Link>
                <Link href="/services" className="btn-ghost text-[13.5px]">
                  See our services
                </Link>
              </div>
            </div>

            <p className="mt-10 text-[13px] leading-relaxed text-navy/45">
              This article is general educational information, not tax, legal or
              financial advice for your specific situation. Tax law and credit
              reporting rules change, and the right answer depends on facts we
              would need to look at together.
            </p>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="border-t border-navy/10 py-16 sm:py-20">
        <div className="container-x">
          <h2 className="display text-[26px]">Keep reading</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/resources/${p.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  {p.category}
                </span>
                <h3 className="display mt-2 text-[20px] leading-tight transition group-hover:text-emerald-700">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
