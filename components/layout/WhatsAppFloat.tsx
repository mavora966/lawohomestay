"use client";

import { useState, useEffect } from "react";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "601115141215";
  const message = encodeURIComponent(
    "Salam, saya ingin bertanya tentang ketersediaan The Lawo Homestay."
  );

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami di WhatsApp"
      className={[
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      {/* Tooltip */}
      <span className="hidden sm:block bg-lawo-black text-lawo-white text-xs font-outfit font-medium px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat dengan kami
      </span>

      {/* Button */}
      <div className="group relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7 relative"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.537 4.067 1.481 5.782L0 24l6.395-1.673A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.683-.513-5.217-1.409l-.374-.222-3.878 1.014 1.036-3.783-.244-.39A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </div>
    </a>
  );
}
