import type { Metadata } from "next";
import UnitPageClient from "@/components/unit/UnitPageClient";
import JsonLd from "@/components/seo/JsonLd";

const BASE = "https://lawohomestay.com";

export const metadata: Metadata = {
  title: "Unit 1 — Pengadang Baru",
  description:
    "Homestay eksklusif dengan kolam renang peribadi di Pengadang Baru, Kuala Terengganu. Sehingga 15 orang, 4 bilik tidur. Dari RM550/malam.",
  keywords: [
    "homestay pengadang baru kuala terengganu",
    "sewa homestay pool terengganu",
    "villa kolam renang kuala terengganu",
  ],
  openGraph: {
    title: "Unit 1 — Pengadang Baru | The Lawo Homestay",
    description:
      "Homestay eksklusif dengan kolam renang peribadi di Pengadang Baru, Kuala Terengganu. Sehingga 15 orang, 4 bilik tidur.",
    url: `${BASE}/unit1`,
    images: [
      {
        url: "/images/unit1/hero-unit1-1.jpeg",
        width: 1200,
        height: 630,
        alt: "The Lawo Homestay Unit 1 — Pengadang Baru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/unit1/hero-unit1-1.jpeg"],
  },
  alternates: { canonical: `${BASE}/unit1` },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "The Lawo Homestay — Unit 1 Pengadang Baru",
  description:
    "Homestay eksklusif dengan kolam renang peribadi di Pengadang Baru, Kuala Terengganu. Sehingga 15 orang, 4 bilik tidur.",
  url: `${BASE}/unit1`,
  telephone: "+601115141215",
  priceRange: "RM550–RM1300",
  image: `${BASE}/images/unit1/hero-unit1-1.jpeg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "A 482, Taman Haji Da, Kg Pengadang Baru",
    addressLocality: "Kuala Terengganu",
    addressRegion: "Terengganu",
    postalCode: "20050",
    addressCountry: "MY",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 5.2733947,
    longitude: 103.1034652,
  },
  checkinTime: "15:00",
  checkoutTime: "12:00",
  numberOfRooms: 4,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Kolam Renang Peribadi", value: true },
    { "@type": "LocationFeatureSpecification", name: "WiFi Percuma", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dapur Lengkap", value: true },
    { "@type": "LocationFeatureSpecification", name: "Tempat Letak Kereta", value: true },
  ],
  hasMap: "https://maps.google.com/?q=5.2733947,103.1034652",
};

export default function Unit1Page() {
  return (
    <>
      <JsonLd data={schema} />
      <main className="pb-20 md:pb-0">
        <UnitPageClient unitId="unit1" unitIndex={1} />
      </main>
    </>
  );
}
