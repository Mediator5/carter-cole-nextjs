import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSubscriberByToken, hasPurchased, recordDownload } from "@/lib/db";

export const dynamic = "force-dynamic";

const FILE = "from-starter-to-builder-workbook.pdf";
const PRODUCT = "workbook";

/**
 * The paid download.
 *
 * Same token-gating as the free checklist, plus the check that matters here:
 * the token must belong to someone with a recorded purchase. Every subscriber
 * has a token — it sits in the footer of every email they have ever received
 * — so a token on its own must never be enough to fetch a $17 product. The
 * purchase row is the real gate; the token only says who is asking.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  if (!token) {
    return NextResponse.redirect(new URL("/workbook?e=missing", request.url));
  }

  const sub = await getSubscriberByToken(token);
  if (!sub) {
    return NextResponse.redirect(new URL("/workbook?e=invalid", request.url));
  }

  if (!(await hasPurchased(sub.id, PRODUCT))) {
    // Deliberately the same destination as an invalid token, so someone
    // probing with a guessed token learns nothing about whether it was real.
    return NextResponse.redirect(new URL("/workbook?e=invalid", request.url));
  }

  const filePath = path.join(process.cwd(), "private-assets", FILE);
  if (!fs.existsSync(filePath)) {
    console.error("[download] missing asset:", filePath);
    return NextResponse.json(
      { ok: false, error: "The file is temporarily unavailable." },
      { status: 404 }
    );
  }

  await recordDownload(sub.id, PRODUCT);

  const file = fs.readFileSync(filePath);
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="From-Starter-to-Builder-Workbook.pdf"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
