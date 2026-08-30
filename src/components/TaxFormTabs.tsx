"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const tabs = [
  {
    key: "personal" as const,
    label: "Personal Tax",
    sub: "W-2, 1099, gig income & Schedule C",
    src: site.jotform.personalTax,
    title: "SmartTaxIQ personal and Schedule C tax intake form",
  },
  {
    key: "business" as const,
    label: "Business Tax",
    sub: "LLC, S-corp, partnership & corporation",
    src: site.jotform.businessTax,
    title: "SmartTaxIQ business tax return intake form",
  },
];

export default function TaxFormTabs({ height = 1100 }: { height?: number }) {
  const [active, setActive] = useState<"personal" | "business">("personal");
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const current = tabs.find((t) => t.key === active)!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose a tax intake form"
        className="grid gap-3 sm:grid-cols-2"
      >
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${t.key}`}
              type="button"
              onClick={() => setActive(t.key)}
              className={`rounded-2xl border-2 px-6 py-5 text-left transition ${
                on
                  ? "border-emerald-700 bg-emerald-700/[0.06] shadow-[0_16px_36px_-24px_rgba(10,107,79,0.6)]"
                  : "border-navy/12 bg-white hover:border-gold/70"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    on ? "border-emerald-700" : "border-navy/25"
                  }`}
                >
                  {on && (
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
                  )}
                </span>
                <span>
                  <span className="block text-[16.5px] font-semibold text-navy">
                    {t.label}
                  </span>
                  <span className="mt-0.5 block text-[13.5px] text-navy/55">
                    {t.sub}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${current.key}`}
        role="tabpanel"
        className="relative mt-6 overflow-hidden rounded-2xl border border-navy/10 bg-white"
      >
        {/* Overlay, not a replacement: if onLoad never fires (slow network,
            blocked third-party frames) the form is still visible underneath. */}
        {!loaded[current.key] && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-48 items-center justify-center gap-3 bg-white text-[14px] text-navy/45">
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-navy/15 border-t-emerald-700"
            />
            Loading the {current.label.toLowerCase()} form…
          </div>
        )}
        {tabs.map((t) => (
          <iframe
            key={t.key}
            src={t.src}
            title={t.title}
            onLoad={() => setLoaded((s) => ({ ...s, [t.key]: true }))}
            allow="geolocation; microphone; camera; fullscreen"
            className={t.key === active ? "block w-full" : "hidden"}
            style={{ height, border: "none" }}
          />
        ))}
      </div>

      <p className="mt-5 text-center text-[13.5px] text-navy/50">
        Trouble with the form?{" "}
        <a
          href={current.src}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-700 underline decoration-gold underline-offset-4"
        >
          Open it in a new tab
        </a>{" "}
        or call {site.taxPhone}.
      </p>
    </div>
  );
}
