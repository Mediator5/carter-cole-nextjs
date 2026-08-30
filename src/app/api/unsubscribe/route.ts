import { NextResponse } from "next/server";
import { unsubscribe, getSubscriberByToken } from "@/lib/db";

export const dynamic = "force-dynamic";

function page(title: string, message: string, ok: boolean) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title></head>
<body style="margin:0;background:#f4f2ee;font-family:Helvetica,Arial,sans-serif">
<div style="max-width:520px;margin:12vh auto;background:#fff;border:1px solid #e6e2da;border-radius:14px;padding:44px 38px;text-align:center">
  <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#0f1d44">
    Carter Cole <span style="color:#ddb33c">&amp;</span> Associates
  </div>
  <div style="width:44px;height:1px;background:#ddb33c;margin:22px auto"></div>
  <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:26px;color:#0f1d44">${title}</h1>
  <p style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#6b7789">${message}</p>
  <a href="/" style="display:inline-block;padding:13px 28px;border-radius:999px;background:${
    ok ? "#0a6b4f" : "#0f1d44"
  };color:#fff;text-decoration:none;font-size:14px;font-weight:700">Back to the site</a>
</div></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function handle(token: string | null) {
  if (!token) {
    return page(
      "Link incomplete",
      "That unsubscribe link is missing its code. Reply to any of our emails and we'll remove you by hand.",
      false
    );
  }

  const sub = getSubscriberByToken(token);
  if (!sub) {
    return page(
      "Link not recognised",
      "We couldn't match that link to a subscription — it may already have been removed. Reply to any of our emails if you still hear from us.",
      false
    );
  }

  if (sub.status === "unsubscribed") {
    return page(
      "You're already unsubscribed",
      `${sub.email} isn't on the list. You won't receive anything further.`,
      true
    );
  }

  unsubscribe(token);
  return page(
    "You're unsubscribed",
    `${sub.email} has been removed and won't receive any more emails from us. The checklist is still yours to keep.`,
    true
  );
}

export async function GET(request: Request) {
  return handle(new URL(request.url).searchParams.get("t"));
}

// Gmail and Yahoo one-click unsubscribe POSTs to the List-Unsubscribe URL.
export async function POST(request: Request) {
  return handle(new URL(request.url).searchParams.get("t"));
}
