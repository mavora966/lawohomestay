"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IconAlertTriangle, IconHome } from "@tabler/icons-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-lawo-bg flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <IconAlertTriangle size={40} className="text-red-500" />
          </div>
        </div>
        <h1 className="font-playfair text-3xl font-bold text-lawo-black mb-3">
          Ralat Berlaku
        </h1>
        <p className="font-outfit text-base text-lawo-gray mb-8 leading-relaxed">
          Maaf, sesuatu yang tidak dijangka berlaku. Sila cuba semula atau
          hubungi kami jika masalah berterusan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex-1 py-3.5 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm rounded-[10px] hover:bg-lawo-gray-dark transition-colors"
          >
            Cuba Semula
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-lawo-white border border-lawo-black text-lawo-black font-outfit font-medium text-sm py-3.5 rounded-[10px] hover:bg-lawo-bg transition-colors"
          >
            <IconHome size={16} />
            Ke Laman Utama
          </Link>
        </div>
      </div>
    </main>
  );
}
