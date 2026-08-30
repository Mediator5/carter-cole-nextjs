"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy text-white lg:block">
        <div className="container-x flex h-10 items-center justify-between text-[12.5px]">
          <p className="text-white/70">
            Tax · Credit · Business Formation · Bookkeeping —{" "}
            <span className="text-gold-300">serving {site.city}</span>
          </p>
          <div className="flex items-center gap-6">
            <a
              href={site.phoneHref}
              className="font-medium transition hover:text-gold-300"
            >
              {site.phone}
            </a>
            <span className="h-3 w-px bg-white/25" />
            <a
              href={`mailto:${site.email}`}
              className="text-white/80 transition hover:text-gold-300"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-navy/10 bg-white/95 shadow-[0_10px_30px_-24px_rgba(15,29,68,0.6)] backdrop-blur"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex h-[74px] w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label={`${site.name} — home`}>
            <Logo markWidth={104} priority showWordmark={false} />
          </Link>

          <nav className="hidden items-center gap-0.5 min-[1340px]:flex">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition ${
                    active
                      ? "text-emerald-700"
                      : "text-navy/75 hover:text-navy"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="btn-primary hidden whitespace-nowrap px-5 text-[13px] sm:inline-flex"
            >
              Book Consultation
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-navy/40 min-[1340px]:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                {open ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[74px] z-40 overflow-y-auto bg-white transition-all duration-300 min-[1340px]:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="container-x flex flex-col gap-1 py-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between border-b border-navy/8 py-4 text-lg font-medium text-navy"
            >
              {item.label}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M9 6l6 6-6 6"
                  stroke="#ddb33c"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          ))}
          <div className="mt-6 grid gap-3">
            <Link href="/book" className="btn-primary w-full">
              Book a Consultation
            </Link>
            <Link href="/smarttaxiq#start" className="btn-gold w-full">
              Start Your Tax Return
            </Link>
            <a href={site.phoneHref} className="btn-ghost w-full">
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
