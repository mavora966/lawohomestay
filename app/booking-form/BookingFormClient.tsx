"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconLoader } from "@tabler/icons-react";
import GuestForm from "@/components/booking/GuestForm";
import BankSelector from "@/components/booking/BankSelector";
import BookingSummary from "@/components/booking/BookingSummary";
import { formatPhone, getDayType } from "@/lib/utils";
import { fbq, pushDataLayer } from "@/lib/tracking";
import { UNITS } from "@/lib/units";
import type { Unit } from "@/types";

interface Props {
  unit: Unit;
  checkin: string;
  checkout: string;
  nights: number;
}

export default function BookingFormClient({ unit, checkin, checkout, nights }: Props) {
  const router = useRouter();
  const unitData = UNITS[unit];

  const dayType = getDayType(new Date(checkin));
  const priceKey = `${dayType}_${nights >= 2 ? "2" : "1"}night` as keyof typeof unitData.pricing;
  const amount = nights >= 2
    ? unitData.pricing[priceKey]
    : unitData.pricing[priceKey] * nights;

  const [form, setForm] = useState({ guestName: "", guestPhone: "", guestEmail: "" });
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState<{ guestName?: string; guestPhone?: string; bank?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.guestName.trim()) newErrors.guestName = "Nama diperlukan.";
    if (!form.guestPhone.trim()) newErrors.guestPhone = "No. telefon diperlukan.";
    else if (!/^(\+?6?0\d{8,10})$/.test(form.guestPhone.replace(/\s/g, "")))
      newErrors.guestPhone = "Format no. telefon tidak sah.";
    if (!bank) newErrors.bank = "Sila pilih bank.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");

    try {
      const phone = formatPhone(form.guestPhone);
      const res = await fetch("/api/create-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit,
          checkin,
          checkout,
          nights,
          guestName: form.guestName.trim(),
          guestPhone: phone,
          guestEmail: form.guestEmail.trim(),
          bank,
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        setServerError(data.error ?? "Ralat. Sila cuba semula.");
        setLoading(false);
        return;
      }

      fbq("AddPaymentInfo", { value: 300, currency: "MYR" });
      pushDataLayer({ event: "add_payment_info", value: 300, currency: "MYR" });

      // Redirect to Billplz
      window.location.href = data.url;
    } catch {
      setServerError("Ralat sambungan. Sila cuba semula.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lawo-bg pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-2">
            Tempahan
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-lawo-black">
            Maklumat Tetamu
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-8">
            {/* Guest details */}
            <div className="bg-lawo-white rounded-[14px] p-6">
              <h2 className="font-playfair text-xl font-bold text-lawo-black mb-5">
                Maklumat Peribadi
              </h2>
              <GuestForm data={form} errors={errors} onChange={handleChange} />
            </div>

            {/* Bank selection */}
            <div className="bg-lawo-white rounded-[14px] p-6">
              <h2 className="font-playfair text-xl font-bold text-lawo-black mb-5">
                Kaedah Pembayaran
              </h2>
              <BankSelector
                value={bank}
                onChange={(code) => { setBank(code); setErrors((p) => ({ ...p, bank: undefined })); }}
                error={errors.bank}
              />
            </div>

            {/* Server error */}
            {serverError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-[10px]">
                <IconAlertCircle size={18} className="text-red-500 shrink-0" />
                <p className="font-outfit text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-lawo-black text-lawo-white font-outfit font-semibold text-base rounded-[10px] hover:bg-lawo-gray-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IconLoader size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                "Bayar Deposit RM300"
              )}
            </button>

            <p className="font-outfit text-xs text-lawo-gray text-center -mt-4">
              Anda akan diarahkan ke halaman pembayaran Billplz yang selamat.
            </p>
          </form>

          {/* Summary */}
          <div>
            <BookingSummary
              unit={unit}
              checkin={checkin}
              checkout={checkout}
              nights={nights}
              amount={amount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
