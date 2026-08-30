"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Embeds a JotForm.
 *
 * TO GO LIVE: put your real JotForm URLs in `src/lib/site.ts` under `jotform`.
 * A JotForm embed URL looks like https://form.jotform.com/123456789012345
 * Until a real form ID is set, this renders a clearly-labelled placeholder
 * rather than an empty iframe.
 */
export default function JotFormEmbed({
  src,
  title,
  height = 780,
}: {
  src: string;
  title: string;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  const configured = /jotform\.com\/\d{6,}/.test(src);

  if (!configured) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-navy/20 bg-white p-10 text-center">
        <span className="eyebrow justify-center">Scheduling form</span>
        <h3 className="display mt-4 text-[24px]">
          Booking form connects here
        </h3>
        <p className="prose-body mx-auto mt-3 max-w-md text-[15px]">
          Add your SmartTaxIQ JotForm URL to{" "}
          <code className="rounded bg-cream px-1.5 py-0.5 text-[13px] text-navy">
            src/lib/site.ts
          </code>{" "}
          and the live form will render in this space automatically.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={site.phoneHref} className="btn-primary text-[13.5px]">
            Call {site.phone} to book
          </a>
          <a
            href={`mailto:${site.email}`}
            className="btn-ghost text-[13.5px]"
          >
            Email us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy/10 bg-white">
      {/* Overlay rather than a swap, so a missed onLoad never hides the form. */}
      {!loaded && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-48 items-center justify-center gap-3 bg-white text-[14px] text-navy/45">
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-navy/15 border-t-emerald-700"
          />
          Loading booking form…
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        allow="geolocation; microphone; camera"
        className="block w-full"
        style={{ height, border: "none" }}
      />
    </div>
  );
}
