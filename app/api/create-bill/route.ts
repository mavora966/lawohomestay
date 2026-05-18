import { NextRequest, NextResponse } from "next/server";
import { formatPhone, generateBookingCode, getDayType } from "@/lib/utils";
import { UNITS, DEPOSIT } from "@/lib/units";

const BILLPLZ_BASE = "https://www.billplz.com/api/v3";
const DEFAULT_EMAIL = "hgmarketing966@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { unit, checkin, checkout, nights, guestName, guestPhone, guestEmail, bank } = body;

    // Validate required fields
    if (!unit || !checkin || !checkout || !nights || !guestName || !guestPhone || !bank) {
      return NextResponse.json({ error: "Maklumat tidak lengkap." }, { status: 400 });
    }

    const unitData = UNITS[unit as keyof typeof UNITS];
    if (!unitData) {
      return NextResponse.json({ error: "Unit tidak sah." }, { status: 400 });
    }

    const phone = formatPhone(guestPhone);
    const email = guestEmail?.trim() || DEFAULT_EMAIL;
    const bookingCode = generateBookingCode();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawohomestay.com";

    // Build Billplz bill
    const billData = new URLSearchParams({
      collection_id: process.env.BILLPLZ_COLLECTION_ID ?? "",
      email,
      mobile: phone,
      name: guestName,
      amount: String(DEPOSIT * 100), // in cents
      description: `Deposit tempahan ${unitData.name} | ${checkin} - ${checkout} | ${bookingCode}`,
      callback_url: `${siteUrl}/api/billplz`,
      redirect_url: `${siteUrl}/thankyou`,
      reference_1_label: "Kod Tempahan",
      reference_1: bookingCode,
      reference_2_label: "Unit",
      reference_2: unitData.name,
    });

    // Add FPX bank if provided
    if (bank) {
      billData.append("payment_method", "fpx");
      billData.append("fpx_bank_account_number", bank);
    }

    const billRes = await fetch(`${BILLPLZ_BASE}/bills`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.BILLPLZ_API_KEY}:`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: billData.toString(),
    });

    if (!billRes.ok) {
      const errText = await billRes.text();
      console.error("Billplz error:", errText);
      return NextResponse.json({ error: "Gagal mencipta bil pembayaran." }, { status: 500 });
    }

    const bill = await billRes.json();

    // Calculate amount
    const dayType = getDayType(new Date(checkin));
    const priceKey = `${dayType}_${Number(nights) >= 2 ? "2" : "1"}night` as keyof typeof unitData.pricing;
    const amount = Number(nights) >= 2
      ? unitData.pricing[priceKey]
      : unitData.pricing[priceKey] * Number(nights);

    // Fire CAPI InitiateCheckout (fire-and-forget)
    fetch(`${siteUrl}/api/capi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "InitiateCheckout",
        value: DEPOSIT,
        currency: "MYR",
        phone,
        email,
      }),
    }).catch(() => {});

    return NextResponse.json({ url: bill.url, billId: bill.id, bookingCode });
  } catch (err) {
    console.error("create-bill error:", err);
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
