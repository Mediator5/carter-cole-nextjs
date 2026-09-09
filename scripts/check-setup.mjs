/**
 * Pre-flight check. Run with:  npm run check
 *
 * Verifies, without sending anything or writing anything:
 *   1. Every required environment variable is present
 *   2. Supabase is reachable and the schema has been applied
 *   3. Gmail accepts your SMTP credentials
 *
 * Run this before you go looking for bugs. It catches the three things that
 * account for almost every "why isn't it working" moment.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const GREEN = "\x1b[32m", RED = "\x1b[31m", YEL = "\x1b[33m", DIM = "\x1b[2m", OFF = "\x1b[0m";
const ok = (m) => console.log(`  ${GREEN}PASS${OFF}  ${m}`);
const bad = (m, hint) => { console.log(`  ${RED}FAIL${OFF}  ${m}`); if (hint) console.log(`        ${DIM}${hint}${OFF}`); failures++; };
const warn = (m, hint) => { console.log(`  ${YEL}WARN${OFF}  ${m}`); if (hint) console.log(`        ${DIM}${hint}${OFF}`); };

let failures = 0;

// ---- load .env.local ------------------------------------------------------
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error(`${RED}No .env.local found. Copy .env.example to .env.local first.${OFF}`);
  process.exit(1);
}
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8").split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; })
);

// ---- 1. environment variables --------------------------------------------
console.log("\nEnvironment variables");
const required = [
  "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY",
  "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS",
  "SITE_URL", "CRON_SECRET", "ADMIN_PASSWORD",
];
for (const k of required) {
  if (env[k]) ok(k);
  else bad(`${k} is empty`, "See the comments in .env.local for where to get it.");
}

if (env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_SERVICE_ROLE_KEY.includes("service_role")) {
  try {
    const payload = JSON.parse(Buffer.from(env.SUPABASE_SERVICE_ROLE_KEY.split(".")[1], "base64").toString());
    if (payload.role !== "service_role") {
      bad(`SUPABASE_SERVICE_ROLE_KEY is the "${payload.role}" key, not service_role`,
          "Row Level Security will block every query. Copy the service_role secret instead.");
    }
  } catch { /* not a JWT we can read; leave it */ }
}

if (env.MAIL_FROM && env.SMTP_USER && !env.MAIL_FROM.toLowerCase().includes(env.SMTP_USER.toLowerCase())) {
  warn("MAIL_FROM does not contain SMTP_USER",
       'Google will rewrite the From header unless that address is verified under Gmail -> Settings -> Accounts -> "Send mail as".');
}
if (!env.MAIL_FROM) {
  warn("MAIL_FROM is empty", "Falling back to SMTP_USER, so mail will appear to come from the Gmail address.");
}
if (env.SITE_URL?.includes("localhost") && process.env.NODE_ENV === "production") {
  bad("SITE_URL points at localhost", "Unsubscribe and download links in your emails would be broken.");
}

// ---- 2. Supabase ----------------------------------------------------------
console.log("\nSupabase");
if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  for (const t of ["subscribers", "sends", "downloads", "contact_submissions", "subscribers_with_stats"]) {
    const { count, error } = await db.from(t).select("*", { count: "exact", head: true });
    if (error) {
      bad(`${t} — ${error.message}`,
          error.message.includes("does not exist")
            ? "Run supabase/schema.sql in the Supabase SQL Editor."
            : "Check SUPABASE_URL and that you used the service_role key.");
    } else {
      ok(`${t} (${count} rows)`);
    }
  }
} else {
  bad("Skipped — Supabase credentials missing");
}

// ---- 3. SMTP --------------------------------------------------------------
console.log("\nEmail (SMTP)");
if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
  const port = Number(env.SMTP_PORT || 587);
  const t = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 15_000,
  });
  try {
    await t.verify();
    ok(`${env.SMTP_HOST}:${port} accepted the credentials`);
  } catch (e) {
    const msg = String(e.message || e);
    bad(`Could not authenticate — ${msg}`,
        msg.includes("535")
          ? "Google rejected the password. You need a 16-character App Password from myaccount.google.com/apppasswords, not the account's login password."
          : "Check SMTP_HOST and SMTP_PORT. Port 25 is blocked almost everywhere; use 587.");
  } finally {
    t.close();
  }
} else {
  bad("Skipped — SMTP credentials missing");
}

