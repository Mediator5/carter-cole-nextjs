import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/** Constant-time compare so the password can't be guessed by timing. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set." },
      { status: 503 }
    );
  }

  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !safeEqual(password, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("cca_admin", expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
