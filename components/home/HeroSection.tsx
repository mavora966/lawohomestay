"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconChevronDown } from "@tabler/icons-react";

export default function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToUnits = () => {
    document.getElementById("units")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-end pb-16 md:pb-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/unit1/pool-unit1-1.jpg"
          alt="The Lawo Homestay — kolam renang peribadi"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lawo-black/80 via-lawo-black/30 to-lawo-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-white/60 mb-4">
            Kuala Terengganu, Terengganu
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-lawo-white leading-[1.05] mb-6">
            The Lawo
            <br />
            Homestay
          </h1>
          <p className="font-outfit text-base md:text-lg text-lawo-white/75 leading-relaxed mb-10 max-w-lg">
            Dua unit eksklusif dengan kolam renang peribadi. Sempurna untuk
            percutian keluarga dan kumpulan besar di Kuala Terengganu.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={scrollToUnits}
              className="inline-flex items-center justify-center gap-2 bg-lawo-white text-lawo-black font-outfit font-semibold text-sm px-7 py-3.5 rounded-[8px] hover:bg-lawo-bg transition-colors"
            >
              Lihat Unit Kami
            </button>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-lawo-white/40 text-lawo-white font-outfit font-medium text-sm px-7 py-3.5 rounded-[8px] hover:bg-lawo-white/10 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-14 flex flex-wrap gap-6 md:gap-12">
          {[
            { val: "2", label: "Unit Eksklusif" },
            { val: "25", label: "Max Kapasiti" },
            { val: "2", label: "Kolam Renang" },
            { val: "9", label: "Bilik Tidur" },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="font-playfair text-3xl font-bold text-lawo-white">
                {val}
              </p>
              <p className="font-outfit text-xs text-lawo-white/50 mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToUnits}
        aria-label="Scroll ke bawah"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-lawo-white/50 hover:text-lawo-white transition-colors animate-bounce"
      >
        <IconChevronDown size={28} />
      </button>
    </section>
  );
}
