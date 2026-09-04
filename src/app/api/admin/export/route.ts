import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { allSubscribersWithStats } from "@/lib/db";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const s = value === null || value === undefined ? "" : String(value);
  // Guard against CSV formula injection when the file is opened in Excel.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || cookies().get("cca_admin")?.value !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const rows = await allSubscribersWithStats();
  const header = [
    "first_name",
    "last_name",
    "email",
    "status",
    "source",
    "joined",
    "emails_sent",
    "downloads",
  ];

  const csv = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.first_name,
        r.last_name ?? "",
        r.email,
        r.status,
        r.source,
        r.created_at,
        r.sent_count,
        r.download_count,
      ]
        .map(csvCell)
        .join(",")
    ),
  ].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cca-subscribers-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
