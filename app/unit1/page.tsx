import type { Metadata } from "next";
import UnitPageClient from "@/components/unit/UnitPageClient";

export const metadata: Metadata = {
  title: "Unit 1 — Pengadang Baru | The Lawo Homestay",
  description:
    "Homestay eksklusif dengan kolam renang peribadi di Pengadang Baru, Kuala Terengganu. Sehingga 15 orang, 4 bilik tidur. Dari RM550/malam.",
};

export default function Unit1Page() {
  return (
    <main className="pb-20 md:pb-0">
      <UnitPageClient unitId="unit1" unitIndex={1} />
    </main>
  );
}
