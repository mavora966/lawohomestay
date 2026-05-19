import { IconMapPin } from "@tabler/icons-react";

const attractions = [
  {
    category: "Universiti & Pendidikan",
    emoji: "🎓",
    places: [
      { name: "Universiti Malaysia Terengganu (UMT)", dist: "~12 km" },
      { name: "Universiti Sultan Zainal Abidin (UniSZA)", dist: "~5 km" },
      { name: "UiTM Cawangan Terengganu", dist: "~8 km" },
    ],
  },
  {
    category: "Tarikan Pelancongan",
    emoji: "🏖️",
    places: [
      { name: "Pantai Batu Buruk", dist: "~4 km" },
      { name: "Pasar Besar Kedai Payang", dist: "~6 km" },
      { name: "Muzium Negeri Terengganu", dist: "~5 km" },
      { name: "Bukit Puteri", dist: "~5 km" },
    ],
  },
  {
    category: "Makanan & Hiburan",
    emoji: "🍜",
    places: [
      { name: "Nasi Dagang Atas Tol", dist: "~3 km" },
      { name: "Keropok Lekor Losong", dist: "~4 km" },
      { name: "Ikan Celup Tepung Pok Nong", dist: "~5 km" },
      { name: "KTCC & Mayang Mall", dist: "~6 km" },
    ],
  },
];

export default function NearbyAttractions() {
  return (
    <section className="py-16 md:py-24 bg-lawo-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-3">
            Sekeliling Kami
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-lawo-black max-w-lg">
            Lokasi Strategik di Jantung KT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attractions.map(({ category, emoji, places }) => (
            <div
              key={category}
              className="bg-lawo-bg rounded-[14px] p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{emoji}</span>
                <h3 className="font-playfair text-lg font-bold text-lawo-black">
                  {category}
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {places.map(({ name, dist }) => (
                  <li key={name} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <IconMapPin
                        size={14}
                        className="text-lawo-gray shrink-0 mt-0.5"
                      />
                      <span className="font-outfit text-sm text-lawo-gray-dark leading-snug">
                        {name}
                      </span>
                    </div>
                    <span className="font-outfit text-xs text-lawo-gray shrink-0 mt-0.5">
                      {dist}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
