import type { Metadata } from "next";
import UnitPageClient from "@/components/unit/UnitPageClient";
import JsonLd from "@/components/seo/JsonLd";

const BASE = "https://lawohomestay.com";

export const metadata: Metadata = {
  title: "Unit 2 — Bukit Besar",
  description:
    "Bungalow 3 tingkat dengan kolam renang peribadi di Bukit Besar, Kuala Terengganu. Sehingga 25 orang, 5 bilik tidur. Dari RM800/malam.",
  keywords: [
    "homestay bukit besar kuala terengganu",
    "bungalow sewa terengganu",
    "villa 25 orang kuala terengganu",
  ],
  openGraph: {
    title: "Unit 2 — Bukit Besar | The Lawo Homestay",
    description:
      "Bungalow 3 tingkat dengan kolam renang peribadi di Bukit Besar, Kuala Terengganu. Sehingga 25 orang, 5 bilik tidur.",
    url: `${BASE}/unit2`,
    images: [
      {
        url: "/images/unit2/hero-unit2-1.jpeg",
        width: 1200,
        height: 630,
        alt: "The Lawo Homestay Unit 2 — Bukit Besar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/unit2/hero-unit2-1.jpeg"],
  },
  alternates: { canonical: `${BASE}/unit2` },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "The Lawo Homestay — Unit 2 Bukit Besar",
  description:
    "Bungalow 3 tingkat dengan kolam renang peribadi di Bukit Besar, Kuala Terengganu. Sehingga 25 orang, 5 bilik tidur.",
  url: `${BASE}/unit2`,
  telephone: "+601115141215",
  priceRange: "RM800–RM1900",
  image: `${BASE}/images/unit2/hero-unit2-1.jpeg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No 2, Taman Mutiara, Jln Seri Bayas",
    addressLocality: "Kuala Terengganu",
    addressRegion: "Terengganu",
    postalCode: "21100",
    addressCountry: "MY",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 5.3039,
    longitude: 103.1317,
  },
  checkinTime: "15:00",
  checkoutTime: "12:00",
  numberOfRooms: 5,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Kolam Renang Peribadi", value: true },
    { "@type": "LocationFeatureSpecification", name: "WiFi Percuma", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dapur Lengkap", value: true },
    { "@type": "LocationFeatureSpecification", name: "Tempat Letak Kereta", value: true },
    { "@type": "LocationFeatureSpecification", name: "Bungalow 3 Tingkat", value: true },
  ],
  hasMap: "https://maps.google.com/?q=5.3039,103.1317",
};

export default function Unit2Page() {
  return (
    <>
      <JsonLd data={schema} />
      <main className="pb-20 md:pb-0">
        <UnitPageClient unitId="unit2" unitIndex={2} />
      </main>
    </>
  );
}
