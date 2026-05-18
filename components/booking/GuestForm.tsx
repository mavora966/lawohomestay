"use client";

import { ChangeEvent } from "react";
import { formatPhone } from "@/lib/utils";

interface FormData {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
}

interface FormErrors {
  guestName?: string;
  guestPhone?: string;
}

interface GuestFormProps {
  data: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string) => void;
}

export default function GuestForm({ data, errors, onChange }: GuestFormProps) {
  const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange("guestPhone", raw);
  };

  const handlePhoneBlur = () => {
    if (data.guestPhone) {
      onChange("guestPhone", formatPhone(data.guestPhone));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <label
          htmlFor="guestName"
          className="block font-outfit text-sm font-medium text-lawo-black mb-1.5"
        >
          Nama Penuh <span className="text-red-500">*</span>
        </label>
        <input
          id="guestName"
          type="text"
          value={data.guestName}
          onChange={(e) => onChange("guestName", e.target.value)}
          placeholder="cth: Ahmad bin Abdullah"
          className={[
            "w-full px-4 py-3 border rounded-[10px] font-outfit text-sm text-lawo-black placeholder:text-lawo-gray bg-lawo-white focus:outline-none transition-colors",
            errors.guestName
              ? "border-red-400 focus:border-red-500"
              : "border-lawo-gray-light focus:border-lawo-black",
          ].join(" ")}
        />
        {errors.guestName && (
          <p className="mt-1.5 font-outfit text-xs text-red-500">
            {errors.guestName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="guestPhone"
          className="block font-outfit text-sm font-medium text-lawo-black mb-1.5"
        >
          No. Telefon <span className="text-red-500">*</span>
        </label>
        <input
          id="guestPhone"
          type="tel"
          value={data.guestPhone}
          onChange={handlePhone}
          onBlur={handlePhoneBlur}
          placeholder="cth: 0123456789"
          className={[
            "w-full px-4 py-3 border rounded-[10px] font-outfit text-sm text-lawo-black placeholder:text-lawo-gray bg-lawo-white focus:outline-none transition-colors",
            errors.guestPhone
              ? "border-red-400 focus:border-red-500"
              : "border-lawo-gray-light focus:border-lawo-black",
          ].join(" ")}
        />
        {errors.guestPhone ? (
          <p className="mt-1.5 font-outfit text-xs text-red-500">
            {errors.guestPhone}
          </p>
        ) : (
          <p className="mt-1.5 font-outfit text-xs text-lawo-gray">
            Format: +60xxxxxxxxx (auto-convert)
          </p>
        )}
      </div>

      {/* Email (optional) */}
      <div>
        <label
          htmlFor="guestEmail"
          className="block font-outfit text-sm font-medium text-lawo-black mb-1.5"
        >
          Emel{" "}
          <span className="font-normal text-lawo-gray">(pilihan)</span>
        </label>
        <input
          id="guestEmail"
          type="email"
          value={data.guestEmail}
          onChange={(e) => onChange("guestEmail", e.target.value)}
          placeholder="cth: ahmad@email.com"
          className="w-full px-4 py-3 border border-lawo-gray-light rounded-[10px] font-outfit text-sm text-lawo-black placeholder:text-lawo-gray bg-lawo-white focus:outline-none focus:border-lawo-black transition-colors"
        />
      </div>
    </div>
  );
}
