import { IconMapPin, IconExternalLink } from "@tabler/icons-react";
import type { UnitData } from "@/types";

interface UnitLocationSectionProps {
  unit: UnitData;
}

export default function UnitLocationSection({ unit }: UnitLocationSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-lawo-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-lawo-black mb-6">
          Lokasi
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 rounded-[14px] overflow-hidden h-64 md:h-80">
            <iframe
              src={`https://www.google.com/maps?q=${unit.coordinates.lat},${unit.coordinates.lng}&z=16&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Lokasi ${unit.name}`}
            />
          </div>

          {/* Info */}
          <div className="bg-lawo-white rounded-[14px] p-6 flex flex-col justify-between">
            <div>
              <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-lawo-gray mb-2">
                Alamat Penuh
              </p>
              <div className="flex items-start gap-2 mb-6">
                <IconMapPin size={16} className="text-lawo-gray shrink-0 mt-0.5" />
                <p className="font-outfit text-sm text-lawo-gray-dark leading-relaxed">
                  {unit.address}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-outfit text-sm">
                  <span className="text-lawo-gray">Check-in</span>
                  <span className="font-medium text-lawo-black">3:00 PTG</span>
                </div>
                <div className="flex justify-between font-outfit text-sm">
                  <span className="text-lawo-gray">Check-out</span>
                  <span className="font-medium text-lawo-black">12:00 TGH</span>
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${unit.coordinates.lat},${unit.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-lawo-black text-lawo-white font-outfit font-medium text-sm py-3 rounded-[8px] hover:bg-lawo-gray-dark transition-colors"
            >
              <IconExternalLink size={15} />
              Dapatkan Arah
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
