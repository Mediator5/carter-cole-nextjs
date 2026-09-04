# Supabase + Email Setup

Everything the site collects now lives in Supabase, and every email goes out
over SMTP. This is the whole setup, in order. It takes about twenty minutes.

---

## Why this changed

The site previously stored subscribers in a SQLite file on disk. SQLite is a
serious database, but it cannot work on Vercel: Vercel's filesystem is
read-only and thrown away between requests, so every signup would have
vanished silently. Supabase is hosted Postgres — it survives deploys, backs
itself up nightly, and you can open your list in a browser from anywhere.

The contact form had a second problem: it only ever wrote submissions to the
server console. Anyone who used it left no record at all. Those are now stored
too.

---

## Step 1 — Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up. The free tier is
   500 MB, which is tens of thousands of subscribers.
2. **New project**. Give it a name (`carter-cole`), pick a strong database
   password, and choose the region closest to your customers — **East US**
   for a US practice.
3. Wait about two minutes for it to provision.

## Step 2 — Create the tables

1. In the left sidebar: **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy the whole file, paste it
   into the editor.
3. Click **Run**. You should see "Success. No rows returned."

That creates four tables — `subscribers`, `sends`, `downloads`,
`contact_submissions` — plus indexes, a dashboard view, and Row Level
Security. RLS is enabled with **no policies**, which means the public API keys
can read nothing at all. Only the server-side service-role key can touch your
data. That is what stops anyone from scraping your mailing list.

To confirm: **Table Editor** in the sidebar should now list all four tables.

## Step 3 — Get your keys

1. **Project Settings** (gear icon) → **API**.
2. Copy **Project URL** → this is `SUPABASE_URL`.
3. Under Project API keys, reveal and copy **`service_role`** → this is
   `SUPABASE_SERVICE_ROLE_KEY`.

> **Take the `service_role` key, not `anon`.** The anon key is blocked by the
> Row Level Security you just enabled and nothing will work. And never put the
> service_role key anywhere with a `NEXT_PUBLIC_` prefix — that would ship it
> to every visitor's browser, and it can delete your entire database.

## Step 4 — Fill in `.env.local`

Open `.env.local` in the project root. It is fully commented and tells you
where each value comes from. Paste in the two Supabase values.

`CRON_SECRET` and `ADMIN_PASSWORD` have already been generated for you —
**write the admin password down**, it is how you sign in to the dashboard.

While developing locally, set `SITE_URL=http://localhost:3000`.

## Step 5 — Email (Google + nodemailer)

The site sends three kinds of email, all through nodemailer over Google's SMTP
server:

| Email | Trigger | Goes to |
|---|---|---|
| Checklist delivery + 30-day sequence | Checklist / newsletter opt-in | The subscriber |
| Inquiry notification | Contact form | The department inbox |
| Auto-reply confirmation | Contact form | The person who wrote in |

### Create an App Password

You're authenticating with a **free @gmail.com account**. Google rejects
normal account passwords over SMTP, so you need an App Password:

1. The account must have **2-Step Verification** turned on
   (myaccount.google.com → Security).
2. Go to **myaccount.google.com/apppasswords**.
3. Name it "Carter Cole website", create it, copy the 16 characters.
4. `SMTP_USER` = the full @gmail.com address. `SMTP_PASS` = those 16
   characters.

If the App Passwords page isn't available, 2-Step Verification is off. There's
no other route — Google removed "less secure app access".

> **Use a dedicated Gmail account, not a personal one.** If the site ever hits
> the daily send cap, a shared account stops sending *your* mail too.

### Choose the From address

This is the one real limitation of a free Gmail account: it cannot DKIM-sign
mail for your domain. Only paid Workspace can. By default Google **rewrites**
the From header to the authenticated account — so whatever you put in
`MAIL_FROM`, recipients see the @gmail.com address.

Two ways to handle it:

**Option 1 — send as the Gmail address.** Honest and authenticates cleanly:

```
MAIL_FROM="Lashanda Carter <yourname@gmail.com>"
MAIL_REPLY_TO=info@cartercoleandassociates.com
```

Less polished, but it lands in inboxes, and replies still reach the business
mailbox.

