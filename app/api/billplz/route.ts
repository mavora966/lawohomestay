import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawohomestay.com";

function verifySignature(params: Record<string, string>, xSignature: string): boolean {
  // Sort keys alphabetically, join as key|value pairs, sign with API key
  const payload = Object.keys(params)
    .sort()
    .map((k) => `${k}|${params[k]}`)
    .join("|");
  const expected = crypto
    .createHmac("sha256", BILLPLZ_API_KEY)
    .update(payload)
    .digest("hex");
  return expected === xSignature;
}

// Billplz webhook (server callback)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((val, key) => { params[key] = String(val); });

    const xSignature = req.headers.get("x-signature") ?? params["x-signature"] ?? "";

    // Verify signature in production
    if (process.env.NODE_ENV === "production" && xSignature) {
      const { "x-signature": _, ...signParams } = params;
      if (!verifySignature(signParams, xSignature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const billId = params["id"];
    const paid = params["paid"] === "true";
    const paidAt = params["paid_at"];

    if (paid && billId) {
      // Fire Meta CAPI Purchase (fire-and-forget)
      fetch(`${SITE_URL}/api/capi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "Purchase",
          value: 300,
          currency: "MYR",
          orderId: billId,
        }),
      }).catch(() => {});

      // TODO Fasa 6: update DB deposit_paid=true, status=confirmed
      console.log(`Billplz paid: billId=${billId}, paidAt=${paidAt}`);
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
  const paid = searchParams.get("billplz[paid]");
  return NextResponse.redirect(`${SITE_URL}/thankyou?billplz[paid]=${paid}`);
}
