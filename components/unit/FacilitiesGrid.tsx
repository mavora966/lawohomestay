import {
  IconPool,
  IconWifi,
  IconCar,
  IconAirConditioning,
  IconToolsKitchen2,
  IconBrandNetflix,
  IconGrill,
  IconShieldLock,
  IconWashMachine,
  IconSofa,
  IconBed,
  IconUsers,
} from "@tabler/icons-react";

const FACILITIES_UNIT1 = [
  { icon: IconPool, label: "Kolam Renang Peribadi" },
  { icon: IconWifi, label: "WiFi Laju" },
  { icon: IconBrandNetflix, label: "Netflix" },
  { icon: IconAirConditioning, label: "Aircond (semua bilik)" },
  { icon: IconGrill, label: "BBQ Area" },
  { icon: IconCar, label: "Parking Percuma" },
  { icon: IconToolsKitchen2, label: "Dapur Lengkap" },
  { icon: IconWashMachine, label: "Mesin Basuh" },
  { icon: IconShieldLock, label: "CCTV" },
  { icon: IconSofa, label: "Ruang Tamu Selesa" },
  { icon: IconBed, label: "4 Bilik Tidur" },
  { icon: IconUsers, label: "Max 15 Orang" },
];

const FACILITIES_UNIT2 = [
  { icon: IconPool, label: "Kolam Renang Peribadi" },
  { icon: IconWifi, label: "WiFi Laju" },
  { icon: IconBrandNetflix, label: "Netflix" },
  { icon: IconAirConditioning, label: "Aircond (semua bilik)" },
  { icon: IconGrill, label: "BBQ Area" },
  { icon: IconCar, label: "Parking Percuma" },
  { icon: IconToolsKitchen2, label: "Dapur Lengkap" },
  { icon: IconWashMachine, label: "Mesin Basuh" },
  { icon: IconShieldLock, label: "CCTV" },
  { icon: IconSofa, label: "3 Tingkat Ruang Luas" },
  { icon: IconBed, label: "5 Bilik Tidur" },
  { icon: IconUsers, label: "Max 25 Orang" },
];

interface FacilitiesGridProps {
  unitId: string;
}

export default function FacilitiesGrid({ unitId }: FacilitiesGridProps) {
  const facilities = unitId === "unit1" ? FACILITIES_UNIT1 : FACILITIES_UNIT2;

  return (
    <section className="py-12 md:py-16 bg-lawo-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-lawo-black mb-8">
          Kemudahan & Fasiliti
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {facilities.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-4 bg-lawo-bg rounded-[12px]"
            >
              <div className="w-9 h-9 rounded-full bg-lawo-white flex items-center justify-center shrink-0">
                <Icon size={18} className="text-lawo-black" />
              </div>
              <span className="font-outfit text-sm text-lawo-gray-dark leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
