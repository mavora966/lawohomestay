"use client";

import { useState, useEffect, useCallback } from "react";
import { IconChevronLeft, IconChevronRight, IconRefresh } from "@tabler/icons-react";
import { getDayType, formatCurrency } from "@/lib/utils";
import { UNITS } from "@/lib/units";

type Unit = "unit1" | "unit2";

interface BookedRange {
  start: string;
  end: string;
}

const DAYS = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
const MONTHS = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];

function getBookedDates(ranges: BookedRange[]): Set<string> {
  const booked = new Set<string>();
  for (const { start, end } of ranges) {
    const s = new Date(start);
    const e = new Date(end);
    for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
      booked.add(d.toISOString().slice(0, 10));
    }
  }
  return booked;
}

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function BookingCalendar() {
  const [activeUnit, setActiveUnit] = useState<Unit>("unit1");
  const [bookedRanges, setBookedRanges] = useState<Record<Unit, BookedRange[]>>({
    unit1: [],
    unit2: [],
  });
  const [loading, setLoading] = useState(false);
  const [today] = useState(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  });
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [checkin, setCheckin] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const fetchIcal = useCallback(async (unit: Unit) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ical?unit=${unit}`);
      const data = await res.json();
      setBookedRanges((prev) => ({ ...prev, [unit]: data.booked ?? [] }));
    } catch {
      // silently fail — show empty calendar
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIcal(activeUnit);
  }, [activeUnit, fetchIcal]);

  const bookedSet = getBookedDates(bookedRanges[activeUnit]);

  // Build calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isBooked = (d: Date) => bookedSet.has(toDateStr(d));
  const isPast = (d: Date) => d < today;
  const isSelected = (d: Date) => {
    const s = toDateStr(d);
    return s === checkin || s === checkout;
  };
  const isInRange = (d: Date) => {
    const s = toDateStr(d);
    const end = checkout ?? hovered;
    if (!checkin || !end) return false;
    return s > checkin && s < end;
  };

  const handleDayClick = (d: Date) => {
    if (isPast(d) || isBooked(d)) return;
    const s = toDateStr(d);
    if (!checkin || (checkin && checkout)) {
      setCheckin(s);
      setCheckout(null);
    } else {
      if (s <= checkin) {
        setCheckin(s);
        setCheckout(null);
      } else {
        // Check no booked dates in range
        const hasBlocked = Array.from(bookedSet).some(
          (b) => b > checkin && b < s
        );
        if (hasBlocked) {
          setCheckin(s);
          setCheckout(null);
        } else {
          setCheckout(s);
        }
      }
    }
  };

  const nights =
    checkin && checkout
      ? Math.round(
          (new Date(checkout).getTime() - new Date(checkin).getTime()) /
            86400000
        )
      : 0;

  const estimatedPrice = (() => {
    if (!checkin || !checkout || nights < 1) return null;
    const unit = UNITS[activeUnit];
    const dayType = getDayType(new Date(checkin));
    const key = `${dayType}_${nights >= 2 ? "2" : "1"}night` as keyof typeof unit.pricing;
    const base = unit.pricing[key];
    return nights >= 2 ? base : base * nights;
  })();

  const bookingUrl =
    checkin && checkout
      ? `/booking-form?unit=${activeUnit}&checkin=${checkin}&checkout=${checkout}&nights=${nights}`
      : null;

  return (
    <section id="calendar" className="py-16 md:py-24 bg-lawo-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-3">
            Semak Ketersediaan
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-lawo-black">
            Pilih Tarikh Percutian Anda
          </h2>
        </div>

        <div className="bg-lawo-white rounded-[16px] overflow-hidden">
          {/* Unit Toggle */}
          <div className="flex border-b border-lawo-gray-light">
            {(["unit1", "unit2"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => {
                  setActiveUnit(u);
                  setCheckin(null);
                  setCheckout(null);
                }}
                className={[
                  "flex-1 py-3.5 font-outfit text-sm font-medium transition-colors",
                  activeUnit === u
                    ? "bg-lawo-black text-lawo-white"
                    : "text-lawo-gray hover:text-lawo-black hover:bg-lawo-bg",
                ].join(" ")}
              >
                {u === "unit1" ? "Unit 1 — Pengadang Baru" : "Unit 2 — Bukit Besar"}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-8">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-lawo-bg transition-colors"
                aria-label="Bulan sebelumnya"
              >
                <IconChevronLeft size={18} />
              </button>
              <h3 className="font-playfair text-xl font-bold text-lawo-black">
                {MONTHS[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-lawo-bg transition-colors"
                aria-label="Bulan seterusnya"
              >
                <IconChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center font-outfit text-xs text-lawo-gray font-medium py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {loading ? (
              <div className="h-48 flex items-center justify-center text-lawo-gray font-outfit text-sm gap-2">
                <IconRefresh size={16} className="animate-spin" />
                Memuat ketersediaan...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-y-1">
                {cells.map((d, i) => {
                  if (!d) return <div key={`empty-${i}`} />;
                  const s = toDateStr(d);
                  const booked = isBooked(d);
                  const past = isPast(d);
                  const selected = isSelected(d);
                  const inRange = isInRange(d);
                  const disabled = booked || past;

                  return (
                    <button
                      key={s}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => !disabled && setHovered(s)}
                      onMouseLeave={() => setHovered(null)}
                      disabled={disabled}
                      className={[
                        "relative h-9 w-full flex items-center justify-center font-outfit text-sm rounded-full transition-all",
                        disabled
                          ? booked
                            ? "bg-red-50 text-red-300 cursor-not-allowed line-through text-xs"
                            : "text-lawo-gray-light cursor-not-allowed"
                          : selected
                          ? "bg-lawo-black text-lawo-white font-semibold"
                          : inRange
                          ? "bg-lawo-black/10 text-lawo-black rounded-none"
                          : "text-lawo-gray-dark hover:bg-lawo-bg cursor-pointer",
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
              <div className="flex items-center gap-2 font-outfit text-xs text-lawo-gray">
                <span className="w-3 h-3 rounded-full bg-lawo-black" />
                Tarikh dipilih
              </div>
              <div className="flex items-center gap-2 font-outfit text-xs text-lawo-gray">
                <span className="w-3 h-3 rounded-full bg-red-200" />
                Tidak tersedia
              </div>
              <div className="flex items-center gap-2 font-outfit text-xs text-lawo-gray">
                <span className="w-3 h-3 rounded-full bg-lawo-bg border border-lawo-gray-light" />
                Tersedia
              </div>
            </div>

            {/* Booking summary */}
            {checkin && (
              <div className="mt-6 p-4 bg-lawo-bg rounded-[12px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="font-outfit text-sm text-lawo-gray-dark">
                  {checkout ? (
                    <>
                      <span className="font-semibold text-lawo-black">
                        {checkin}
                      </span>{" "}
                      →{" "}
                      <span className="font-semibold text-lawo-black">
                        {checkout}
                      </span>
                      <span className="ml-2 text-lawo-gray">
                        ({nights} malam)
                        {estimatedPrice && (
                          <> · Anggaran {formatCurrency(estimatedPrice)}</>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      Check-in:{" "}
                      <span className="font-semibold text-lawo-black">
                        {checkin}
                      </span>
                      <span className="ml-2 text-lawo-gray">
                        — Pilih tarikh check-out
                      </span>
                    </>
                  )}
                </div>
                {bookingUrl && (
                  <a
                    href={bookingUrl}
                    className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-lawo-black text-lawo-white font-outfit font-medium text-sm rounded-[8px] hover:bg-lawo-gray-dark transition-colors"
                  >
                    Teruskan Booking
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
