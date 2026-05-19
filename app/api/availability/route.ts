import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchIcalBooked } from "@/lib/ical";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const VALID_UNITS = new Set(["unit1", "unit2"]);

export async function GET(req: NextRequest) {
  const rawUnit = req.nextUrl.searchParams.get("unit") ?? "";
  if (!VALID_UNITS.has(rawUnit)) {
    return NextResponse.json({ error: "Unit tidak sah." }, { status: 400 });
  }
  const unit = rawUnit;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // DB bookings: pending or confirmed, not yet checked out
    const bookings = await prisma.booking.findMany({
      where: {
        unit,
        status: { in: ["pending", "confirmed"] },
        checkout_date: { gte: today },
      },
      select: { checkin_date: true, checkout_date: true },
    });

    // DB blocked dates
    const blocked = await prisma.blockedDate.findMany({
      where: {
        unit,
        date_to: { gte: today },
      },
      select: { date_from: true, date_to: true },
    });

    // iCal (Airbnb / Booking.com)
    const icalBooked = await fetchIcalBooked(unit);

    const booked = [
      ...bookings.map(({ checkin_date, checkout_date }) => ({
        start: toDateStr(checkin_date),
        end: toDateStr(checkout_date),
      })),
      ...blocked.map(({ date_from, date_to }) => ({
        start: toDateStr(date_from),
        end: toDateStr(date_to),
      })),
      ...icalBooked,
    ];

    return NextResponse.json({ booked }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("availability error:", err);
    return NextResponse.json({ booked: [] });
  }
}
