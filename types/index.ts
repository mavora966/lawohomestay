export type Unit = "unit1" | "unit2";
export type DayType = "weekday" | "weekend" | "holiday";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
export type BookingSource =
  | "website"
  | "whatsapp"
  | "airbnb"
  | "bookingcom"
  | "direct";

export interface PricingRow {
  weekday_1night: number;
  weekday_2night: number;
  weekend_1night: number;
  weekend_2night: number;
  holiday_1night: number;
  holiday_2night: number;
}

export interface UnitData {
  id: Unit;
  name: string;
  tagline: string;
  address: string;
  coordinates: { lat: number; lng: number };
  maxPax: number;
  bedrooms: number;
  heroImage: string;
  images: string[];
  pricing: PricingRow;
}

export interface BookingFormData {
  unit: Unit;
  checkin: string;
  checkout: string;
  nights: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  bank: string;
  amount: number;
  dayType: DayType;
}
