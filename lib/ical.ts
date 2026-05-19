const ICAL_URLS: Record<string, string> = {
  unit1: process.env.ICAL_UNIT1 ?? "",
  unit2: process.env.ICAL_UNIT2 ?? "",
};

export function parseIcal(text: string): { start: string; end: string }[] {
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

export async function fetchIcalBooked(
  unit: string
): Promise<{ start: string; end: string }[]> {
  const url = ICAL_URLS[unit];
  if (!url) return [];

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseIcal(text);
  } catch {
    return [];
  }
}
