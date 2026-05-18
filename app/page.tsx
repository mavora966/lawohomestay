import HeroSection from "@/components/home/HeroSection";
import AboutBento from "@/components/home/AboutBento";
import UnitCards from "@/components/home/UnitCards";
import BookingCalendar from "@/components/home/BookingCalendar";
import NearbyAttractions from "@/components/home/NearbyAttractions";
import LocationSection from "@/components/home/LocationSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutBento />
      <UnitCards />
      <BookingCalendar />
      <NearbyAttractions />
      <LocationSection />
    </main>
  );
}
