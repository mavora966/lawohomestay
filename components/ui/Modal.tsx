"use client";

import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  slideUp?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  slideUp = false,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-lawo-black/60 backdrop-blur-sm" />
      <div
        className={[
          "relative bg-lawo-white w-full md:max-w-lg rounded-t-[20px] md:rounded-[16px] z-10",
          slideUp ? "animate-slide-up" : "animate-fade-in",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-6 border-b border-lawo-gray-light">
          {title && (
            <h3 className="font-playfair text-xl text-lawo-black">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-full hover:bg-lawo-gray-light transition-colors"
            aria-label="Tutup"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
