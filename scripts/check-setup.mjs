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

// ---- summary --------------------------------------------------------------
console.log(
  failures === 0
    ? `\n${GREEN}Everything checks out.${OFF} Run npm run dev and submit a test form.\n`
    : `\n${RED}${failures} check(s) failed.${OFF} Fix the items above, then run npm run check again.\n`
);
process.exit(failures === 0 ? 0 : 1);