// ---- 4. The lead system ---------------------------------------------------
// Everything here is optional: an unset piece is reported as a warning, not a
// failure, because the site runs without it. What this catches is the worse
// case — a value that is set but wrong, which looks like it is working right
// up until a lead goes missing.
console.log("\nLead system");

// Mailchimp ------------------------------------------------------------------
const mcKey = env.MAILCHIMP_API_KEY;
const mcList = env.MAILCHIMP_AUDIENCE_ID;

if (!mcKey && !mcList) {
  warn("Mailchimp not configured",
       "Leads are still stored in Supabase and still alert you. Add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID to sync them to the broadcast list.");
} else if (!mcKey || !mcList) {
  bad(`Mailchimp is half configured — ${mcKey ? "MAILCHIMP_AUDIENCE_ID" : "MAILCHIMP_API_KEY"} is missing`,
      "Both are needed. Audience ID: Audience -> More options -> Audience settings -> Audience ID.");
} else {
  // The key carries its data centre as a suffix (…-us21) and that is the API
  // subdomain, so the prefix is derived rather than asked for.
  const prefix = (env.MAILCHIMP_SERVER_PREFIX || mcKey.split("-")[1] || "").trim();
  if (!prefix) {
    bad("Could not work out your Mailchimp data centre from the API key",
        'The key should end in something like "-us21". Copy the whole key, including that suffix.');
  } else {
    const auth = "Basic " + Buffer.from(`anystring:${mcKey}`).toString("base64");
    const base = `https://${prefix}.api.mailchimp.com/3.0`;
    try {
      const res = await fetch(`${base}/lists/${mcList}`, { headers: { Authorization: auth } });
      if (res.status === 401) {
        bad("Mailchimp rejected the API key (401)", "Create a fresh key under Account -> Extras -> API keys.");
      } else if (res.status === 404) {
        bad(`Mailchimp has no audience with ID "${mcList}" (404)`,
            "Audience -> More options -> Audience settings -> Audience ID. It is about 10 characters, not the audience name.");
      } else if (!res.ok) {
        bad(`Mailchimp returned HTTP ${res.status}`, `Data centre used: ${prefix}`);
      } else {
        const list = await res.json();
        ok(`Mailchimp audience "${list.name}" (${list.stats?.member_count ?? 0} contacts, data centre ${prefix})`);

        // The two merge fields the sync writes into. Missing ones do not break
        // the sync — the values are simply dropped on the way in, silently,
        // which is exactly the kind of thing nobody notices for six months.
        // Audience fields ("merge fields"). These are the columns of the
        // contact list. Email, First Name and Last Name exist in every
        // audience; PHONE is present but hidden by default; SOURCE never
        // exists until someone creates it.
        const mf = await fetch(`${base}/lists/${mcList}/merge-fields`, { headers: { Authorization: auth } });
        if (mf.ok) {
          const fields = (await mf.json()).merge_fields || [];
          const tags = fields.map((f) => f.tag);
          for (const t of ["PHONE", "SOURCE"]) {
            if (tags.includes(t)) ok(`Audience field ${t} exists`);
            else warn(`Audience field ${t} does not exist — that value will be dropped on the way in`,
                      `Audience -> three-dot menu -> "Audience fields and *|MERGE|* tags" -> Create a new field, merge tag ${t}.`);
          }
          const required = fields.filter((f) => f.required).map((f) => f.tag);
          if (required.length) {
            warn(`Audience fields marked required: ${required.join(", ")}`,
                 "The site sends skip_merge_validation so signups are not rejected for missing them, but consider un-requiring them — the capture forms deliberately ask for very little.");
          }
        }

        const free = (list.stats?.member_count ?? 0);
        if (free >= 200) {
          warn(`${free} contacts — Mailchimp's free plan stops at 250`,
               "Sends are also capped at 500/month and 250/day on free. Worth upgrading before a campaign.");
        }
      }
    } catch (e) {
      bad(`Could not reach Mailchimp — ${e.message}`, "Network problem, or the data centre in the key is wrong.");
    }
  }
}

