import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

function hashSHA256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ skipped: true });
    }

    const { event, value, currency, phone, email, orderId } = await req.json();

    const userData: Record<string, string> = {};
    if (phone) userData.ph = hashSHA256(phone);
    if (email) userData.em = hashSHA256(email);

    const eventPayload: Record<string, unknown> = {
      event_name: event,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: userData,
      custom_data: { value, currency: currency ?? "MYR" },
    };
    if (orderId) (eventPayload.custom_data as Record<string, unknown>).order_id = orderId;

    const body: Record<string, unknown> = { data: [eventPayload] };
    if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await res.json();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("CAPI error:", err);
    return NextResponse.json({ ok: false });
  }
}
