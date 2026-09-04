import crypto from "crypto";
import { supabase } from "./supabase";

/**
 * Subscriber + contact storage, backed by Supabase (Postgres).
 *
 * Every function here is async — Postgres is over the network, unlike the
 * SQLite file this replaced. Nothing else in the app talks to the database
 * directly, so swapping providers again would stay contained to this file.
 *
 * Access is via the service-role key (see ./supabase.ts), so Row Level
 * Security is bypassed here and enforced against everyone else.
 */

export type Subscriber = {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  token: string;
  source: string;
  status: "active" | "unsubscribed";
  created_at: string;
  unsubscribed_at: string | null;
};

export type SubscriberRow = Subscriber & {
  sent_count: number;
  download_count: number;
};

export type ContactSubmission = {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  department: string;
  message: string;
  routed_to: string | null;
  notified: boolean;
  auto_replied: boolean;
  error: string | null;
  ip: string | null;
  user_agent: string | null;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/* -------------------------------------------------------------------------- */
/*  Subscribers                                                               */
/* -------------------------------------------------------------------------- */

/** Adds a subscriber, or returns the existing one. Re-subscribes a previously
 *  unsubscribed address and restarts their sequence from day zero. */
export async function upsertSubscriber(input: {
  email: string;
  firstName: string;
  lastName?: string;
  source?: string;
}): Promise<{ subscriber: Subscriber; isNew: boolean }> {
  const db = supabase();
  const email = normalizeEmail(input.email);

  const { data: existing, error: findError } = await db
    .from("subscribers")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (findError) throw new Error(`Lookup failed: ${findError.message}`);

  if (existing) {
    const current = existing as Subscriber;

    if (current.status === "unsubscribed") {
      // Coming back: clear their send history so the sequence starts over.
      const { data: revived, error: reviveError } = await db
        .from("subscribers")
        .update({
          status: "active",
          unsubscribed_at: null,
          created_at: new Date().toISOString(),
          first_name: input.firstName.trim(),
        })
        .eq("id", current.id)
        .select()
        .single();

      if (reviveError) throw new Error(`Resubscribe failed: ${reviveError.message}`);

      await db.from("sends").delete().eq("subscriber_id", current.id);

      return { subscriber: revived as Subscriber, isNew: true };
    }

    return { subscriber: current, isNew: false };
  }

  const token = crypto.randomBytes(24).toString("base64url");

  const { data: created, error: insertError } = await db
    .from("subscribers")
    .insert({
      email,
      first_name: input.firstName.trim(),
      last_name: input.lastName?.trim() || null,
      token,
      source: input.source || "checklist",
    })
    .select()
    .single();

  // Two people submitting the same address at the same instant: the unique
  // index wins, so just read back the row that landed first.
  if (insertError) {
    if (insertError.code === "23505") {
      const { data: raced } = await db
        .from("subscribers")
        .select("*")
        .eq("email", email)
        .single();
      if (raced) return { subscriber: raced as Subscriber, isNew: false };
    }
    throw new Error(`Could not save subscriber: ${insertError.message}`);
  }

  return { subscriber: created as Subscriber, isNew: true };
}

export async function getSubscriberById(id: number) {
  const { data } = await supabase()
    .from("subscribers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Subscriber | null) ?? undefined;
}

export async function getSubscriberByToken(token: string) {
  const { data } = await supabase()
    .from("subscribers")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  return (data as Subscriber | null) ?? undefined;
}

export async function unsubscribe(token: string) {
  const { data, error } = await supabase()
    .from("subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("token", token)
    .eq("status", "active")
    .select("id");

  if (error) throw new Error(`Unsubscribe failed: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

export async function activeSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase()
    .from("subscribers")
    .select("*")
    .eq("status", "active")
    .order("id", { ascending: true });

  if (error) throw new Error(`Could not load subscribers: ${error.message}`);
  return (data ?? []) as Subscriber[];
}

/* -------------------------------------------------------------------------- */
/*  Sends                                                                     */
/* -------------------------------------------------------------------------- */

export async function recordSend(
  subscriberId: number,
  emailKey: string,
  status: "sent" | "failed",
  error?: string
) {
  const { error: writeError } = await supabase()
    .from("sends")
    .upsert(
      {
        subscriber_id: subscriberId,
        email_key: emailKey,
        sent_at: new Date().toISOString(),
        status,
        error: error ?? null,
      },
      { onConflict: "subscriber_id,email_key" }
    );

  // A failed bookkeeping write must never mask a successful send, so this is
  // logged rather than thrown.
  if (writeError) console.error("[db] recordSend failed:", writeError.message);
}

export async function sentKeysFor(subscriberId: number): Promise<string[]> {
  const { data } = await supabase()
    .from("sends")
    .select("email_key")
    .eq("subscriber_id", subscriberId)
    .eq("status", "sent");

  return (data ?? []).map((r: { email_key: string }) => r.email_key);
}

/** How many messages we have actually sent in the last 24 hours. Used to keep
 *  a sequence run inside Google's daily cap — the contact form spends from the
 *  same allowance, so counting sends is more honest than counting subscribers. */
export async function sendsInLast24h(): Promise<number> {
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count, error } = await supabase()
    .from("sends")
    .select("*", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", since);

  if (error) {
    console.error("[db] sendsInLast24h failed:", error.message);
    // Fail safe: report the cap as already spent rather than risk a lockout.
    return Number.MAX_SAFE_INTEGER;
  }
  return count ?? 0;
}

/** One round trip for the whole list, so the dispatcher doesn't make a query
 *  per subscriber. Returns a map of subscriber id -> keys already sent. */
export async function sentKeysForAll(): Promise<Map<number, Set<string>>> {
  const { data } = await supabase()
    .from("sends")
    .select("subscriber_id, email_key")
    .eq("status", "sent");

  const map = new Map<number, Set<string>>();
  for (const row of (data ?? []) as {
    subscriber_id: number;
    email_key: string;
  }[]) {
    const set = map.get(row.subscriber_id) ?? new Set<string>();
    set.add(row.email_key);
    map.set(row.subscriber_id, set);
  }
  return map;
}

/* -------------------------------------------------------------------------- */
/*  Downloads                                                                 */
/* -------------------------------------------------------------------------- */

export async function recordDownload(subscriberId: number, asset: string) {
  const { error } = await supabase().from("downloads").insert({
    subscriber_id: subscriberId,
    asset,
    downloaded_at: new Date().toISOString(),
  });

  if (error) console.error("[db] recordDownload failed:", error.message);
}

/* -------------------------------------------------------------------------- */
/*  Contact submissions                                                       */
/* -------------------------------------------------------------------------- */

export async function saveContactSubmission(input: {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  department?: string | null;
  message: string;
  routedTo?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<ContactSubmission> {
  const { data, error } = await supabase()
    .from("contact_submissions")
    .insert({
      first_name: input.firstName.trim(),
      last_name: input.lastName?.trim() || null,
      email: normalizeEmail(input.email),
      phone: input.phone?.trim() || null,
      department: input.department || "general",
      message: input.message.trim(),
      routed_to: input.routedTo ?? null,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Could not save submission: ${error.message}`);
  return data as ContactSubmission;
}

export async function markContactDelivery(
  id: number,
  patch: { notified?: boolean; autoReplied?: boolean; error?: string | null }
) {
  const { error } = await supabase()
    .from("contact_submissions")
    .update({
      ...(patch.notified !== undefined ? { notified: patch.notified } : {}),
      ...(patch.autoReplied !== undefined
        ? { auto_replied: patch.autoReplied }
        : {}),
      ...(patch.error !== undefined ? { error: patch.error } : {}),
    })
    .eq("id", id);

  if (error) console.error("[db] markContactDelivery failed:", error.message);
}

export async function allContactSubmissions(
  limit = 200
): Promise<ContactSubmission[]> {
  const { data, error } = await supabase()
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Could not load submissions: ${error.message}`);
  return (data ?? []) as ContactSubmission[];
}

/* -------------------------------------------------------------------------- */
/*  Admin dashboard                                                           */
/* -------------------------------------------------------------------------- */

export async function allSubscribersWithStats(): Promise<SubscriberRow[]> {
  const { data, error } = await supabase()
    .from("subscribers_with_stats")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load subscribers: ${error.message}`);
  return (data ?? []) as SubscriberRow[];
}

export async function stats() {
  const db = supabase();
  const head = { count: "exact" as const, head: true };

  const [active, unsubscribed, sent, failed, downloads, contacts] =
    await Promise.all([
      db.from("subscribers").select("*", head).eq("status", "active"),
      db.from("subscribers").select("*", head).eq("status", "unsubscribed"),
      db.from("sends").select("*", head).eq("status", "sent"),
      db.from("sends").select("*", head).eq("status", "failed"),
      db.from("downloads").select("*", head),
      db.from("contact_submissions").select("*", head),
    ]);

  return {
    active: active.count ?? 0,
    unsubscribed: unsubscribed.count ?? 0,
    emails_sent: sent.count ?? 0,
    emails_failed: failed.count ?? 0,
    downloads: downloads.count ?? 0,
    contact_submissions: contacts.count ?? 0,
  };
}
