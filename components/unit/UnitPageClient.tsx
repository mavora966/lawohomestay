"use client";

import { useState } from "react";
import GalleryCarousel from "./GalleryCarousel";
import FacilitiesGrid from "./FacilitiesGrid";
import PricingCards from "./PricingCards";
import UnitBookingCalendar from "./UnitBookingCalendar";
import UnitLocationSection from "./UnitLocationSection";
import UnitHero from "./UnitHero";
import BookingModal from "./BookingModal";
import { UNITS } from "@/lib/units";
import type { Unit } from "@/types";

interface UnitPageClientProps {
  unitId: Unit;
  unitIndex: number;
}

export default function UnitPageClient({ unitId, unitIndex }: UnitPageClientProps) {
  const unit = UNITS[unitId];
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <UnitHero
        unit={unit}
        unitIndex={unitIndex}
        onBookNow={() => setModalOpen(true)}
      />

      {/* Gallery */}
      <section className="bg-lawo-white pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryCarousel images={unit.images} name={unit.name} />
        </div>
      </section>

      <FacilitiesGrid unitId={unitId} />
      <PricingCards pricing={unit.pricing} />
      <UnitBookingCalendar unitId={unitId} />
      <UnitLocationSection unit={unit} />

      {/* Sticky Book Now (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden p-4 bg-lawo-white border-t border-lawo-gray-light">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3.5 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm rounded-[10px]"
        >
          Book Now
        </button>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        unitId={unitId}
        unitName={unit.name}
        checkin={null}
        checkout={null}
        nights={0}
        estimatedPrice={null}
      />
    </>
  );
}
