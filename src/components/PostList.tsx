"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, formatDate, type Post } from "@/lib/posts";

export default function PostList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition ${
              active === c
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-navy/15 bg-white text-navy/70 hover:border-gold hover:text-navy"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <article key={post.slug} className="group flex flex-col">
            <Link
              href={`/resources/${post.slug}`}
              className="relative block aspect-[3/2] overflow-hidden rounded-2xl"
            >
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 360px"
                className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy">
                {post.category}
              </span>
            </Link>
            <div className="mt-5 flex flex-1 flex-col">
              <div className="flex items-center gap-3 text-[12.5px] text-navy/45">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span>{post.readingTime}</span>
              </div>
              <h2 className="display mt-3 text-[22px] leading-tight">
                <Link
                  href={`/resources/${post.slug}`}
                  className="transition group-hover:text-emerald-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-navy/60">
                {post.excerpt}
              </p>
              <Link
                href={`/resources/${post.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-emerald-700"
              >
                Read article
                <svg
                  width="15"
                  height="15"
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
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-[15px] text-navy/50">
          No articles in this category yet — check back soon.
        </p>
      )}
    </>
  );
}
