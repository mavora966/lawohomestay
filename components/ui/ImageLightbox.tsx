"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  alt?: string;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  alt = "Gambar",
}: ImageLightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-lawo-black/95">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-lawo-white/10 hover:bg-lawo-white/20 text-lawo-white transition-colors"
        aria-label="Tutup"
      >
        <IconX size={22} />
      </button>

      {/* Counter */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 font-outfit text-xs text-lawo-white/50">
        {currentIndex + 1} / {images.length}
      </p>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 p-2.5 rounded-full bg-lawo-white/10 hover:bg-lawo-white/20 text-lawo-white transition-colors"
          aria-label="Sebelumnya"
        >
          <IconChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-16">
        <Image
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 80vw"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 p-2.5 rounded-full bg-lawo-white/10 hover:bg-lawo-white/20 text-lawo-white transition-colors"
          aria-label="Seterusnya"
        >
          <IconChevronRight size={24} />
        </button>
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-1 px-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => {
              const diff = i - currentIndex;
              if (diff > 0) for (let j = 0; j < diff; j++) onNext();
              else if (diff < 0) for (let j = 0; j < -diff; j++) onPrev();
            }}
            className={[
              "relative shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all",
              i === currentIndex
                ? "border-lawo-white opacity-100"
                : "border-transparent opacity-40 hover:opacity-70",
            ].join(" ")}
            aria-label={`Gambar ${i + 1}`}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="48px" />
          </button>
        ))}
      </div>
    </div>
  );
}