**Option 2 — send as the business address.** In Gmail: Settings → Accounts and
Import → **"Send mail as"** → add `info@cartercoleandassociates.com`. Google
emails a confirmation code to that Bluehost mailbox; confirm it, then:

```
MAIL_FROM="Carter Cole & Associates <info@cartercoleandassociates.com>"
```

Google will now send with that From header. The trade-off: the message is
DKIM-signed by `gmail.com`, not your domain, so DMARC alignment fails. Neither
of your domains enforces DMARC today, so mail is still delivered — but spam
placement is more likely, particularly at Outlook. Fixing the SPF records
below improves it considerably.

Whichever you pick, don't leave `MAIL_FROM` as an address you haven't
verified. Google rewrites it silently and you'd never know your branding was
gone. The mailer logs a warning at startup if `MAIL_FROM` doesn't match
`SMTP_USER`, as a safety net.

### Fix DNS, or everything goes to spam

You send from two domains — `cartercoleandassociates.com` and
`smarttaxiq.com` — and **both are hosted at Bluehost, not Google.** Each needs
Google added to its SPF record before Google is allowed to send as it.

**Fix this one first.** `cartercoleandassociates.com` publishes *two* SPF
records:

```
v=spf1 ip4:173.254.104.88 a mx include:websitewelcome.com ~all
v=spf1 include:spf.cloudus.oxcs.net ~all
```

A domain may publish exactly one. With two, receivers return `permerror` and
SPF fails outright — mail from this domain is failing authentication today,
whoever sends it. Delete both and publish this single merged record:

```
v=spf1 ip4:173.254.104.88 a mx include:websitewelcome.com include:spf.cloudus.oxcs.net include:_spf.google.com ~all
```

Then `smarttaxiq.com`, which has one correct record that simply doesn't
mention Google:

```
v=spf1 +a +mx +ip4:50.6.2.58 include:bluehost.com include:_spf.google.com ~all
```

**DKIM.** Neither domain is verified with Google. DKIM signing requires paid
Google Workspace with the domain added to it (Admin console → Apps → Google
Workspace → Gmail → **Authenticate email**). A free @gmail.com account cannot
sign mail for your domain — which is why sending as
`@cartercoleandassociates.com` from free Gmail will land in spam regardless of
anything else you do.

**DMARC.** `smarttaxiq.com` is at `p=none`, monitoring only. Leave it until
SPF and DKIM both pass, then tighten to `p=quarantine`.

