import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  allSubscribersWithStats,
  allContactSubmissions,
  stats,
} from "@/lib/db";
import { sequence } from "@/lib/sequence";
import { mailerConfigured } from "@/lib/mailer";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Subscribers",
  robots: { index: false, follow: false },
};

function authed() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return cookies().get("cca_admin")?.value === expected;
}

export default async function AdminSubscribersPage() {
  if (!process.env.ADMIN_PASSWORD) {
    return (
      <section className="container-x py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-navy/10 bg-white p-8">
          <h1 className="display text-[26px]">Admin is locked</h1>
          <p className="prose-body mt-4 text-[15px]">
            Set <code className="rounded bg-cream px-1.5 py-0.5">ADMIN_PASSWORD</code>{" "}
            in your <code className="rounded bg-cream px-1.5 py-0.5">.env.local</code>{" "}
            and restart the server to use this page.
          </p>
        </div>
      </section>
    );
  }

  if (!authed()) return <AdminLogin />;

  const [rows, s, inquiries] = await Promise.all([
    allSubscribersWithStats(),
    stats(),
    allContactSubmissions(100),
  ]);

  const tiles = [
    ["Active subscribers", s.active],
    ["Unsubscribed", s.unsubscribed],
    ["Emails sent", s.emails_sent],
    ["Failed sends", s.emails_failed],
    ["Checklist downloads", s.downloads],
    ["Contact inquiries", s.contact_submissions],
  ] as const;

  return (
    <section className="bg-cream py-14 sm:py-16">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="display mt-3 text-[32px] leading-tight sm:text-[38px]">
              Subscribers
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/api/admin/export" className="btn-primary text-[13.5px]">
              Download CSV
            </a>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="btn-ghost text-[13.5px]">
                Sign out
              </button>
            </form>
          </div>
        </div>

        {!mailerConfigured() && (
          <div className="mt-8 rounded-xl border border-gold bg-gold/10 px-5 py-4 text-[14.5px] text-navy">
            <strong>SMTP isn&rsquo;t configured yet.</strong> Subscribers are
            being captured and the download works, but no emails are going out.
            Add your mail settings to <code>.env.local</code> to start sending.
          </div>
        )}

        <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-navy/10 bg-white px-6 py-5"
            >
              <span className="display block text-[32px] leading-none text-navy">
                {value ?? 0}
              </span>
              <span className="mt-2 block text-[12.5px] leading-snug text-navy/50">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-navy/10 bg-white">
          <table className="w-full min-w-[860px] text-left text-[14.5px]">
            <thead>
              <tr className="border-b border-navy/10 text-[11.5px] uppercase tracking-[0.14em] text-navy/45">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Sequence</th>
                <th className="px-6 py-4 font-semibold">Downloads</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-navy/[0.07] last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-navy">
                    {r.first_name} {r.last_name ?? ""}
                  </td>
                  <td className="px-6 py-4 text-navy/70">{r.email}</td>
                  <td className="px-6 py-4 text-navy/55">
                    {new Date(r.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <span className="flex gap-1" aria-hidden>
                        {sequence.map((_, i) => (
                          <span
                            key={i}
                            className={`h-2 w-5 rounded-full ${
                              i < r.sent_count ? "bg-emerald-700" : "bg-navy/12"
                            }`}
                          />
                        ))}
                      </span>
                      <span className="text-[13px] text-navy/50">
                        {r.sent_count}/{sequence.length}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-navy/70">{r.download_count}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                        r.status === "active"
                          ? "bg-emerald-700/10 text-emerald-800"
                          : "bg-navy/8 text-navy/50"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-[15px] text-navy/45"
                  >
                    No subscribers yet. They&rsquo;ll appear here the moment
                    someone downloads the checklist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[13px] text-navy/45">
          The sequence bar shows how many of the {sequence.length} emails have
          gone out. It advances when the dispatcher runs — once a day on
          Vercel&rsquo;s schedule.
        </p>

        {/* -------------------------------------------------------------- */}
        {/*  Contact form inquiries                                        */}
        {/* -------------------------------------------------------------- */}
        <h2 className="display mt-16 text-[28px] leading-tight">
          Contact inquiries
        </h2>
        <p className="mt-2 text-[14px] text-navy/50">
          Everything submitted through the contact form on /contact and /book.
        </p>

        <div className="mt-6 space-y-4">
          {inquiries.map((q) => (
            <article
              key={q.id}
              className="rounded-2xl border border-navy/10 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-navy">
                    {q.first_name} {q.last_name ?? ""}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-navy/60">
                    <a
                      href={`mailto:${q.email}`}
                      className="underline decoration-navy/20 underline-offset-4 hover:text-emerald-700"
                    >
                      {q.email}
                    </a>
                    {q.phone ? ` · ${q.phone}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-navy/[0.06] px-3 py-1 text-[12px] font-semibold text-navy/70">
                    {q.department}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                      q.notified
                        ? "bg-emerald-700/10 text-emerald-800"
                        : "bg-gold/20 text-navy/70"
                    }`}
                    title={q.error ?? undefined}
                  >
                    {q.notified ? "emailed" : "not emailed"}
                  </span>
                  <span className="text-[12.5px] text-navy/45">
                    {new Date(q.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap border-l-2 border-gold pl-4 text-[14.5px] leading-relaxed text-navy/75">
                {q.message}
              </p>
              {q.error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
                  Delivery problem: {q.error}
                </p>
              )}
            </article>
          ))}
          {inquiries.length === 0 && (
            <div className="rounded-2xl border border-navy/10 bg-white px-6 py-16 text-center text-[15px] text-navy/45">
              No inquiries yet. Contact form submissions will appear here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
