"use client";

import { IconBed, IconUsers, IconMapPin } from "@tabler/icons-react";
import type { UnitData } from "@/types";

interface UnitHeroProps {
  unit: UnitData;
  unitIndex: number;
  onBookNow: () => void;
}

export default function UnitHero({ unit, unitIndex, onBookNow }: UnitHeroProps) {
  const scrollToCalendar = () =>
    document.getElementById("calendar")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="pt-16 md:pt-20 bg-lawo-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-2">
              Unit {unitIndex}
            </p>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-lawo-black mb-3">
              {unit.name}
            </h1>
            <p className="font-outfit text-sm text-lawo-gray mb-4">{unit.tagline}</p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 font-outfit text-sm text-lawo-gray-dark">
                <IconBed size={15} />
                <span>{unit.bedrooms} Bilik Tidur</span>
              </div>
              <div className="flex items-center gap-1.5 font-outfit text-sm text-lawo-gray-dark">
                <IconUsers size={15} />
                <span>Max {unit.maxPax} Orang</span>
              </div>
              <div className="flex items-center gap-1.5 font-outfit text-sm text-lawo-gray-dark">
                <IconMapPin size={15} />
                <span>Kuala Terengganu</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={scrollToCalendar}
              className="px-6 py-3 border border-lawo-black text-lawo-black font-outfit font-medium text-sm rounded-[8px] hover:bg-lawo-bg transition-colors"
            >
              Semak Tarikh
            </button>
            <button
              onClick={onBookNow}
              className="px-6 py-3 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm rounded-[8px] hover:bg-lawo-gray-dark transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
