import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BookingFormClient from "./BookingFormClient";
import type { Unit } from "@/types";

export const metadata: Metadata = {
  title: "Tempahan | The Lawo Homestay",
  description: "Lengkapkan maklumat tempahan anda.",
};

interface SearchParams {
  unit?: string;
  checkin?: string;
  checkout?: string;
  nights?: string;
}

export default async function BookingFormPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { unit, checkin, checkout, nights } = params;

  // Redirect if missing required params
  if (!unit || !checkin || !checkout || !nights) {
    redirect("/");
  }

  const validUnits: Unit[] = ["unit1", "unit2"];
  if (!validUnits.includes(unit as Unit)) redirect("/");

  return (
    <BookingFormClient
      unit={unit as Unit}
      checkin={checkin}
      checkout={checkout}
      nights={Number(nights)}
    />
  );
}
