"use client";

import { IconCalendar, IconMoon, IconUsers, IconCash } from "@tabler/icons-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UNITS, DEPOSIT } from "@/lib/units";
import type { Unit } from "@/types";

interface BookingSummaryProps {
  unit: Unit;
  checkin: string;
  checkout: string;
  nights: number;
  amount: number;
}

export default function BookingSummary({
  unit,
  checkin,
  checkout,
  nights,
  amount,
}: BookingSummaryProps) {
  const unitData = UNITS[unit];

  return (
    <div className="bg-lawo-white rounded-[14px] p-6 sticky top-24">
      <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-1">
        Unit {unit === "unit1" ? "1" : "2"}
      </p>
      <h3 className="font-playfair text-xl font-bold text-lawo-black mb-5">
        {unitData.name}
      </h3>

      <div className="flex flex-col gap-3 mb-5 pb-5 border-b border-lawo-gray-light">
        <div className="flex items-center gap-3">
          <IconCalendar size={15} className="text-lawo-gray shrink-0" />
          <div className="font-outfit text-sm text-lawo-gray-dark">
            <span className="font-medium">{formatDate(checkin)}</span>
            <span className="text-lawo-gray mx-2">→</span>
            <span className="font-medium">{formatDate(checkout)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconMoon size={15} className="text-lawo-gray shrink-0" />
          <span className="font-outfit text-sm text-lawo-gray-dark">
            {nights} malam
          </span>
        </div>
        <div className="flex items-center gap-3">
          <IconUsers size={15} className="text-lawo-gray shrink-0" />
          <span className="font-outfit text-sm text-lawo-gray-dark">
            Max {unitData.maxPax} orang
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mb-5 pb-5 border-b border-lawo-gray-light">
        <div className="flex justify-between font-outfit text-sm">
          <span className="text-lawo-gray">Anggaran jumlah</span>
          <span className="font-medium text-lawo-black">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between font-outfit text-sm">
          <span className="text-lawo-gray">Baki selepas deposit</span>
          <span className="font-medium text-lawo-black">
            {formatCurrency(Math.max(0, amount - DEPOSIT))}
          </span>
        </div>
      </div>

      <div className="bg-lawo-bg rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IconCash size={15} className="text-lawo-black" />
            <span className="font-outfit text-sm font-semibold text-lawo-black">
              Deposit sekarang
            </span>
          </div>
          <span className="font-playfair text-xl font-bold text-lawo-black">
            {formatCurrency(DEPOSIT)}
          </span>
        </div>
        <p className="font-outfit text-xs text-lawo-gray leading-relaxed">
          Bayar deposit untuk mengesahkan tempahan. Baki dibayar sebelum check-in.
        </p>
      </div>
    </div>
  );
}
