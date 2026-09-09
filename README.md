# Carter Cole & Associates — Website

Next.js 14 (App Router) + TypeScript + Tailwind CSS.
One site, two divisions: **Carter Cole & Associates** (main brand) with
**SmartTaxIQ** presented as the tax division.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Node 22.5+ required (the funnel uses Node's built-in SQLite when `better-sqlite3` isn't installed).

---

## Pages

| Route                | Page                                                     |
| -------------------- | -------------------------------------------------------- |
| `/`                  | Home — who we are, what we do, how to start              |
| `/about`             | Lashanda's story, mission, vision, values, track record  |
| `/services`          | All 7 services in detail                                 |
| `/smarttaxiq`        | Tax division — why, process, what to bring, FAQ, start   |
| `/business-services` | Formation, names, licenses, compliance, bookkeeping      |
| `/book`              | Book consultation / start return / send inquiry          |
| `/checklist`         | Free Foundation Checklist opt-in                         |
| `/workbook`          | From Starter to Builder sales page ($17)                 |
| `/admin/subscribers` | Subscriber dashboard (password protected)                |
| `/resources`         | Blog index with category filter                          |
| `/resources/[slug]`  | Article pages (6 seeded articles)                        |
| `/locations`         | Detroit office + remote service area                     |
| `/contact`           | Department routing + contact form                        |

---

## Things to fill in before launch

### 1. The Detroit address — done

`src/lib/site.ts` → `site.address` is set to
**14701 Mack Ave, Suite B, Detroit, MI 48215**, and derived from there into
the contact page, the locations page, every commercial email footer (CAN-SPAM
requires it) and the local-business schema.

It must stay character-identical to the SmartTaxIQ site and to the Google
Business Profile — mismatched name/address/phone is one of the few things that
measurably suppresses local ranking.

### 2. JotForm — scheduling form (the tax forms are already live)

`src/lib/site.ts` → `site.jotform`:

```ts
jotform: {
  personalTax:  "https://form.jotform.com/253275423934056", // LIVE
  businessTax:  "https://form.jotform.com/253285600052550", // LIVE
  consultation: "",                                          // not supplied yet
}
```

Both tax intake forms are wired up and embedded on `/book` behind a
Personal / Business switcher, and linked from `/smarttaxiq#start`.

`consultation` is deliberately empty. While it's empty, `/book` shows a
"call us and we'll find a time" panel pointing at the phone lines and the
inquiry form. The moment you paste a scheduling form URL in, that panel is
replaced by the live embed automatically — no other edit needed.

### 3. Contact form email delivery

`src/app/api/contact/route.ts` currently validates and logs submissions.
To actually deliver mail, wire it to Resend (or your CRM webhook) — the file
has commented example code and a department→inbox routing map at the top.

### 4. Domain and canonical URL

`src/lib/site.ts` → `site.url`. Used for canonical tags, OpenGraph and the
sitemap.

---

## The lead system

Both websites feed one Mailchimp audience and one set of instant alerts.
Supabase remains the system of record; Mailchimp is the broadcast copy. The
list layer has two interchangeable backends — Mailchimp and Resend — and uses
whichever is configured, so changing campaign tools is an environment change
rather than a code change. The whole thing is credential-gated: with nothing configured the site runs exactly
as it always did, and each value added switches on one more part of it with no
code change.

| Piece | Where |
| --- | --- |
| Email capture (every major page) | `src/components/LeadCapture.tsx` |
| Capture endpoint | `POST /api/subscribe` |
| Contact form | `POST /api/contact` |
| JotForm intake webhook | `POST /api/webhooks/jotform` |
| Calendly booking webhook | `POST /api/webhooks/calendly` |
| Mailing list (Mailchimp) | `src/lib/audience/` |
| Email + SMS alerts | `src/lib/notify.ts` |
| One capture path for all of it | `src/lib/leads.ts` |
| Analytics, attribution, conversions | `src/lib/analytics.ts` |
| Scheduler embed | `src/components/CalendlyEmbed.tsx` |

**Setup, value by value: [`LEAD-SYSTEM-SETUP.md`](./LEAD-SYSTEM-SETUP.md).**

The design rule throughout is that storage happens first and every third party
after it, independently guarded. A Mailchimp outage cannot stop an alert, a
Twilio outage cannot stop the storage, and no third party can fail a form
submission for the visitor. A mail outage costs you the email, never the lead.

---

## SmartTaxIQ.com redirect

Keep the domain registered and renewed. When you're ready to consolidate,
point it at this site and add these host-level redirects (at your DNS/host,
Vercel `vercel.json`, or `next.config.mjs`):

```
smarttaxiq.com/*  →  cartercoleandassociates.com/smarttaxiq
```

`next.config.mjs` already contains path redirects for the old WordPress URLs
(`/about-us`, `/blog`, `/pricing`, `/join-us`, `/e-books`, etc.) and for the
old SmartTaxIQ paths (`/how-it-works`, `/faq`, `/get-started`) so no inbound
link 404s.

---

## Cleanup already handled

Everything the brief flagged on the old site is resolved here:

- No empty blog — `/resources` ships with 6 full articles and a working
  category filter
- No dead Pricing or Join Us pages — both redirect to live pages
- No third-party credit card offers anywhere
- No "Carter's Financial Solutions" — every reference is Carter Cole &
  Associates
- No unused social platforms — social links removed from the footer entirely
  rather than pointing at dormant accounts
- No broken links — every internal link resolves to a real route

---

## Content

- **Services, testimonials, contact details:** `src/lib/site.ts`
- **Blog articles:** `src/lib/posts.ts` — add an object to the `posts` array
  and the index page, category filter, sitemap and static route all pick it
  up automatically. In article bodies, a line starting with `## ` renders as
  a heading and a line starting with `- ` renders as a bullet.

---

## Design system

| Token       | Value     | Use                                  |
| ----------- | --------- | ------------------------------------ |
| Navy        | `#0f1d44` | Headings, dark sections, footer      |
| Emerald     | `#0a6b4f` | Primary buttons, links, accents      |
| Gold        | `#ddb33c` | Rules, highlights, secondary CTAs    |
| CCA green   | `#22d873` | Logo mark                            |
| Cream       | `#faf8f4` | Alternating section backgrounds      |
| White       | `#ffffff` | Base                                 |

Navy, gold and green were sampled from the supplied logo files, so the site
matches the brand assets exactly.

Typography: **Cormorant Garamond** (display) + **Inter** (body), both
self-hosted via `@fontsource` — no Google Fonts request, so nothing external
can slow the page down or break under a privacy blocker.

Shared classes (`.btn-primary`, `.card`, `.eyebrow`, `.container-x`) live in
`src/app/globals.css`.

---

## Photography

Nine of the professional photos are in `public/images/`, each at two widths
(full and `-sm`). No stock photography is used anywhere on the site.

---

## SEO

- Per-page titles, descriptions and canonical URLs
- OpenGraph and Twitter card metadata
- `AccountingService` JSON-LD schema with founder, service list and area served
- Auto-generated `sitemap.xml` and `robots.txt`
- Semantic headings, skip-to-content link, alt text throughout
- 26 routes generated at build time — fast by default

---

## Deploying

Easiest path is Vercel: push the repo, import it, done — no configuration
needed. Any Node host works with `npm run build && npm start`.
