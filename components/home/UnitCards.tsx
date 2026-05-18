"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconBed,
  IconUsers,
  IconPool,
  IconArrowRight,
  IconCalendar,
} from "@tabler/icons-react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { UNITS } from "@/lib/units";
import { formatCurrency } from "@/lib/utils";

const GRID_PREVIEW = 5; // images shown in grid before "+N more"

export default function UnitCards() {
  const [lightbox, setLightbox] = useState<{
    unit: string;
    index: number;
  } | null>(null);

  const units = [UNITS.unit1, UNITS.unit2];

  const openLightbox = (unitId: string, index: number) => {
    setLightbox({ unit: unitId, index });
  };
  const closeLightbox = () => setLightbox(null);
  const prevImage = () =>
    setLightbox((prev) => {
      if (!prev) return null;
      const imgs = UNITS[prev.unit].images;
      return { ...prev, index: (prev.index - 1 + imgs.length) % imgs.length };
    });
  const nextImage = () =>
    setLightbox((prev) => {
      if (!prev) return null;
      const imgs = UNITS[prev.unit].images;
      return { ...prev, index: (prev.index + 1) % imgs.length };
    });

  return (
    <section id="units" className="py-16 md:py-24 bg-lawo-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-16">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-3">
            Pilihan Unit
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-lawo-black">
            Dua Unit, Satu Standard Mewah
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {units.map((unit, unitIdx) => (
            <div
              key={unit.id}
              className={[
                "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center",
                unitIdx % 2 === 1 ? "lg:[direction:rtl]" : "",
              ].join(" ")}
            >
              {/* Image Grid */}
              <div
                className="[direction:ltr] grid grid-cols-3 grid-rows-2 gap-2 h-[320px] sm:h-[400px] cursor-pointer"
                onClick={() => openLightbox(unit.id, 0)}
              >
                {/* Main image */}
                <div className="col-span-2 row-span-2 relative rounded-[14px] overflow-hidden group">
                  <Image
                    src={unit.images[0]}
                    alt={`${unit.name} — gambar utama`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 66vw, 33vw"
                  />
                </div>
                {/* Side images */}
                {unit.images.slice(1, GRID_PREVIEW - 1).map((src, i) => (
                  <div
                    key={src}
                    className="relative rounded-[10px] overflow-hidden group"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(unit.id, i + 1);
                    }}
                  >
                    <Image
                      src={src}
                      alt={`${unit.name} ${i + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                ))}
                {/* +N more overlay */}
                <div
                  className="relative rounded-[10px] overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(unit.id, GRID_PREVIEW - 1);
                  }}
                >
                  <Image
                    src={unit.images[GRID_PREVIEW - 1]}
                    alt="Lihat semua gambar"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-lawo-black/60 flex items-center justify-center group-hover:bg-lawo-black/70 transition-colors">
                    <p className="font-outfit text-sm font-semibold text-lawo-white text-center leading-tight">
                      +{unit.images.length - (GRID_PREVIEW - 1)}
                      <br />
                      <span className="text-xs font-normal opacity-80">
                        gambar
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="[direction:ltr] flex flex-col">
                <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-3">
                  Unit {unitIdx + 1}
                </p>
                <h3 className="font-playfair text-3xl md:text-4xl font-bold text-lawo-black mb-4">
                  {unit.name}
                </h3>
                <p className="font-outfit text-sm text-lawo-gray mb-6 leading-relaxed">
                  {unit.address}
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm font-outfit text-lawo-gray-dark">
                    <IconBed size={16} />
                    <span>{unit.bedrooms} Bilik Tidur</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-outfit text-lawo-gray-dark">
                    <IconUsers size={16} />
                    <span>Max {unit.maxPax} Orang</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-outfit text-lawo-gray-dark">
                    <IconPool size={16} />
                    <span>Kolam Renang Peribadi</span>
                  </div>
                </div>

                {/* Pricing preview */}
                <div className="bg-lawo-bg rounded-[12px] p-4 mb-8">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      {
                        label: "Weekday",
                        price: unit.pricing.weekday_1night,
                      },
                      {
                        label: "Weekend",
                        price: unit.pricing.weekend_1night,
                      },
                      {
                        label: "Cuti Umum",
                        price: unit.pricing.holiday_1night,
                      },
                    ].map(({ label, price }) => (
                      <div key={label}>
                        <p className="font-outfit text-xs text-lawo-gray mb-1">
                          {label}
                        </p>
                        <p className="font-playfair text-lg font-bold text-lawo-black">
                          {formatCurrency(price)}
                        </p>
                        <p className="font-outfit text-[10px] text-lawo-gray">
                          / malam
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/${unit.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-lawo-black text-lawo-white font-outfit font-medium text-sm px-5 py-3 rounded-[8px] hover:bg-lawo-gray-dark transition-colors"
                  >
                    Lihat Detail
                    <IconArrowRight size={16} />
                  </Link>
                  <a
                    href="#calendar"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("calendar")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-lawo-bg text-lawo-black font-outfit font-medium text-sm px-5 py-3 rounded-[8px] border border-lawo-gray-light hover:border-lawo-black transition-colors"
                  >
                    <IconCalendar size={16} />
                    Semak Tarikh
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <ImageLightbox
          images={UNITS[lightbox.unit].images}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          alt={UNITS[lightbox.unit].name}
        />
      )}
    </section>
  );
}
