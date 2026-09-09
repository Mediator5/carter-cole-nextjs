/**
 * Diagnoses the Stripe -> Supabase -> Resend delivery chain.
 *
 *   node scripts/check-stripe-setup.mjs
 *   node scripts/check-stripe-setup.mjs --send you@example.com
 *   node scripts/check-stripe-setup.mjs --why      <-- reads the recorded errors
 *
 * Reads .env.local then .env.development.local (which overrides it), the same
 * order `next dev` uses. No dependencies. Writes nothing.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env.development.local"]) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      env[m[1]] = v;
    }
  }
  return env;
}

const env = loadEnv();
const args = process.argv.slice(2);
const whyOnly = args.includes("--why");
let failures = 0;

const ok = (m) => console.log(`  \x1b[32mOK\x1b[0m    ${m}`);
const bad = (m) => {
  failures++;
  console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`);
};
const note = (m) => console.log(`        ${m}`);

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

async function q(pathAndQuery) {
  const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

/* ---------------------------------------------------------------- --why -- */

if (whyOnly) {
  console.log("\n── What the webhook actually recorded ───────────────────\n");

  if (!url || !key) {
    console.log("  Supabase not configured; cannot read.");
    process.exit(1);
  }

  try {
    const sends = await q(
      "sends?select=subscriber_id,email_key,status,error,sent_at&order=sent_at.desc&limit=10"
    );
    console.log(`  sends (${sends.length} most recent):`);
    if (!sends.length) {
      console.log("    (none)");
      note("No send was ever attempted. The throw happened BEFORE the email,");
      note("i.e. in the subscriber upsert or the purchase insert.");
    }
    for (const s of sends) {
      const flag = s.status === "failed" ? "\x1b[31mFAILED\x1b[0m" : "sent  ";
      console.log(
        `    ${flag}  sub=${s.subscriber_id}  key=${s.email_key}  ${s.sent_at}`
      );
      if (s.error) console.log(`            \x1b[33m${s.error}\x1b[0m`);
    }

    const purchases = await q(
      "purchases?select=stripe_event_id,product,amount_cents,currency,created_at&order=created_at.desc&limit=5"
    );
    console.log(`\n  purchases (${purchases.length}):`);
    if (!purchases.length) console.log("    (none)");
    for (const p of purchases) {
      console.log(
        `    ${p.stripe_event_id}  ${p.product}  ${p.amount_cents} ${p.currency}  ${p.created_at}`
      );
    }

    const subs = await q(
      "subscribers?select=id,email,first_name,source,created_at&order=created_at.desc&limit=5"
    );
    console.log(`\n  subscribers (${subs.length} most recent):`);
    for (const s of subs) {
      console.log(
        `    #${s.id}  ${s.email}  (${s.first_name})  source=${s.source}  ${s.created_at}`
      );
    }

    console.log("\n  How to read this:");
    note("A FAILED send with an error   -> that error is the cause.");
    note("A purchase but no send row    -> threw between the two.");
    note("No purchase and no send row   -> threw in the subscriber upsert.");
    console.log("");
  } catch (err) {
    console.log(`  Could not read: ${err.message}\n`);
    process.exit(1);
  }
  process.exit(0);
}

/* -------------------------------------------------------------- default -- */

console.log("\n── Supabase ─────────────────────────────────────────────");

if (!url || !key) {
  bad("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
} else {
  for (const table of ["subscribers", "sends", "purchases"]) {
    try {
      await q(`${table}?select=*&limit=1`);
      ok(`table "${table}" exists and is readable`);
    } catch (err) {
      bad(`table "${table}" -> ${err.message.slice(0, 120)}`);
      if (err.message.includes("404") || err.message.includes("PGRST205")) {
        note("Missing. Run supabase/schema.sql in the Supabase SQL Editor.");
      }
    }
  }
}

console.log("\n── Resend ───────────────────────────────────────────────");

const apiKey = env.RESEND_API_KEY;
const from = env.MAIL_FROM;
const sendTo = args.includes("--send") ? args[args.indexOf("--send") + 1] : null;

if (!apiKey) bad("RESEND_API_KEY not set");
else if (!from) bad("MAIL_FROM not set");
else {
  ok(`key present (${apiKey.slice(0, 3)}…), from = ${from}`);

  if (!sendTo) {
    note("Add --send you@example.com to send a test message.");
  } else {
    // Deliberately sends with the SAME extras the app uses — reply_to, an HTML
    // body and the List-Unsubscribe headers — because a plain text-only send
    // proves less than it appears to. If the app fails where this succeeds,
    // the difference is somewhere else entirely.
    const siteUrl = (env.SITE_URL || "").replace(/\/$/, "");
    const unsub = `${siteUrl}/api/unsubscribe?t=diagnostic`;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: sendTo,
          reply_to: env.MAIL_REPLY_TO || undefined,
          subject: "Carter Cole — delivery check (full shape)",
          text: "If this arrived, the app's exact request shape is accepted.",
          html: "<p>If this arrived, the app's exact request shape is accepted.</p>",
          headers: {
            "List-Unsubscribe": `<${unsub}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        ok(`Resend accepted the full-shape message (id ${body.id})`);
        note(`List-Unsubscribe used: <${unsub}>`);
      } else {
        bad(`Resend refused it (${res.status}): ${body.message || body.name}`);
        note(`List-Unsubscribe sent was: <${unsub}>`);
        if (siteUrl.includes("localhost")) {
          note("SITE_URL is localhost — that URL is in the unsubscribe header.");
        }
      }
    } catch (err) {
      bad(`Could not reach Resend: ${err.message}`);
    }
  }
}

console.log("\n── Stripe ───────────────────────────────────────────────");
const link = env.STRIPE_PAYMENT_LINK_WORKBOOK || "";
const secret = env.STRIPE_WEBHOOK_SECRET || "";
secret.startsWith("whsec_")
  ? ok(`webhook secret present (${secret.length} chars)`)
  : bad("STRIPE_WEBHOOK_SECRET missing or malformed (should start whsec_)");
link.includes("/test_")
  ? ok("payment link is TEST mode")
  : link
    ? ok("payment link is LIVE mode — real charges")
    : bad("STRIPE_PAYMENT_LINK_WORKBOOK not set");

console.log(
  `\n${failures === 0 ? "\x1b[32mAll checks passed\x1b[0m" : `\x1b[31m${failures} check(s) failed\x1b[0m`}`
);
console.log("Run with --why to see what the webhook recorded.\n");
process.exit(failures === 0 ? 0 : 1);
