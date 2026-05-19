import HeroSection from "@/components/home/HeroSection";
import AboutBento from "@/components/home/AboutBento";
import UnitCards from "@/components/home/UnitCards";
import BookingCalendar from "@/components/home/BookingCalendar";
import NearbyAttractions from "@/components/home/NearbyAttractions";
import LocationSection from "@/components/home/LocationSection";
import JsonLd from "@/components/seo/JsonLd";

const BASE = "https://lawohomestay.com";

const schema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "The Lawo Homestay",
  description:
    "Homestay eksklusif di Kuala Terengganu dengan 2 unit mewah berkonsep private pool villa. Sesuai untuk keluarga besar dan kumpulan.",
  url: BASE,
  telephone: "+601115141215",
  email: "hgmarketing966@gmail.com",
  priceRange: "RM550–RM1900",
  image: `${BASE}/images/unit1/pool-unit1-1.jpeg`,
  address: {
    "@type": "PostalAddress",
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
  numberOfRooms: 9,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Kolam Renang Peribadi", value: true },
    { "@type": "LocationFeatureSpecification", name: "WiFi Percuma", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dapur Lengkap", value: true },
    { "@type": "LocationFeatureSpecification", name: "Tempat Letak Kereta", value: true },
    { "@type": "LocationFeatureSpecification", name: "Permainan Indoor", value: true },
  ],
  hasMap: `https://maps.google.com/?q=5.2733947,103.1034652`,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={schema} />
      <main>
        <HeroSection />
        <AboutBento />
        <UnitCards />
        <BookingCalendar />
        <NearbyAttractions />
        <LocationSection />
      </main>
    </>
  );
}
