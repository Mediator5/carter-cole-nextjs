"use client";

import LeadCapture from "./LeadCapture";

/**
 * Mailing-list signup used on /resources.
 *
 * Kept as its own name because several pages import it, but it is now a thin
 * wrapper over LeadCapture — one implementation means one set of fields, one
 * conversion event and one place to change the offer.
 */
export default function NewsletterForm() {
  return (
    <LeadCapture
      source="newsletter"
      variant="inline"
      cta="Send me the guide"
      className="mx-auto mt-7 max-w-md"
    />
  );
}
