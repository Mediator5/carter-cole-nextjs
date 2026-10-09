"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackConversion } from "@/lib/analytics";

/**
 * Reports a completed workbook purchase to GA4, Google Ads and the Meta pixel.
 *
 * Mounted on /workbook/thank-you, which is where Stripe returns the buyer.
 *
 * THE GUARD IS THE WHOLE POINT. That page is a public URL with no secret in
 * it: anybody could open it, a buyer could refresh it, and somebody could
 * share it. Firing a Purchase on every view would feed Meta's optimiser a
 * stream of conversions that never happened, and an optimiser trained on
 * fiction spends the budget finding more people who will also not buy.
 *
 * So the event fires only when Stripe hands back a real `session_id`, and
 * only once per session id — a refresh is free, a shared link does nothing.
 *
 * That makes this component depend on the Payment Link's redirect carrying
 * the id:
 *
 *   https://www.cartercoleandassociates.com/workbook/thank-you?session_id={CHECKOUT_SESSION_ID}
 *
 * If that is not set, no Purchase is ever reported — which is the safe
 * failure, but a silent one, so it says so loudly in the console.
 */

const SEEN_PREFIX = "cc_purchase_seen_";

/** The workbook price. Meta needs a value to report revenue and to compare
 *  cost per purchase against what the sale is actually worth. */
const PRICE = 17;
const CURRENCY = "USD";

export default function PurchaseTracker() {
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) {
      console.warn(
        "[analytics] No session_id on the thank-you page, so no Purchase was " +
          "reported. Set the Stripe Payment Link's redirect to " +
          "/workbook/thank-you?session_id={CHECKOUT_SESSION_ID}"
      );
      return;
    }

    const key = SEEN_PREFIX + sessionId;

    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      // Private browsing, or storage disabled. Reporting the purchase matters
      // more than guaranteeing it is reported exactly once, so carry on — a
      // rare double is recoverable, a missing sale is not.
    }

    trackConversion(
      "purchase_completed",
      { value: PRICE, currency: CURRENCY, content_name: "From Starter to Builder" },
      // Stripe's session id is unique per purchase, which is exactly what a
      // deduplication key needs to be when the Conversions API is added.
      sessionId
    );
  }, [params]);

  return null;
}
