# The Checklist Funnel — setup guide

Free checklist → email capture → 5-email sequence → $17 workbook.

Everything runs on your own server. The subscriber list lives in your
database, not on someone else's platform, and there are no per-contact fees
as it grows.

---

## What's already built

| Piece | Where |
| --- | --- |
| Opt-in landing page | `/checklist` |
| Workbook sales page | `/workbook` |
| Subscriber capture | `POST /api/subscribe` |
| Token-gated download | `GET /api/download/checklist?t=…` |
| Sequence dispatcher | `GET /api/cron/dispatch` |
| Unsubscribe | `GET|POST /api/unsubscribe?t=…` |
| Admin dashboard | `/admin/subscribers` |
| CSV export | `/api/admin/export` |
| Email copy | `src/lib/sequence.ts` |
| Email design | `src/lib/mailer.ts` |
| Database | `src/lib/db.ts` (SQLite → `data/subscribers.db`) |

The PDFs live in `private-assets/`, **not** in `public/`. They can't be
hot-linked or found by Google — the only way to the checklist is a token
issued when someone subscribes.

---

## Three things to do before this goes live

### 1. Copy `.env.example` to `.env.local` and fill it in

```bash
cp .env.example .env.local
```

```env
SMTP_HOST=email-smtp.us-east-2.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MAIL_FROM="Lashanda Carter <lashanda@smarttaxiq.com>"
MAIL_REPLY_TO=lashanda@smarttaxiq.com
SITE_URL=https://cartercoleandassociates.com
CRON_SECRET=a-long-random-string-nobody-can-guess
ADMIN_PASSWORD=your-admin-password
```

**About the mail relay.** The app owns your list, your sequence and your
timing — but it can't put mail in an inbox by itself. Sending directly from a
web server gets filtered to spam almost immediately, so the send is handed to
an SMTP provider. Any of these work:

- **Amazon SES** — about $0.10 per thousand emails. Cheapest at any volume.
- **Postmark / Mailgun / Resend** — easier setup, free tiers, then ~$15/mo.
- **Your own domain mail** (e.g. through your host) — free, but check the
  daily sending limit before you rely on it.

Do **not** send list email through a personal Gmail account. Consumer
providers rate-limit hard and it damages your domain's reputation.

Whichever you choose, set up **SPF, DKIM and DMARC** records for
`cartercoleandassociates.com`. Your provider gives you the exact DNS entries.
Without them a large share of your emails land in spam regardless of how good
they are — this is the single highest-impact thing on this page.

### 2. Schedule the dispatcher

The sequence advances when `/api/cron/dispatch` is called. Once an hour is
plenty.

**Linux / cPanel cron:**
```
0 * * * * curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" https://cartercoleandassociates.com/api/cron/dispatch
```

**Windows Task Scheduler:**
```
powershell -Command "Invoke-WebRequest -Uri https://cartercoleandassociates.com/api/cron/dispatch -Headers @{Authorization='Bearer YOUR_CRON_SECRET'}"
```

**Vercel** — add to `vercel.json`:
```json
{ "crons": [{ "path": "/api/cron/dispatch", "schedule": "0 * * * *" }] }
```

It's safe to run as often as you like. Every send is recorded uniquely per
subscriber per email, so running it twice sends nothing the second time. It
also sends at most **one email per subscriber per run**, so someone who joined
weeks ago never receives the whole sequence in one burst.

Test it without sending anything:
```
curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://…/api/cron/dispatch?dry=1"
```

### 3. Add the workbook checkout

Open `src/app/workbook/page.tsx` and set:

```ts
const CHECKOUT_URL = "https://buy.stripe.com/your-payment-link";
```

Every buy button on the page goes live at once. While it's empty the buttons
point at the free checklist instead of being dead links, and the price box
says checkout is being set up.

Whatever you choose — Stripe Payment Link, Gumroad, PayPal — remember it also
has to **deliver the PDF**. Gumroad does that automatically. With a Stripe
link you'll either email it manually or wire up an automation.

---

## Running it

```bash
npm install
npm run build
npm start
```

Then visit `/admin/subscribers` and sign in with `ADMIN_PASSWORD`.

**No native build required.** Storage is SQLite, a single file on disk. The
driver is chosen at runtime: `better-sqlite3` if it installed successfully,
otherwise Node's own built-in SQLite (Node 22.5+). `better-sqlite3` compiles
native code, which needs a prebuilt binary for your exact Node version or a
working compiler — a step that fails often enough on Windows to matter. It's
listed as an *optional* dependency, so a failed build can't take the site
down; the funnel just uses the built-in driver instead.

**Important — where this can be hosted.** A file-on-disk database works on any
normal Node host: a VPS, XAMPP, Plesk, Railway, Render, Docker.

It does **not** work on Vercel or Netlify, whose filesystems are read-only and
wiped between requests — subscribers would silently vanish. If you deploy
there, swap `src/lib/db.ts` for Postgres (Neon and Supabase both have free
tiers). Nothing else in the app touches the database directly, so that change
is contained to one file.

---

## The sequence

| # | Day | Subject |
| --- | --- | --- |
| 1 | 0 (instant) | Here's your Foundation Checklist, {name} |
| 2 | 3 | I paid everyone but myself |
| 3 | 6 | Goals don't build businesses. This does. |
| 4 | 9 | The 30-day version of what you started |
| 5 | 13 | Where will you be in 30 days? |

Edit any of it in `src/lib/sequence.ts` — copy, subject lines and timing all
live in that one file. Add, remove or re-time emails freely; subscribers
mid-sequence pick up the new schedule automatically.

Formatting available in the body text:

- `{{name}}` — subscriber's first name
- `{{checklist}}` — their personal download link
- `{{workbook}}` — the sales page
- `{{unsubscribe}}` — their one-click opt-out
- `> ` at the start of a line — renders as a gold pull quote
- `- ` at the start of a line — renders as a bullet
- `[[CTA:Button label|url]]` — renders as a green button

---

## Compliance

Handled for you:

- Every email carries a working unsubscribe link
- `List-Unsubscribe` and `List-Unsubscribe-Post` headers — Gmail and Yahoo now
  require these for anyone sending in volume
- Unsubscribing takes effect immediately and stops all further sends
- Signup states plainly that emails follow

**One thing you must add:** CAN-SPAM requires a physical postal address in
commercial email. The email footer prints the full address from
`site.address` in `src/lib/site.ts`, which currently reads
`[Address to be confirmed]`. Fill that in and every email, the Locations page,
the Contact page and the local-business schema all update together.

---

## Checking it works

The admin dashboard shows active subscribers, unsubscribes, emails sent,
failed sends and checklist downloads. The sequence bar on each row shows how
far through the 5 emails that person is.

If **Failed sends** starts climbing, your SMTP credentials or sending limits
are the first place to look — the exact error is stored against each attempt
in the `sends` table.

Note that a subscriber is saved and the download works even if the email fails
to send. A mail outage costs you the email, never the lead.