Verify any change at [mxtoolbox.com/spf.aspx](https://mxtoolbox.com/spf.aspx).
DNS edits can take a few hours to propagate.

### Sending limits — read this one

Google's documented caps:

| Account type | Messages per day |
|---|---|
| **Free @gmail.com — what you're using** | **~500** |
| Google Workspace (paid) | 2,000 |
| Workspace trial | 500 |

Exceed one and **the account cannot send anything for 24 hours** — your
contact form notifications included. To make that impossible, the dispatcher
counts what it has actually sent in the rolling last 24 hours and stops short
of `MAIL_DAILY_LIMIT` (set to 300, leaving headroom under Gmail's ~500). Anyone not reached is picked up on the
next run. Nothing is ever sent twice, and nobody is skipped.

`MAIL_THROTTLE_MS` (default 1200) paces sends at roughly one per second so a
run doesn't look like a burst.

Raise `MAIL_DAILY_LIMIT` to about 1500 if you move to paid Workspace.

> **A note on scale.** Google is fine for the contact form and for a list in
> the hundreds. It is not built for bulk marketing mail — there's no bounce
> handling, no complaint feedback loop, and no suppression list, and
> Workspace's terms don't cover bulk sending. Once the list passes roughly a
> thousand people, move the *sequence* to Amazon SES or Postmark and leave the
> contact form on Google. That's a change to four environment variables, not
> to any code.

## Step 6 — Check your work, then run it

```bash
npm install
npm run check
```

`npm run check` verifies all three things that account for nearly every
"why isn't it working" moment — that every environment variable is present,
that Supabase is reachable and the schema was applied, and that Gmail accepts
your App Password. It sends nothing and writes nothing. Fix anything it flags
before going further.

Then:

```bash
npm run dev
```

Then test end to end:

- Go to `/checklist`, submit the form. You should get the PDF link back
  immediately, and the first sequence email in your inbox.
- Go to `/contact`, submit an inquiry. The department inbox gets the
  notification; you get the auto-reply.
- Open `/admin/subscribers` and sign in with `ADMIN_PASSWORD`. Both should be
  listed there.
- Check **Table Editor** in Supabase — the rows are visibly there.

---

## Step 7 — Deploying to Vercel

1. Push the project to GitHub, then import it at
   [vercel.com/new](https://vercel.com/new).
2. **Settings → Environment Variables**: add every variable from `.env.local`.
   Set `SITE_URL` to the real domain, not localhost.
3. Deploy.

### The cron job

`vercel.json` schedules `/api/cron/dispatch` daily at 14:00 UTC (about 9am
Eastern). That is what actually sends the sequence — emails 2 through 6 never
go out without it.

Vercel automatically sends `CRON_SECRET` as an `Authorization: Bearer` header,
so the endpoint authenticates itself. Just make sure `CRON_SECRET` is set in
Vercel's environment variables.

> Vercel's **Hobby** plan allows one cron run per day, which is exactly what
> is configured. On **Pro** you can raise it to hourly by changing the
> schedule to `0 * * * *` — the dispatcher is idempotent, so running it more
> often never sends anything twice.

Test the schedule without sending anything:

```
https://your-domain.com/api/cron/dispatch?dry=1&secret=YOUR_CRON_SECRET
```

### The gated PDFs

`private-assets/*.pdf` used to be in `.gitignore`. That has been removed —
Vercel deploys from git, so an untracked PDF simply would not exist in
production and every download would 404. The files are still protected: they
sit outside `/public` and can only be reached with a subscriber's token.

Make sure both PDFs are committed:

```bash
git add -f private-assets/*.pdf
```

> `foundation-checklist.pdf` is currently only 3.6 KB, which looks like a
> placeholder. Replace it with the real checklist before launch.

---

## Where your data is, day to day

**The admin dashboard** — `/admin/subscribers`, password-protected. Shows
every subscriber, how far through the sequence they are, what they downloaded,
and every contact form inquiry with its message. There is a **Download CSV**
button for the subscriber list.

**Supabase Table Editor** — the raw tables, filterable and sortable, from any
browser. Good for spot checks and one-off exports.

**Supabase SQL Editor** — for real questions:

```sql
-- Signups in the last 30 days, by source
select source, count(*)
from subscribers
where created_at > now() - interval '30 days'
group by source;

-- Inquiries that failed to email out
select * from contact_submissions where error is not null;

-- People who subscribed but never opened the checklist
select s.email, s.created_at
from subscribers s
left join downloads d on d.subscriber_id = s.id
where d.id is null and s.status = 'active';
```

---

## Troubleshooting

**"Supabase is not configured"** — `SUPABASE_URL` or
`SUPABASE_SERVICE_ROLE_KEY` is missing. In Vercel, remember that adding an
environment variable does nothing until you redeploy.

**Signups save but no email arrives** — SMTP isn't configured. The admin
dashboard shows a warning banner when it's missing. Submissions are always
stored first and emailed second, so a mail outage never costs you a lead.

**`Invalid login: 535-5.7.8 Username and Password not accepted`** — you used
the account's normal password. Google requires an App Password over SMTP.

**Emails send but arrive from the wrong address** — `MAIL_FROM` doesn't match
`SMTP_USER` and isn't verified under Gmail's "Send mail as". Google rewrote
the header.

**Emails land in spam** — SPF doesn't include `_spf.google.com`, or DKIM
isn't set up for the domain. See Step 5.

**Sending suddenly stops for a day** — the Google daily cap was hit. Lower
`MAIL_DAILY_LIMIT`, or move the sequence to a dedicated sending service.

**Everything returns a permissions error** — you used the `anon` key instead
of `service_role`.

**The sequence never advances past email 1** — the cron isn't running. Check
`CRON_SECRET` is set in Vercel, and look at Vercel → your project → **Cron
Jobs** for the run log.
