"use client";

import { useState } from "react";

/**
 * Mailing-list signup used on /resources.
 *
 * Posts JSON to /api/subscribe with source="newsletter", so these signups
 * land in the same subscribers table as the checklist opt-in and enter the
 * same nurture sequence. A first name is asked for because every email in
 * the sequence opens with it.
 */
export default function NewsletterForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const data = {
      ...Object.fromEntries(new FormData(form).entries()),
      source: "newsletter",
    };
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");
      setDownloadUrl(json.downloadUrl || "");
      form.reset();
      setState("done");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto mt-7 max-w-md rounded-2xl border border-emerald-700/25 bg-emerald-700/[0.04] p-7 text-center">
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
        <h3 className="display mt-4 text-[22px]">You&rsquo;re on the list</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-navy/65">
          Check your inbox &mdash; the guide is on its way.
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

  const field =
    "w-full rounded-full border border-navy/15 px-5 py-3 text-[15px] focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10";

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-7 max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-first" className="sr-only">
          First name
        </label>
        <input
          id="newsletter-first"
          name="firstName"
          required
          autoComplete="given-name"
          placeholder="First name"
          className={`${field} sm:max-w-[40%]`}
        />
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
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
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
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
        {state === "sending" ? "Sending…" : "Send me the guide"}
      </button>

      {state === "error" && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {message}
        </p>
      )}
    </form>
  );
}
