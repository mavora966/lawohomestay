"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  IconCircleCheck,
  IconCircleX,
  IconBrandWhatsapp,
  IconHome,
} from "@tabler/icons-react";

const SUCCESS_STEPS = [
  {
    num: 1,
    title: "Semak WhatsApp anda",
    desc: "Admin kami akan menghubungi anda dalam masa 1 jam untuk mengesahkan tempahan.",
  },
  {
    num: 2,
    title: "Terima konfirmasi",
    desc: "Anda akan menerima kod tempahan dan maklumat lengkap unit.",
  },
  {
    num: 3,
    title: "Bayar baki sebelum check-in",
    desc: "Baki jumlah perlu dijelaskan sebelum atau semasa check-in.",
  },
];

function ThankYouContent() {
  const searchParams = useSearchParams();
  const paid = searchParams.get("billplz[paid]") === "true";
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "601115141215";
  const waMessage = encodeURIComponent(
    "Salam, saya telah berjaya membayar deposit tempahan The Lawo Homestay. Boleh saya dapatkan pengesahan?"
  );

  // dataLayer push purchase event
  if (typeof window !== "undefined" && paid) {
    const dl = (window as unknown as Record<string, unknown>).dataLayer;
    if (Array.isArray(dl)) {
      dl.push({ event: "purchase", value: 300, currency: "MYR" });
    }
  }

  if (paid) {
    return (
      <div className="text-center max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <IconCircleCheck size={48} className="text-green-600" />
          </div>
        </div>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-lawo-black mb-3">
          Pembayaran Berjaya!
        </h1>
        <p className="font-outfit text-base text-lawo-gray mb-10 leading-relaxed">
          Terima kasih! Deposit RM300 anda telah diterima. Tempahan sedang
          diproses.
        </p>

        <div className="bg-lawo-white rounded-[14px] p-6 mb-8 text-left">
          <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-lawo-gray mb-4">
            Langkah Seterusnya
          </p>
          <div className="flex flex-col gap-5">
            {SUCCESS_STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-lawo-black text-lawo-white flex items-center justify-center font-outfit text-xs font-bold shrink-0 mt-0.5">
                  {num}
                </div>
                <div>
                  <p className="font-outfit text-sm font-semibold text-lawo-black mb-0.5">
                    {title}
                  </p>
                  <p className="font-outfit text-sm text-lawo-gray leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-lawo-white font-outfit font-semibold text-sm py-3.5 rounded-[10px] hover:opacity-90 transition-opacity"
          >
            <IconBrandWhatsapp size={18} />
            Hubungi Admin
          </a>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-lawo-white border border-lawo-black text-lawo-black font-outfit font-medium text-sm py-3.5 rounded-[10px] hover:bg-lawo-bg transition-colors"
          >
            <IconHome size={16} />
            Ke Laman Utama
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <IconCircleX size={48} className="text-red-500" />
        </div>
      </div>
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-lawo-black mb-3">
        Pembayaran Tidak Berjaya
      </h1>
      <p className="font-outfit text-base text-lawo-gray mb-8 leading-relaxed">
        Pembayaran anda tidak dapat diproses. Sila cuba semula atau hubungi
        kami melalui WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-lawo-white font-outfit font-semibold text-sm py-3.5 rounded-[10px] hover:opacity-90 transition-opacity"
        >
          <IconBrandWhatsapp size={18} />
          Hubungi Admin
        </a>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-lawo-white border border-lawo-black text-lawo-black font-outfit font-medium text-sm py-3.5 rounded-[10px] hover:bg-lawo-bg transition-colors"
        >
          <IconHome size={16} />
          Cuba Semula
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-lawo-bg flex items-center justify-center px-4 py-24">
      <Suspense
        fallback={
          <div className="font-outfit text-lawo-gray">Memuatkan...</div>
        }
      >
        <ThankYouContent />
      </Suspense>
    </main>
  );
}
