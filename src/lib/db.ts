import crypto from "crypto";
import fs from "fs";
import path from "path";
import { openDatabase, type Db } from "./sqlite-driver";

/**
 * Subscriber storage.
 *
 * SQLite by design: one file, no server to run, no monthly bill, and the
 * list is yours on disk. It works on any Node host (a VPS, XAMPP, Plesk,
 * Railway, Render, a Docker box). The driver is chosen at runtime in
 * ./sqlite-driver.ts — better-sqlite3 when installed, Node's built-in
 * SQLite otherwise, so a failed native build can't take the site down.
 *
 * IMPORTANT — it does NOT work on serverless platforms such as Vercel or
 * Netlify, whose filesystems are read-only and ephemeral. If you deploy
 * there, keep this file's exported functions and swap the internals for
 * Postgres (Neon and Supabase both have free tiers). Nothing else in the
 * app touches the database directly, so that swap is contained to this file.
 *
 * Set DATABASE_PATH to control where the file lives. Default: ./data/subscribers.db
 */

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "subscribers.db");

let _db: Db | null = null;

function db() {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  _db = openDatabase(DB_PATH);
  _db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      first_name    TEXT NOT NULL,
      last_name     TEXT,
      token         TEXT NOT NULL UNIQUE,
      source        TEXT DEFAULT 'checklist',
      status        TEXT NOT NULL DEFAULT 'active',
      created_at    TEXT NOT NULL,
      unsubscribed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS sends (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      subscriber_id INTEGER NOT NULL,
      email_key     TEXT NOT NULL,
      sent_at       TEXT NOT NULL,
      status        TEXT NOT NULL DEFAULT 'sent',
      error         TEXT,
      UNIQUE(subscriber_id, email_key),
      FOREIGN KEY(subscriber_id) REFERENCES subscribers(id)
    );
    CREATE TABLE IF NOT EXISTS downloads (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      subscriber_id INTEGER NOT NULL,
      asset         TEXT NOT NULL,
      downloaded_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sub_status ON subscribers(status);
    CREATE INDEX IF NOT EXISTS idx_sends_sub ON sends(subscriber_id);
  `);
  return _db;
}

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

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Adds a subscriber, or returns the existing one. Re-subscribes a previously
 *  unsubscribed address and restarts their sequence from day zero. */
export function upsertSubscriber(input: {
  email: string;
  firstName: string;
  lastName?: string;
  source?: string;
}): { subscriber: Subscriber; isNew: boolean } {
  const email = normalizeEmail(input.email);
  const existing = db()
    .prepare("SELECT * FROM subscribers WHERE email = ?")
    .get(email) as Subscriber | undefined;

  if (existing) {
    if (existing.status === "unsubscribed") {
      db()
        .prepare(
          `UPDATE subscribers
             SET status='active', unsubscribed_at=NULL, created_at=?, first_name=?
           WHERE id=?`
        )
        .run(new Date().toISOString(), input.firstName.trim(), existing.id);
      db().prepare("DELETE FROM sends WHERE subscriber_id=?").run(existing.id);
      return { subscriber: getSubscriberById(existing.id)!, isNew: true };
    }
    return { subscriber: existing, isNew: false };
  }

  const token = crypto.randomBytes(24).toString("base64url");
  const info = db()
    .prepare(
      `INSERT INTO subscribers (email, first_name, last_name, token, source, created_at)
       VALUES (?,?,?,?,?,?)`
    )
    .run(
      email,
      input.firstName.trim(),
      input.lastName?.trim() || null,
      token,
      input.source || "checklist",
      new Date().toISOString()
    );

  return {
    subscriber: getSubscriberById(Number(info.lastInsertRowid))!,
    isNew: true,
  };
}

export function getSubscriberById(id: number) {
  return db().prepare("SELECT * FROM subscribers WHERE id=?").get(id) as
    | Subscriber
    | undefined;
}

export function getSubscriberByToken(token: string) {
  return db().prepare("SELECT * FROM subscribers WHERE token=?").get(token) as
    | Subscriber
    | undefined;
}

export function unsubscribe(token: string) {
  const info = db()
    .prepare(
      `UPDATE subscribers SET status='unsubscribed', unsubscribed_at=?
       WHERE token=? AND status='active'`
    )
    .run(new Date().toISOString(), token);
  return info.changes > 0;
}

export function recordSend(
  subscriberId: number,
  emailKey: string,
  status: "sent" | "failed",
  error?: string
) {
  db()
    .prepare(
      `INSERT INTO sends (subscriber_id, email_key, sent_at, status, error)
       VALUES (?,?,?,?,?)
       ON CONFLICT(subscriber_id, email_key)
       DO UPDATE SET sent_at=excluded.sent_at, status=excluded.status, error=excluded.error`
    )
    .run(subscriberId, emailKey, new Date().toISOString(), status, error ?? null);
}

export function sentKeysFor(subscriberId: number): string[] {
  return (
    db()
      .prepare(
        "SELECT email_key FROM sends WHERE subscriber_id=? AND status='sent'"
      )
      .all(subscriberId) as { email_key: string }[]
  ).map((r) => r.email_key);
}

export function activeSubscribers(): Subscriber[] {
  return db()
    .prepare("SELECT * FROM subscribers WHERE status='active' ORDER BY id")
    .all() as Subscriber[];
}

export function recordDownload(subscriberId: number, asset: string) {
  db()
    .prepare(
      "INSERT INTO downloads (subscriber_id, asset, downloaded_at) VALUES (?,?,?)"
    )
    .run(subscriberId, asset, new Date().toISOString());
}

export type SubscriberRow = Subscriber & {
  sent_count: number;
  download_count: number;
};

export function allSubscribersWithStats(): SubscriberRow[] {
  return db()
    .prepare(
      `SELECT s.*,
              (SELECT COUNT(*) FROM sends d WHERE d.subscriber_id=s.id AND d.status='sent') AS sent_count,
              (SELECT COUNT(*) FROM downloads w WHERE w.subscriber_id=s.id) AS download_count
         FROM subscribers s
        ORDER BY s.created_at DESC`
    )
    .all() as SubscriberRow[];
}

export function stats() {
  const row = db()
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM subscribers WHERE status='active')       AS active,
         (SELECT COUNT(*) FROM subscribers WHERE status='unsubscribed') AS unsubscribed,
         (SELECT COUNT(*) FROM sends WHERE status='sent')               AS emails_sent,
         (SELECT COUNT(*) FROM sends WHERE status='failed')             AS emails_failed,
         (SELECT COUNT(*) FROM downloads)                               AS downloads`
    )
    .get() as Record<string, number>;
  return row;
}
