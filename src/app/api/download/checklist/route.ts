import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSubscriberByToken, recordDownload } from "@/lib/db";

export const dynamic = "force-dynamic";

const FILE = "foundation-checklist.pdf";

/**
 * Token-gated download. The PDF lives outside /public so it can't be
 * hot-linked or found by search engines — the only way in is a token issued
 * when someone subscribes. Each fetch is logged, which is how the admin
 * page can show who actually opened what they signed up for.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  if (!token) {
    return NextResponse.redirect(new URL("/checklist?e=missing", request.url));
  }

  const sub = getSubscriberByToken(token);
  if (!sub) {
    return NextResponse.redirect(new URL("/checklist?e=invalid", request.url));
  }

  const filePath = path.join(process.cwd(), "private-assets", FILE);
  if (!fs.existsSync(filePath)) {
    console.error("[download] missing asset:", filePath);
    return NextResponse.json(
      { ok: false, error: "The file is temporarily unavailable." },
      { status: 404 }
    );
  }

  recordDownload(sub.id, "checklist");

  const file = fs.readFileSync(filePath);
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'inline; filename="Foundation-Checklist-Carter-Cole.pdf"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
