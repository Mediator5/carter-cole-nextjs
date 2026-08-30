import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const res = NextResponse.redirect(
    new URL("/admin/subscribers", request.url),
    { status: 303 }
  );
  res.cookies.set("cca_admin", "", { path: "/", maxAge: 0 });
  return res;
}
