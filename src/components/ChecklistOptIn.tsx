"use client";

import { useState } from "react";
import Link from "next/link";

type State = "idle" | "sending" | "done" | "error";

export default function ChecklistOptIn({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [emailed, setEmailed] = useState(false);

  const dark = variant === "dark";
  const field = `w-full rounded-xl border px-4 py-3 text-[15px] transition focus:outline-none focus:ring-4 ${
    dark
      ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/20"
      : "border-navy/15 bg-white text-navy placeholder:text-navy/35 focus:border-emerald-700 focus:ring-emerald-700/10"
  }`;
  const label = `mb-2 block text-[13px] font-semibold ${
    dark ? "text-white/80" : "text-navy"
  }`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");
      setDownloadUrl(json.downloadUrl);
      setEmailed(Boolean(json.emailed));
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
      <div
        className={`rounded-2xl border p-8 text-center sm:p-10 ${
          dark
            ? "border-gold/40 bg-white/[0.06]"
            : "border-emerald-700/25 bg-emerald-700/[0.04]"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          className={`display mt-5 text-[26px] ${dark ? "!text-white" : ""}`}
        >
          Your checklist is ready
        </h3>
        <p
          className={`mx-auto mt-3 max-w-sm text-[15px] leading-relaxed ${
            dark ? "text-white/70" : "text-navy/65"
          }`}
        >
          {emailed
            ? "It's on its way to your inbox too — but you can open it right now."
            : "Open it right now, and keep an eye on your inbox for a copy."}
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold mt-7"
        >
          Open the checklist
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <p
          className={`mt-6 text-[13px] ${dark ? "text-white/45" : "text-navy/45"}`}
        >
          Ready to go further?{" "}
          <Link
            href="/workbook"
            className={`font-semibold underline decoration-gold underline-offset-4 ${
              dark ? "text-gold-300" : "text-emerald-700"
            }`}
          >
            See the 30-day workbook
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-2xl border p-7 sm:p-8 ${
        dark
          ? "border-white/15 bg-white/[0.06]"
          : "border-navy/10 bg-white shadow-[0_24px_60px_-40px_rgba(15,29,68,0.6)]"
      }`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="opt-first">
            First name
          </label>
          <input
            id="opt-first"
            name="firstName"
            required
            autoComplete="given-name"
            placeholder="Lashanda"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="opt-last">
            Last name{" "}
            <span className={dark ? "text-white/40" : "text-navy/35"}>
              (optional)
            </span>
          </label>
          <input
            id="opt-last"
            name="lastName"
            autoComplete="family-name"
            placeholder="Carter"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="opt-email">
          Email
        </label>
        <input
          id="opt-email"
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
        <label htmlFor="opt-website">Website</label>
        <input id="opt-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state === "error" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className={`mt-6 w-full disabled:opacity-60 ${
          dark ? "btn-gold" : "btn-primary"
        }`}
      >
        {state === "sending" ? "Sending…" : "Send me the checklist"}
      </button>

      <p
        className={`mt-4 text-center text-[12.5px] leading-relaxed ${
          dark ? "text-white/45" : "text-navy/45"
        }`}
      >
        Free, and yours to keep. We&rsquo;ll follow up with a few emails worth
        reading — unsubscribe in one click, any time.
      </p>
    </form>
  );
}
