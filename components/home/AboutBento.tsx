import {
  IconPool,
  IconBed,
  IconUsers,
  IconMapPin,
  IconStar,
  IconCalendar,
} from "@tabler/icons-react";

const bentoItems = [
  {
    icon: IconPool,
    title: "Kolam Renang Peribadi",
    desc: "Setiap unit dilengkapi kolam renang peribadi — bebas mandi tanpa gangguan.",
    span: "col-span-1 md:col-span-2",
    dark: true,
  },
  {
    icon: IconUsers,
    title: "Sehingga 25 Orang",
    desc: "Sesuai untuk keluarga besar, trip korporat, dan majlis.",
    span: "col-span-1",
    dark: false,
  },
  {
    icon: IconBed,
    title: "9 Bilik Tidur",
    desc: "4 bilik di Unit 1, 5 bilik di Unit 2. Semua ber-aircond.",
    span: "col-span-1",
    dark: false,
  },
  {
    icon: IconStar,
    title: "Premium & Eksklusif",
    desc: "Reka bentuk moden yang bersih. Netflix, WiFi laju, BBQ, dan kemudahan lengkap.",
    span: "col-span-1",
    dark: false,
  },
  {
    icon: IconMapPin,
    title: "Lokasi Strategik KT",
    desc: "Berdekatan pantai, pasar besar, dan tarikan utama Kuala Terengganu.",
    span: "col-span-1 md:col-span-2",
    dark: true,
  },
  {
    icon: IconCalendar,
    title: "Booking Mudah & Selamat",
    desc: "Bayar deposit RM300 sahaja untuk konfirm tempahan. Proses cepat via FPX.",
    span: "col-span-1",
    dark: false,
  },
];

export default function AboutBento() {
  return (
    <section className="py-16 md:py-24 bg-lawo-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-lawo-gray mb-3">
            Kenapa The Lawo
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-lawo-black max-w-lg">
            Pengalaman Penginapan Yang Berbeza
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bentoItems.map(({ icon: Icon, title, desc, span, dark }) => (
            <div
              key={title}
              className={[
                "rounded-[14px] p-6 md:p-8 flex flex-col gap-4",
                span,
                dark
                  ? "bg-lawo-black text-lawo-white"
                  : "bg-lawo-white text-lawo-black",
              ].join(" ")}
            >
              <div
                className={[
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  dark ? "bg-lawo-white/10" : "bg-lawo-bg",
                ].join(" ")}
              >
                <Icon
                  size={20}
                  className={dark ? "text-lawo-white" : "text-lawo-black"}
                />
              </div>
              <div>
                <h3
                  className={[
                    "font-playfair text-xl font-bold mb-1.5",
                    dark ? "text-lawo-white" : "text-lawo-black",
                  ].join(" ")}
                >
                  {title}
                </h3>
                <p
                  className={[
                    "font-outfit text-sm leading-relaxed",
                    dark ? "text-lawo-white/60" : "text-lawo-gray",
                  ].join(" ")}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
