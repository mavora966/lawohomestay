import { IconCheck } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils";
import { DEPOSIT } from "@/lib/units";
import type { PricingRow } from "@/types";

interface PricingCardsProps {
  pricing: PricingRow;
}

const PRICE_TYPES = [
  {
    key: "weekday" as const,
    label: "Weekday",
    sublabel: "Isnin — Rabu",
    dark: false,
  },
  {
    key: "weekend" as const,
    label: "Weekend",
    sublabel: "Khamis — Ahad",
    dark: true,
  },
  {
    key: "holiday" as const,
    label: "Cuti Umum",
    sublabel: "Public Holiday",
    dark: false,
  },
];

const perks = [
  "Deposit RM300 sahaja untuk confirm",
  "Check-in 3PTG / Check-out 12TGH",
  "Kolam renang peribadi inklusif",
  "WiFi, Netflix & kemudahan lengkap",
];

export default function PricingCards({ pricing }: PricingCardsProps) {
  return (
    <section className="py-12 md:py-16 bg-lawo-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-lawo-black mb-2">
            Harga Penginapan
          </h2>
          <p className="font-outfit text-sm text-lawo-gray">
            Deposit RM{DEPOSIT} untuk mengesahkan tempahan anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PRICE_TYPES.map(({ key, label, sublabel, dark }) => (
            <div
              key={key}
              className={[
                "rounded-[14px] p-6",
                dark ? "bg-lawo-black text-lawo-white" : "bg-lawo-white",
              ].join(" ")}
            >
              <p
                className={[
                  "font-outfit text-xs font-semibold uppercase tracking-widest mb-1",
                  dark ? "text-lawo-white/50" : "text-lawo-gray",
                ].join(" ")}
              >
                {label}
              </p>
              <p
                className={[
                  "font-outfit text-xs mb-4",
                  dark ? "text-lawo-white/40" : "text-lawo-gray",
                ].join(" ")}
              >
                {sublabel}
              </p>

              <div className="mb-4">
                <p
                  className={[
                    "font-outfit text-xs mb-1",
                    dark ? "text-lawo-white/50" : "text-lawo-gray",
                  ].join(" ")}
                >
                  1 Malam
                </p>
                <p
                  className={[
                    "font-playfair text-3xl font-bold",
                    dark ? "text-lawo-white" : "text-lawo-black",
                  ].join(" ")}
                >
                  {formatCurrency(pricing[`${key}_1night`])}
                </p>
              </div>

              <div className={["pt-4 border-t", dark ? "border-lawo-white/10" : "border-lawo-gray-light"].join(" ")}>
                <p
                  className={[
                    "font-outfit text-xs mb-1",
                    dark ? "text-lawo-white/50" : "text-lawo-gray",
                  ].join(" ")}
                >
                  2 Malam
                </p>
                <p
                  className={[
                    "font-playfair text-2xl font-bold",
                    dark ? "text-lawo-white" : "text-lawo-black",
                  ].join(" ")}
                >
                  {formatCurrency(pricing[`${key}_2night`])}
                </p>
                <p
                  className={[
                    "font-outfit text-xs mt-1",
                    dark ? "text-lawo-white/40" : "text-lawo-gray",
                  ].join(" ")}
                >
                  Jimat berbanding 2× 1 malam
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Perks */}
        <div className="bg-lawo-white rounded-[12px] p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2.5">
              <IconCheck size={15} className="text-lawo-black shrink-0" />
              <span className="font-outfit text-sm text-lawo-gray-dark">{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
