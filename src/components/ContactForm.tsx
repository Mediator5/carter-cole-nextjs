"use client";

import { useState } from "react";

const departments = [
  { value: "tax", label: "SmartTaxIQ — Tax preparation & strategy" },
  { value: "credit", label: "Credit repair & credit building" },
  { value: "business", label: "Business formation & compliance" },
  { value: "bookkeeping", label: "Bookkeeping & payroll" },
  { value: "consulting", label: "Small business consulting" },
  { value: "general", label: "Something else / general question" },
];

const field =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-[15px] text-navy placeholder:text-navy/35 transition focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10";
const label = "mb-2 block text-[13px] font-semibold text-navy";

export default function ContactForm({
  defaultDepartment = "general",
}: {
  defaultDepartment?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-700/25 bg-emerald-700/5 p-10 text-center">
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
        <h3 className="display mt-5 text-2xl">Message received</h3>
        <p className="prose-body mx-auto mt-3 max-w-md">
          Thank you. Your inquiry has been routed to the right department and
          we&rsquo;ll follow up within two business days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-7"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-navy/10 bg-white p-7 shadow-[0_24px_60px_-40px_rgba(15,29,68,0.6)] sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="firstName">
            First name
          </label>
          <input id="firstName" name="firstName" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={field} />
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="department">
          What do you need help with?
        </label>
        <select
          id="department"
          name="department"
          defaultValue={defaultDepartment}
          className={field}
        >
          {departments.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="message">
          Tell us a little about your situation
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${field} resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
          Something went wrong sending your message. Please call us instead —
          we&rsquo;d still love to hear from you.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-7 w-full disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="mt-4 text-[13px] text-navy/45">
        We respond to every inquiry within 2 business days.
      </p>
    </form>
  );
}
