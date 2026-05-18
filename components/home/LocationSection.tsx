import { IconMapPin, IconExternalLink } from "@tabler/icons-react";
import { UNITS } from "@/lib/units";

const units = [UNITS.unit1, UNITS.unit2];

export default function LocationSection() {
  return (
    <section className="py-16 md:py-24 bg-lawo-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-3">
            Lokasi
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-lawo-black">
            Mudah Dijumpai
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {units.map((unit, i) => (
            <div
              key={unit.id}
              className="bg-lawo-white rounded-[14px] overflow-hidden"
            >
              {/* Map */}
              <div className="h-56 sm:h-72 relative">
                <iframe
                  src={`https://www.google.com/maps?q=${unit.coordinates.lat},${unit.coordinates.lng}&z=16&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Lokasi ${unit.name}`}
                  className="w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="font-outfit text-xs font-semibold tracking-[0.15em] uppercase text-lawo-gray mb-1.5">
                  Unit {i + 1}
                </p>
                <h3 className="font-playfair text-xl font-bold text-lawo-black mb-2">
                  {unit.name}
                </h3>
                <div className="flex items-start gap-2 mb-4">
                  <IconMapPin size={14} className="text-lawo-gray shrink-0 mt-0.5" />
                  <p className="font-outfit text-sm text-lawo-gray leading-relaxed">
                    {unit.address}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${unit.coordinates.lat},${unit.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-outfit text-sm font-medium text-lawo-black border border-lawo-black px-4 py-2 rounded-[8px] hover:bg-lawo-black hover:text-lawo-white transition-colors"
                >
                  <IconExternalLink size={14} />
                  Dapatkan Arah
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
