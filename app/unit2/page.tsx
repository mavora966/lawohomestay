import type { Metadata } from "next";
import UnitPageClient from "@/components/unit/UnitPageClient";

export const metadata: Metadata = {
  title: "Unit 2 — Bukit Besar | The Lawo Homestay",
  description:
    "Bungalow 3 tingkat dengan kolam renang peribadi di Bukit Besar, Kuala Terengganu. Sehingga 25 orang, 5 bilik tidur. Dari RM800/malam.",
};

export default function Unit2Page() {
  return (
    <main className="pb-20 md:pb-0">
      <UnitPageClient unitId="unit2" unitIndex={2} />
    </main>
  );
}