// Resend, if the list is being run from there instead ------------------------
if (env.RESEND_AUDIENCE_ID && mcKey && mcList) {
  warn("Both Mailchimp and RESEND_AUDIENCE_ID are set — Mailchimp wins",
       "Clear RESEND_AUDIENCE_ID to avoid confusion, or clear the Mailchimp values to switch the list to Resend.");
}

// Lead alerts ----------------------------------------------------------------
if (env.LEAD_NOTIFY_EMAIL) ok(`Lead alerts go to ${env.LEAD_NOTIFY_EMAIL}`);
else warn("LEAD_NOTIFY_EMAIL is empty",
          "Alerts will fall back to MAIL_REPLY_TO, then the site address. Set it explicitly so you know where they land.");

const twilio = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "LEAD_NOTIFY_SMS"];
const twilioSet = twilio.filter((k) => env[k]);
if (twilioSet.length === 0) {
  warn("Text alerts are off", "Email alerts still fire. Add the four TWILIO_* / LEAD_NOTIFY_SMS values to switch texts on.");
} else if (twilioSet.length < twilio.length) {
  bad(`Twilio is half configured — missing ${twilio.filter((k) => !env[k]).join(", ")}`,
      "All four are needed or no text is sent.");
} else {
  const badNums = [env.TWILIO_FROM_NUMBER, ...env.LEAD_NOTIFY_SMS.split(",")]
    .map((n) => n.trim()).filter((n) => n && !/^\+[1-9]\d{6,14}$/.test(n));
  if (badNums.length) {
    bad(`Phone number not in E.164 format: ${badNums.join(", ")}`,
        "Twilio needs +1 then the ten digits, no spaces, dashes or brackets. E.g. +13135550100");
  } else {
    ok(`Text alerts to ${env.LEAD_NOTIFY_SMS}`);
  }
}

// Calendly -------------------------------------------------------------------
const cal = env.NEXT_PUBLIC_CALENDLY_URL;
if (!cal) {
  ok("Calendly using the built-in default (calendly.com/lashandasmarttaxiq/30min)");
} else if (!/^https:\/\/calendly\.com\/.+/.test(cal)) {
  bad(`NEXT_PUBLIC_CALENDLY_URL doesn't look like a Calendly link: ${cal}`,
      "It should look like https://calendly.com/your-name/30min");
} else {
  ok(`Calendly override set: ${cal}`);
}

// Analytics ------------------------------------------------------------------
const ga = env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
if (!ga) {
  warn("Google Analytics is not installed",
       "Do this before spending on ads — traffic history cannot be backfilled.");
} else if (!/^G-[A-Z0-9]+$/i.test(ga)) {
  bad(`NEXT_PUBLIC_GA_MEASUREMENT_ID looks wrong: ${ga}`,
      'A GA4 measurement ID starts with "G-". "UA-" is the retired version and "AW-" is Google Ads.');
} else {
  ok(`Google Analytics ${ga}`);
}

// Webhook secrets ------------------------------------------------------------
for (const k of ["JOTFORM_WEBHOOK_SECRET", "CALENDLY_WEBHOOK_SECRET"]) {
  if (!env[k]) {
    warn(`${k} is empty — that webhook accepts anything that finds the URL`,
         "Set a long random string here and put it in the webhook URL as ?key=...");
  } else if (env[k].length < 16) {
    warn(`${k} is short (${env[k].length} characters)`, "Use something long enough not to be guessed.");
  } else {
    ok(k);
  }
}

// ---- summary --------------------------------------------------------------
console.log(
  failures === 0
    ? `\n${GREEN}Everything checks out.${OFF} Run npm run dev and submit a test form.\n`
    : `\n${RED}${failures} check(s) failed.${OFF} Fix the items above, then run npm run check again.\n`
);
process.exit(failures === 0 ? 0 : 1);
