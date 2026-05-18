"use client";

import { useState } from "react";

const POPULAR_BANKS = [
  { code: "MB2U0227", name: "Maybank", short: "Maybank2u" },
  { code: "CIMB0218", name: "CIMB Bank", short: "CIMB Clicks" },
  { code: "PBB0233", name: "Public Bank", short: "PBe" },
  { code: "RHB0218", name: "RHB Bank", short: "RHB" },
  { code: "HLB0224", name: "Hong Leong", short: "HLB Connect" },
  { code: "BIMB0340", name: "Bank Islam", short: "Bank Islam" },
];

const OTHER_BANKS = [
  { code: "BCBB0235", name: "OCBC Bank" },
  { code: "ABB0233", name: "Affin Bank" },
  { code: "AMBB0209", name: "AmBank" },
  { code: "BKRM0602", name: "Bank Rakyat" },
  { code: "BMMB0341", name: "Bank Muamalat" },
  { code: "BSN0601", name: "BSN" },
  { code: "CIT0219", name: "Citibank" },
  { code: "HSBC0223", name: "HSBC Bank" },
  { code: "KFH0346", name: "Kuwait Finance House" },
  { code: "MBB0228", name: "Maybank (Business)" },
  { code: "SCB0216", name: "Standard Chartered" },
  { code: "UOB0226", name: "UOB Bank" },
];

interface BankSelectorProps {
  value: string;
  onChange: (code: string) => void;
  error?: string;
}

export default function BankSelector({ value, onChange, error }: BankSelectorProps) {
  const [showOthers, setShowOthers] = useState(false);
  const isOther = value && !POPULAR_BANKS.find((b) => b.code === value);

  return (
    <div>
      <label className="block font-outfit text-sm font-medium text-lawo-black mb-3">
        Pilih Bank <span className="text-red-500">*</span>
      </label>

      {/* Popular banks grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {POPULAR_BANKS.map((bank) => (
          <button
            key={bank.code}
            type="button"
            onClick={() => onChange(bank.code)}
            className={[
              "p-3 rounded-[10px] border-2 text-left transition-all",
              value === bank.code
                ? "border-lawo-black bg-lawo-black text-lawo-white"
                : "border-lawo-gray-light bg-lawo-white hover:border-lawo-black",
            ].join(" ")}
          >
            <p
              className={[
                "font-outfit text-xs font-semibold",
                value === bank.code ? "text-lawo-white" : "text-lawo-black",
              ].join(" ")}
            >
              {bank.name}
            </p>
            <p
              className={[
                "font-outfit text-[11px] mt-0.5",
                value === bank.code ? "text-lawo-white/60" : "text-lawo-gray",
              ].join(" ")}
            >
              {bank.short}
            </p>
          </button>
        ))}
      </div>

      {/* Other banks dropdown */}
      <button
        type="button"
        onClick={() => setShowOthers((v) => !v)}
        className="text-sm font-outfit text-lawo-gray underline underline-offset-2 mb-2"
      >
        {showOthers ? "Sembunyikan" : "Bank lain-lain ▾"}
      </button>

      {showOthers && (
        <select
          value={isOther ? value : ""}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="w-full px-4 py-3 border border-lawo-gray-light rounded-[10px] font-outfit text-sm text-lawo-black bg-lawo-white focus:outline-none focus:border-lawo-black"
        >
          <option value="">-- Pilih bank --</option>
          {OTHER_BANKS.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      )}

      {error && (
        <p className="mt-1.5 font-outfit text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
