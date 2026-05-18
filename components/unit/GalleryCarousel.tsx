"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight, IconMaximize } from "@tabler/icons-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface GalleryCarouselProps {
  images: string[];
  name: string;
}

export default function GalleryCarousel({ images, name }: GalleryCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  return (
    <>
      <div className="relative w-full">
        {/* Main image */}
        <div
          className="relative w-full h-[55vw] max-h-[600px] min-h-[280px] cursor-zoom-in overflow-hidden"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[current]}
            alt={`${name} — gambar ${current + 1}`}
            fill
            priority={current === 0}
            className="object-cover transition-opacity duration-300"
            sizes="100vw"
          />
          {/* Expand hint */}
          <div className="absolute top-4 right-4 bg-lawo-black/50 text-lawo-white p-1.5 rounded-lg backdrop-blur-sm">
            <IconMaximize size={18} />
          </div>
          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-lawo-black/60 text-lawo-white font-outfit text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>
          {/* Prev / Next */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-lawo-black/50 text-lawo-white hover:bg-lawo-black/70 transition-colors backdrop-blur-sm"
            aria-label="Sebelumnya"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-lawo-black/50 text-lawo-white hover:bg-lawo-black/70 transition-colors backdrop-blur-sm"
            aria-label="Seterusnya"
          >
            <IconChevronRight size={20} />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 px-0 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setCurrent(i)}
              className={[
                "relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-[8px] overflow-hidden border-2 transition-all",
                i === current
                  ? "border-lawo-black opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80",
              ].join(" ")}
              aria-label={`Gambar ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={current}
          onClose={() => setLightboxOpen(false)}
          onPrev={prev}
          onNext={next}
          alt={name}
        />
      )}
    </>
  );
}
