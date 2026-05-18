import { NextRequest, NextResponse } from "next/server";

const ICAL_URLS: Record<string, string> = {
  unit1: process.env.ICAL_UNIT1 ?? "",
  unit2: process.env.ICAL_UNIT2 ?? "",
};

// Parse iCal VEVENT blocks and return booked date ranges
function parseIcal(text: string): { start: string; end: string }[] {
  const events: { start: string; end: string }[] = [];
  const eventBlocks = text.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];

  for (const block of eventBlocks) {
    const startMatch = block.match(/DTSTART(?:;[^:]*)?:(\d{8})/);
    const endMatch = block.match(/DTEND(?:;[^:]*)?:(\d{8})/);
    if (startMatch && endMatch) {
      const fmt = (s: string) =>
        `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
      events.push({ start: fmt(startMatch[1]), end: fmt(endMatch[1]) });
    }
  }
  return events;
}

export async function GET(req: NextRequest) {
  const unit = req.nextUrl.searchParams.get("unit") ?? "unit1";
  const url = ICAL_URLS[unit];

  if (!url) {
    return NextResponse.json({ booked: [] });
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) throw new Error(`iCal fetch failed: ${res.status}`);

    const text = await res.text();
    const booked = parseIcal(text);
    return NextResponse.json({ booked });
  } catch {
    return NextResponse.json({ booked: [] });
  }
}
