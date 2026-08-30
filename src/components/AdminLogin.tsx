"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError("That password isn't right.");
      setBusy(false);
    }
  }

  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="container-x">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-sm rounded-2xl border border-navy/10 bg-white p-8 text-center"
        >
          <span className="eyebrow justify-center">Admin</span>
          <h1 className="display mt-4 text-[26px]">Sign in</h1>
          <p className="mt-2 text-[14px] text-navy/55">
            Subscriber list for Carter Cole &amp; Associates.
          </p>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            className="mt-7 w-full rounded-xl border border-navy/15 px-4 py-3 text-center text-[15px] focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
          />
          {error && (
            <p className="mt-4 text-[13.5px] text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn-primary mt-5 w-full disabled:opacity-60"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
