import { NextRequest, NextResponse } from "next/server";
import { fetchIcalBooked } from "@/lib/ical";

const VALID_UNITS = new Set(["unit1", "unit2"]);

export async function GET(req: NextRequest) {
  const rawUnit = req.nextUrl.searchParams.get("unit") ?? "";
  if (!VALID_UNITS.has(rawUnit)) {
    return NextResponse.json({ error: "Unit tidak sah." }, { status: 400 });
  }
  const booked = await fetchIcalBooked(rawUnit);
  return NextResponse.json({ booked });
}
