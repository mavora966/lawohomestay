import Link from "next/link";
import Image from "next/image";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconMapPin,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";

const units = [
  {
    name: "Unit 1 — Pengadang Baru",
    href: "/unit1",
    address: "A 482, Taman Haji Da, Kg Pengadang Baru, 20050 Kuala Terengganu",
  },
  {
    name: "Unit 2 — Bukit Besar",
    href: "/unit2",
    address: "No 2, Taman Mutiara, Jln Seri Bayas, 21100 Kuala Terengganu",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-lawo-black text-lawo-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo-white.svg"
                alt="The Lawo Homestay"
                width={37}
                height={48}
                unoptimized
                className="h-14 w-auto"
              />
            </Link>
            <p className="font-outfit text-sm text-lawo-white/60 leading-relaxed mb-6">
              Homestay eksklusif di Kuala Terengganu. Sempurna untuk keluarga
              dan kumpulan besar yang ingin pengalaman penginapan mewah.
            </p>
            <div className="flex gap-3">
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full border border-lawo-white/20 hover:border-lawo-white/60 hover:bg-lawo-white/10 transition-all"
                >
                  <IconBrandInstagram size={18} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-full border border-lawo-white/20 hover:border-lawo-white/60 hover:bg-lawo-white/10 transition-all"
                >
                  <IconBrandFacebook size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Units */}
          <div>
            <h3 className="font-outfit text-xs font-semibold uppercase tracking-widest text-lawo-white/40 mb-5">
              Unit Kami
            </h3>
            <div className="flex flex-col gap-5">
              {units.map((unit) => (
                <div key={unit.href}>
                  <Link
                    href={unit.href}
                    className="font-outfit font-medium text-lawo-white hover:text-lawo-white/70 transition-colors text-sm"
                  >
                    {unit.name}
                  </Link>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-lawo-white/50 leading-relaxed">
                    <IconMapPin size={13} className="mt-0.5 shrink-0" />
                    {unit.address}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-outfit text-xs font-semibold uppercase tracking-widest text-lawo-white/40 mb-5">
              Hubungi Kami
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-outfit text-lawo-white/70 hover:text-lawo-white transition-colors"
              >
                <IconPhone size={15} className="shrink-0" />
                +6011-1514 1215
              </a>
              <a
                href="mailto:hgmarketing966@gmail.com"
                className="flex items-center gap-2.5 text-sm font-outfit text-lawo-white/70 hover:text-lawo-white transition-colors"
              >
                <IconMail size={15} className="shrink-0" />
                hgmarketing966@gmail.com
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-lawo-white/10">
              <p className="text-xs font-outfit text-lawo-white/40 leading-relaxed">
                Check-in: 3:00 PTG
                <br />
                Check-out: 12:00 TGH
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-lawo-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-outfit text-lawo-white/30">
            © {year} The Lawo Homestay. Hak Cipta Terpelihara.
          </p>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="text-xs font-outfit text-lawo-white/20 hover:text-lawo-white/50 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
