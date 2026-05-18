"use client";

import { useState, useEffect, useCallback } from "react";
import { IconChevronLeft, IconChevronRight, IconRefresh } from "@tabler/icons-react";
import { getDayType, formatCurrency } from "@/lib/utils";
import { UNITS } from "@/lib/units";
import BookingModal from "./BookingModal";
import type { Unit } from "@/types";

interface UnitBookingCalendarProps {
  unitId: Unit;
}

interface BookedRange { start: string; end: string; }

const DAYS = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
const MONTHS = ["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];

function getBookedDates(ranges: BookedRange[]): Set<string> {
  const booked = new Set<string>();
  for (const { start, end } of ranges) {
    const s = new Date(start), e = new Date(end);
    for (const d = new Date(s); d < e; d.setDate(d.getDate() + 1))
      booked.add(d.toISOString().slice(0, 10));
  }
  return booked;
}

function toStr(d: Date) { return d.toISOString().slice(0, 10); }

export default function UnitBookingCalendar({ unitId }: UnitBookingCalendarProps) {
  const unit = UNITS[unitId];
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [today] = useState(() => { const t = new Date(); t.setHours(0,0,0,0); return t; });
  const [viewDate, setViewDate] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [checkin, setCheckin] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchIcal = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ical?unit=${unitId}`);
      const data = await res.json();
      setBookedRanges(data.booked ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [unitId]);

  useEffect(() => { fetchIcal(); }, [fetchIcal]);

  const bookedSet = getBookedDates(bookedRanges);
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isBooked = (d: Date) => bookedSet.has(toStr(d));
  const isPast = (d: Date) => d < today;
  const isSelected = (d: Date) => toStr(d) === checkin || toStr(d) === checkout;
  const isInRange = (d: Date) => {
    const s = toStr(d), end = checkout ?? hovered;
    if (!checkin || !end) return false;
    return s > checkin && s < end;
  };

  const handleDay = (d: Date) => {
    if (isPast(d) || isBooked(d)) return;
    const s = toStr(d);
    if (!checkin || (checkin && checkout)) { setCheckin(s); setCheckout(null); }
    else if (s <= checkin) { setCheckin(s); setCheckout(null); }
    else {
      const hasBlocked = [...bookedSet].some(b => b > checkin && b < s);
      if (hasBlocked) { setCheckin(s); setCheckout(null); }
      else setCheckout(s);
    }
  };

  const nights = checkin && checkout
    ? Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000) : 0;

  const estimatedPrice = (() => {
    if (!checkin || !checkout || nights < 1) return null;
    const dayType = getDayType(new Date(checkin));
    const key = `${dayType}_${nights >= 2 ? "2" : "1"}night` as keyof typeof unit.pricing;
    const base = unit.pricing[key];
    return nights >= 2 ? base : base * nights;
  })();

  return (
    <>
      <section id="calendar" className="py-12 md:py-16 bg-lawo-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-lawo-black mb-1">
              Semak Ketersediaan
            </h2>
            <p className="font-outfit text-sm text-lawo-gray">
              Pilih tarikh check-in dan check-out untuk melihat anggaran harga.
            </p>
          </div>

          <div className="bg-lawo-bg rounded-[16px] p-4 md:p-8 max-w-lg">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="p-2 rounded-full hover:bg-lawo-white transition-colors">
                <IconChevronLeft size={18} />
              </button>
              <h3 className="font-playfair text-lg font-bold text-lawo-black">
                {MONTHS[month]} {year}
              </h3>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="p-2 rounded-full hover:bg-lawo-white transition-colors">
                <IconChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center font-outfit text-xs text-lawo-gray font-medium py-1">{d}</div>
              ))}
            </div>

            {loading ? (
              <div className="h-40 flex items-center justify-center gap-2 text-lawo-gray font-outfit text-sm">
                <IconRefresh size={15} className="animate-spin" /> Memuat...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-y-1">
                {cells.map((d, i) => {
                  if (!d) return <div key={`e${i}`} />;
                  const s = toStr(d);
                  const disabled = isBooked(d) || isPast(d);
                  const selected = isSelected(d);
                  const inRange = isInRange(d);
                  return (
                    <button key={s} disabled={disabled}
                      onClick={() => handleDay(d)}
                      onMouseEnter={() => !disabled && setHovered(s)}
                      onMouseLeave={() => setHovered(null)}
                      className={[
                        "h-9 w-full flex items-center justify-center font-outfit text-sm rounded-full transition-all",
                        disabled
                          ? isBooked(d)
                            ? "bg-red-50 text-red-300 cursor-not-allowed line-through text-xs"
                            : "text-lawo-gray-light cursor-not-allowed"
                          : selected
                          ? "bg-lawo-black text-lawo-white font-semibold"
                          : inRange
                          ? "bg-lawo-black/10 text-lawo-black rounded-none"
                          : "text-lawo-gray-dark hover:bg-lawo-white cursor-pointer",
                      ].join(" ")}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-lawo-gray-light">
              {[
                { color: "bg-lawo-black", label: "Dipilih" },
                { color: "bg-red-200", label: "Tidak tersedia" },
                { color: "bg-lawo-white border border-lawo-gray-light", label: "Tersedia" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 font-outfit text-xs text-lawo-gray">
                  <span className={`w-3 h-3 rounded-full ${color}`} />
                  {label}
                </div>
              ))}
            </div>

            {/* Summary + Book Now */}
            {checkin && (
              <div className="mt-4 p-4 bg-lawo-white rounded-[10px]">
                {checkout ? (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-outfit text-sm text-lawo-gray-dark">
                        <span className="font-semibold text-lawo-black">{checkin}</span>
                        {" → "}
                        <span className="font-semibold text-lawo-black">{checkout}</span>
                        <p className="text-lawo-gray mt-0.5">{nights} malam{estimatedPrice && ` · ${formatCurrency(estimatedPrice)}`}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="w-full py-3 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm rounded-[8px] hover:bg-lawo-gray-dark transition-colors"
                    >
                      Book Now
                    </button>
                  </>
                ) : (
                  <p className="font-outfit text-sm text-lawo-gray">
                    Check-in: <span className="font-semibold text-lawo-black">{checkin}</span> — Pilih tarikh check-out
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        unitId={unitId}
        unitName={unit.name}
        checkin={checkin}
        checkout={checkout}
        nights={nights}
        estimatedPrice={estimatedPrice}
      />
    </>
  );
}
