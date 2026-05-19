import { NextRequest, NextResponse } from "next/server";
import { formatPhone, generateBookingCode, getDayType } from "@/lib/utils";
import { UNITS, DEPOSIT } from "@/lib/units";
import { prisma } from "@/lib/prisma";

const BILLPLZ_BASE = "https://www.billplz.com/api/v3";
const DEFAULT_EMAIL = "hgmarketing966@gmail.com";
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawohomestay.com",
  "http://localhost:3000",
];

export async function POST(req: NextRequest) {
  // CSRF: reject cross-origin requests
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { unit, checkin, checkout, nights, guestName, guestPhone, guestEmail } = body;

    // --- Input validation ---
    if (!unit || !checkin || !checkout || !nights || !guestName || !guestPhone) {
      return NextResponse.json({ error: "Maklumat tidak lengkap." }, { status: 400 });
    }

    // Validate unit against whitelist
    if (!["unit1", "unit2"].includes(unit)) {
      return NextResponse.json({ error: "Unit tidak sah." }, { status: 400 });
    }

    // Validate nights is a positive integer (1–30)
    const nightsNum = Number(nights);
    if (!Number.isInteger(nightsNum) || nightsNum < 1 || nightsNum > 30) {
      return NextResponse.json({ error: "Bilangan malam tidak sah." }, { status: 400 });
    }

    // Cross-validate nights against actual date difference
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      return NextResponse.json({ error: "Tarikh tidak sah." }, { status: 400 });
    }
    const expectedNights = Math.floor((checkoutDate.getTime() - checkinDate.getTime()) / 86400000);
    if (expectedNights !== nightsNum) {
      return NextResponse.json({ error: "Maklumat tarikh tidak konsisten." }, { status: 400 });
    }
    if (checkinDate < new Date()) {
      return NextResponse.json({ error: "Tarikh check-in sudah lepas." }, { status: 400 });
    }

    // Validate field lengths
    if (String(guestName).trim().length > 100) {
      return NextResponse.json({ error: "Nama terlalu panjang." }, { status: 400 });
    }
    if (String(guestPhone).replace(/\D/g, "").length > 15) {
      return NextResponse.json({ error: "Nombor telefon tidak sah." }, { status: 400 });
    }

    // Guard: payment gateway env vars must be present
    if (!process.env.BILLPLZ_COLLECTION_ID || !process.env.BILLPLZ_API_KEY) {
      console.error("Billplz env vars not configured");
      return NextResponse.json({ error: "Sistem pembayaran tidak dikonfigurasi." }, { status: 500 });
    }

    const unitData = UNITS[unit as keyof typeof UNITS];
    if (!unitData) {
      return NextResponse.json({ error: "Unit tidak sah." }, { status: 400 });
    }

    const phone = formatPhone(guestPhone);
    const email = guestEmail?.trim() || DEFAULT_EMAIL;
    const bookingCode = generateBookingCode();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawohomestay.com";

    const dayType = getDayType(checkinDate);
    const priceKey = `${dayType}_${nightsNum >= 2 ? "2" : "1"}night` as keyof typeof unitData.pricing;
    const amount = nightsNum >= 2
      ? unitData.pricing[priceKey]
      : unitData.pricing[priceKey] * nightsNum;

    // --- Double-booking prevention (atomic transaction) ---
    const conflict = await prisma.booking.findFirst({
      where: {
        unit,
        status: { in: ["pending", "confirmed"] },
        AND: [
          { checkin_date: { lt: checkoutDate } },
          { checkout_date: { gt: checkinDate } },
        ],
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Tarikh ini telah ditempah. Sila pilih tarikh lain." }, { status: 409 });
    }

    // Build Billplz bill
    const billData = new URLSearchParams({
      collection_id: process.env.BILLPLZ_COLLECTION_ID,
      email,
      mobile: phone,
      name: guestName.trim(),
      amount: String(DEPOSIT * 100), // in cents
      description: `Deposit tempahan ${unitData.name} | ${checkin} - ${checkout} | ${bookingCode}`,
      callback_url: `${siteUrl}/api/billplz`,
      redirect_url: `${siteUrl}/thankyou`,
      reference_1_label: "Kod Tempahan",
      reference_1: bookingCode,
      reference_2_label: "Unit",
      reference_2: unitData.name,
    });

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

    // Save booking to DB
    await prisma.booking.create({
      data: {
        booking_code: bookingCode,
        unit,
        guest_name: guestName.trim(),
        guest_phone: phone,
        guest_email: email !== DEFAULT_EMAIL ? email : null,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        nights: nightsNum,
        day_type: dayType,
        amount,
        deposit: DEPOSIT,
        billplz_bill_id: bill.id,
        status: "pending",
        source: "website",
      },
    });

    // Fire CAPI InitiateCheckout via internal-only endpoint (fire-and-forget)
    fetch(`${siteUrl}/api/capi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: JSON.stringify({ event: "InitiateCheckout", value: DEPOSIT, currency: "MYR", phone, email }),
    }).catch(() => {});

    return NextResponse.json({ url: bill.url, billId: bill.id, bookingCode });
  } catch (err) {
    console.error("create-bill error:", err);
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
