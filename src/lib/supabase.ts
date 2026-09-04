import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Uses the SERVICE ROLE key, which bypasses Row Level Security. That is the
 * correct choice here because every call happens inside a Next.js route
 * handler or server component — never in the browser.
 *
 * NEVER prefix the service-role key with NEXT_PUBLIC_. Anything named
 * NEXT_PUBLIC_* is compiled into the JavaScript bundle that ships to visitors,
 * and that key can read and delete your entire database.
 *
 * Configure in .env.local:
 *   SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
 */

let _client: SupabaseClient | null = null;

export function supabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function supabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (and in your Vercel project's Environment Variables)."
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "carter-cole-web" } },
  });

  return _client;
}
