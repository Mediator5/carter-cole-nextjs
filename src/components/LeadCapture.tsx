"use client";

import { useState } from "react";
import { getAttribution, trackConversion } from "@/lib/analytics";

/**
 * The email capture that appears on every major page.
 *
 * One component, three shapes, so the offer is consistent everywhere and
 * there is exactly one place to change the copy, the fields or the tracking:
 *
 *   band   — full-width section, for the foot of a long page
 *   card   — bordered block, for a sidebar or between sections
 *   inline — compact row, for tight spaces
 *
 * Every submission carries the campaign the visitor arrived on and fires a
 * conversion event, which is what makes paid traffic measurable later.
 */

type Variant = "band" | "card" | "inline";

export default function LeadCapture({
  source,
  variant = "band",
  heading = "Get the free checklist sent straight to your inbox",
  blurb = "The Foundation Checklist — the paperwork, registrations and numbers every new business owner needs in place, in the order they need them. Free, and yours in about ten seconds.",
  cta = "Send me the checklist",
  className = "",
}: {
  /** Which page or slot this instance sits in. Tags the contact. */
  source: string;
  variant?: Variant;
  heading?: string;
  blurb?: string;
  cta?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");

    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      source,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      attribution: getAttribution(),
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");

      setDownloadUrl(json.downloadUrl || "");
      trackConversion("lead_checklist", { source });
      form.reset();
      setState("done");
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setState("error");
    }
  }

  const field =
    "w-full rounded-full border border-navy/15 bg-white px-5 py-3 text-[15px] text-navy placeholder:text-navy/40 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10";

  if (state === "done") {
    return (
      <div
        className={`rounded-2xl border border-emerald-700/25 bg-emerald-700/[0.04] p-7 text-center ${className}`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="display mt-4 text-[22px] text-navy">
          Check your inbox
        </h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-navy/65">
          It&rsquo;s on its way. If it hasn&rsquo;t arrived in a few minutes,
          look in spam and mark it &ldquo;not spam&rdquo; so the rest reaches
          you.
        </p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 text-[13.5px]"
          >
            Open it now
          </a>
        )}
      </div>
    );
  }

  const form = (
    <form onSubmit={onSubmit} className={variant === "band" ? "mx-auto max-w-lg" : ""}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`lc-first-${source}`} className="sr-only">
          First name
        </label>
        <input
          id={`lc-first-${source}`}
          name="firstName"
          required
          autoComplete="given-name"
          placeholder="First name"
          className={`${field} sm:max-w-[38%]`}
        />
        <label htmlFor={`lc-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`lc-email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={field}
        />
      </div>

      {/* Honeypot — hidden from people, catches bots. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor={`lc-website-${source}`}>Website</label>
        <input
          id={`lc-website-${source}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-primary mt-3 w-full disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : cta}
      </button>

      <p className="mt-3 text-center text-[12.5px] leading-relaxed text-navy/45">
        No charge, no spam. Unsubscribe in one click, any time.
      </p>

      {state === "error" && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {message}
        </p>
      )}
    </form>
  );

  if (variant === "inline") {
    return <div className={className}>{form}</div>;
  }

  if (variant === "card") {
    return (
      <div
        className={`rounded-2xl border border-navy/10 bg-cream p-7 sm:p-8 ${className}`}
      >
        <span className="eyebrow">Free download</span>
        <h3 className="display mt-3 text-[24px] leading-tight text-navy">
          {heading}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-navy/65">{blurb}</p>
        <div className="mt-6">{form}</div>
      </div>
    );
  }

  return (
    <section className={`bg-cream py-16 sm:py-20 ${className}`}>
      <div className="container-x text-center">
        <span className="eyebrow">Free download</span>
        <h2 className="display mx-auto mt-4 max-w-2xl text-[30px] leading-[1.15] text-navy sm:text-[38px]">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-navy/65">
          {blurb}
        </p>
        <div className="mt-8">{form}</div>
      </div>
    </section>
  );
}
