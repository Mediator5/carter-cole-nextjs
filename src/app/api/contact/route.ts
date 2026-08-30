import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 *
 * TO GO LIVE: wire this to your email provider. Two easy options —
 *
 *  1. Resend (https://resend.com):
 *       npm i resend
 *       const resend = new Resend(process.env.RESEND_API_KEY);
 *       await resend.emails.send({
 *         from: "website@cartercoleassociates.com",
 *         to: routeTo(body.department),
 *         subject: `New ${body.department} inquiry from ${body.firstName}`,
 *         text: JSON.stringify(body, null, 2),
 *       });
 *
 *  2. Forward straight into your existing JotForm / CRM webhook via fetch().
 *
 * Until then this endpoint validates the payload and logs it server-side.
 */

const DEPARTMENT_INBOX: Record<string, string> = {
  tax: "lashanda@smarttaxiq.com",
  credit: "info@cartercoleassociates.com",
  business: "info@cartercoleassociates.com",
  bookkeeping: "info@cartercoleassociates.com",
  consulting: "info@cartercoleassociates.com",
  general: "info@cartercoleassociates.com",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message } = body ?? {};

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const routeTo =
      DEPARTMENT_INBOX[body.department as string] ?? DEPARTMENT_INBOX.general;

    console.log("[contact] new inquiry →", routeTo, {
      firstName,
      lastName,
      email,
      phone: body.phone ?? null,
      department: body.department ?? "general",
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
