"use client";

import { useRouter } from "next/navigation";
import { IconX, IconCalendar, IconCash, IconBrandWhatsapp, IconArrowRight } from "@tabler/icons-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEPOSIT } from "@/lib/units";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  unitName: string;
  checkin: string | null;
  checkout: string | null;
  nights: number;
  estimatedPrice: number | null;
}

const STEPS = [
  { num: 1, label: "Bayar deposit RM300 via FPX/eWallet" },
  { num: 2, label: "Admin sahkan tempahan anda" },
  { num: 3, label: "Bayar baki sebelum check-in" },
];

export default function BookingModal({
  isOpen,
  onClose,
  unitId,
  unitName,
  checkin,
  checkout,
  nights,
  estimatedPrice,
}: BookingModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const bookingUrl = checkin && checkout
    ? `/booking-form?unit=${unitId}&checkin=${checkin}&checkout=${checkout}&nights=${nights}`
    : null;

  const waMessage = encodeURIComponent(
    `Salam, saya ingin membuat tempahan ${unitName}.\n\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nMalam: ${nights}\n\nSila bantu saya untuk mengesahkan ketersediaan.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-lawo-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-lawo-white rounded-t-[20px] z-10 animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-lawo-gray-light rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lawo-gray-light">
          <h3 className="font-playfair text-xl font-bold text-lawo-black">
            Confirm Tempahan
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-lawo-bg transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Booking summary */}
          <div className="bg-lawo-bg rounded-[12px] p-4 mb-5">
            <p className="font-outfit text-xs text-lawo-gray mb-3 uppercase tracking-widest font-semibold">
              {unitName}
            </p>
            <div className="flex items-center gap-3 mb-2">
              <IconCalendar size={15} className="text-lawo-gray shrink-0" />
              <span className="font-outfit text-sm text-lawo-gray-dark">
                {checkin && formatDate(checkin)} → {checkout && formatDate(checkout)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <IconCash size={15} className="text-lawo-gray shrink-0" />
              <span className="font-outfit text-sm text-lawo-gray-dark">
                {nights} malam
                {estimatedPrice && (
                  <> · Anggaran <span className="font-semibold text-lawo-black">{formatCurrency(estimatedPrice)}</span></>
                )}
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <p className="font-outfit text-xs text-lawo-gray font-semibold uppercase tracking-widest mb-3">
              Proses Booking
            </p>
            <div className="flex flex-col gap-2.5">
              {STEPS.map(({ num, label }) => (
                <div key={num} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-lawo-black text-lawo-white flex items-center justify-center font-outfit text-xs font-bold shrink-0">
                    {num}
                  </div>
                  <span className="font-outfit text-sm text-lawo-gray-dark">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit notice */}
          <div className="bg-lawo-black/5 rounded-[10px] px-4 py-3 mb-5">
            <p className="font-outfit text-xs text-lawo-gray-dark">
              Deposit <span className="font-semibold text-lawo-black">{formatCurrency(DEPOSIT)}</span> diperlukan untuk mengesahkan tempahan. Baki dibayar sebelum check-in.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3">
            {bookingUrl && (
              <button
                onClick={() => { onClose(); router.push(bookingUrl); }}
                className="w-full flex items-center justify-center gap-2 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm py-3.5 rounded-[10px] hover:bg-lawo-gray-dark transition-colors"
              >
                Teruskan Booking
                <IconArrowRight size={16} />
              </button>
            )}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-lawo-white font-outfit font-semibold text-sm py-3.5 rounded-[10px] hover:opacity-90 transition-opacity"
            >
              <IconBrandWhatsapp size={18} />
              Teruskan di WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
