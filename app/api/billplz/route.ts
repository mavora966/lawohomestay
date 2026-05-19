import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Use dedicated X-Signature key (separate from API key) — get from Billplz dashboard
const BILLPLZ_SIG_KEY = process.env.BILLPLZ_X_SIGNATURE_KEY ?? process.env.BILLPLZ_API_KEY ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawohomestay.com";

function verifySignature(params: Record<string, string>, xSignature: string): boolean {
  if (!BILLPLZ_SIG_KEY) return false; // empty key = always fail
  const payload = Object.keys(params)
    .sort()
    .map((k) => `${k}|${params[k]}`)
    .join("|");
  const expected = crypto
    .createHmac("sha256", BILLPLZ_SIG_KEY)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(xSignature));
}

// Billplz webhook (server callback)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((val, key) => { params[key] = String(val); });

    const xSignature = req.headers.get("x-signature") ?? params["x-signature"] ?? "";

    // Always verify signature — no NODE_ENV bypass
    if (!BILLPLZ_SIG_KEY) {
      console.error("BILLPLZ signature key not configured");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }
    if (!xSignature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
    const { "x-signature": _, ...signParams } = params;
    if (!verifySignature(signParams, xSignature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const billId = params["id"];
    const paid = params["paid"] === "true";
    const paidAt = params["paid_at"];

    if (paid && billId) {
      // Atomic update — only fire side effects if a row was actually changed
      const result = await prisma.booking.updateMany({
        where: { billplz_bill_id: billId, deposit_paid: false },
        data: {
          deposit_paid: true,
          deposit_paid_at: paidAt ? new Date(paidAt) : new Date(),
          status: "confirmed",
        },
      });

      // result.count === 0 means already processed (duplicate webhook) — idempotent
      if (result.count > 0) {
        const booking = await prisma.booking.findFirst({
          where: { billplz_bill_id: billId },
          select: { id: true, booking_code: true },
        });

        if (booking) {
          await prisma.activityLog.create({
            data: {
              action: "deposit_paid",
              description: `Deposit diterima untuk tempahan ${booking.booking_code}`,
              booking_id: booking.id,
            },
          });
        }

        // Fire Meta CAPI Purchase with internal secret (fire-and-forget)
        fetch(`${SITE_URL}/api/capi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
          },
          body: JSON.stringify({ event: "Purchase", value: 300, currency: "MYR", orderId: billId }),
        }).catch(() => {});

        console.log(`Billplz paid: billId=${billId}, paidAt=${paidAt}`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Billplz webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// Billplz redirect (GET) — user kembali dari payment page
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const paid = searchParams.get("billplz[paid]") === "true" ? "true" : "false";
  const billId = searchParams.get("billplz[id]") ?? "";

  // Verify actual DB state — don't trust client-supplied param alone
  let confirmed = false;
  if (paid === "true" && billId) {
    const booking = await prisma.booking.findFirst({
      where: { billplz_bill_id: billId, deposit_paid: true },
      select: { id: true },
    });
    confirmed = !!booking;
  }

  return NextResponse.redirect(`${SITE_URL}/thankyou?paid=${confirmed}`);
}
