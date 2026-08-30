/**
 * SQLite driver adapter.
 *
 * Two drivers, same tiny surface:
 *
 *  1. `better-sqlite3` — the mature choice, used when it's installed.
 *  2. `node:sqlite`    — built into Node 22.5+, no native build at all.
 *
 * better-sqlite3 compiles native code on install, which needs either a
 * prebuilt binary for your exact Node version or a working compiler
 * toolchain. On Windows that step fails often enough to be a real problem,
 * and a failed install would take the whole site down, not just the funnel.
 * So it's an optional dependency: if it isn't there, we fall back to Node's
 * own SQLite and everything keeps working.
 *
 * If you want to pin the mature driver explicitly:  npm install better-sqlite3
 */

import { createRequire } from "node:module";

// createRequire rather than a bare require(): resolves the same way under
// both CommonJS and ESM, and keeps the optional dependency out of the
// bundler's static graph so a missing better-sqlite3 is a runtime fallback
// rather than a build failure.
const nodeRequire = createRequire(import.meta.url);

export type Row = Record<string, unknown>;

export interface Statement {
  run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
  get(...params: unknown[]): Row | undefined;
  all(...params: unknown[]): Row[];
}

export interface Db {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  driver: "better-sqlite3" | "node:sqlite";
}

export function openDatabase(path: string): Db {
  // Preferred: better-sqlite3, when present.
  try {
    const Database = nodeRequire("better-sqlite3");
    const db = new Database(path);
    db.pragma("journal_mode = WAL");
    return {
      exec: (sql: string) => db.exec(sql),
      prepare: (sql: string) => db.prepare(sql) as Statement,
      driver: "better-sqlite3",
    };
  } catch {
    // Fall through to the built-in driver.
  }

  // Built into Node 22.5+; no compilation, no dependency.
  const { DatabaseSync } = nodeRequire("node:sqlite");
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL");

  return {
    exec: (sql: string) => db.exec(sql),
    prepare: (sql: string) => {
      const stmt = db.prepare(sql);
      return {
        run: (...p: unknown[]) => {
          const r = stmt.run(...p);
          return {
            changes: Number(r.changes),
            lastInsertRowid: Number(r.lastInsertRowid),
          };
        },
        // node:sqlite returns null-prototype objects; spread into plain ones
        // so downstream code can rely on normal object behaviour.
        get: (...p: unknown[]) => {
          const r = stmt.get(...p);
          return r ? ({ ...r } as Row) : undefined;
        },
        all: (...p: unknown[]) => (stmt.all(...p) as Row[]).map((r) => ({ ...r })),
      };
    },
    driver: "node:sqlite",
  };
}
