import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

function fmt(d: Date) {
  return d.toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
  completed: "bg-blue-100 text-blue-700",
};

const STATUSES = ["", "pending", "confirmed", "cancelled", "completed"];
const VALID_STATUSES = new Set(["pending", "confirmed", "cancelled", "completed"]);
const VALID_UNITS = new Set(["unit1", "unit2"]);

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; unit?: string }>;
}) {
  const params = await searchParams;
  // Whitelist to prevent arbitrary Prisma queries from URL params
  const statusFilter = VALID_STATUSES.has(params.status ?? "") ? (params.status ?? "") : "";
  const unitFilter = VALID_UNITS.has(params.unit ?? "") ? (params.unit ?? "") : "";

  const where: Prisma.BookingWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(unitFilter ? { unit: unitFilter } : {}),
  };

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      booking_code: true,
      unit: true,
      guest_name: true,
      guest_phone: true,
      checkin_date: true,
      checkout_date: true,
      nights: true,
      amount: true,
      deposit_paid: true,
      status: true,
      created_at: true,
    },
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl font-bold text-lawo-black">Tempahan</h1>
        <p className="font-outfit text-sm text-lawo-gray mt-1">{bookings.length} rekod dijumpai</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status filter */}
        <div className="flex gap-1.5 bg-lawo-white rounded-[8px] p-1">
          {STATUSES.map((s) => (
            <Link
              key={s || "all"}
              href={`/admin/bookings?${new URLSearchParams({ ...(s ? { status: s } : {}), ...(unitFilter ? { unit: unitFilter } : {}) }).toString()}`}
              className={[
                "px-3 py-1.5 rounded-[6px] font-outfit text-xs font-semibold transition-colors capitalize",
                statusFilter === s
                  ? "bg-lawo-black text-lawo-white"
                  : "text-lawo-gray hover:text-lawo-black",
              ].join(" ")}
            >
              {s || "Semua"}
            </Link>
          ))}
        </div>

        {/* Unit filter */}
        <div className="flex gap-1.5 bg-lawo-white rounded-[8px] p-1">
          {["", "unit1", "unit2"].map((u) => (
            <Link
              key={u || "all"}
              href={`/admin/bookings?${new URLSearchParams({ ...(statusFilter ? { status: statusFilter } : {}), ...(u ? { unit: u } : {}) }).toString()}`}
              className={[
                "px-3 py-1.5 rounded-[6px] font-outfit text-xs font-semibold transition-colors",
                unitFilter === u
                  ? "bg-lawo-black text-lawo-white"
                  : "text-lawo-gray hover:text-lawo-black",
              ].join(" ")}
            >
              {u || "Semua Unit"}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-lawo-white rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-outfit">
            <thead>
              <tr className="border-b border-lawo-bg">
                {["Kod Tempahan", "Unit", "Tetamu", "Check-in → Check-out", "Malam", "Jumlah", "Deposit", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-lawo-gray font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-lawo-bg last:border-0 hover:bg-lawo-bg/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-lawo-black">{b.booking_code}</span>
                  </td>
                  <td className="px-4 py-3 text-lawo-gray capitalize">{b.unit}</td>
                  <td className="px-4 py-3">
                    <p className="text-lawo-black font-medium">{b.guest_name}</p>
                    <p className="text-lawo-gray text-xs">{b.guest_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-lawo-gray whitespace-nowrap">
                    {fmt(b.checkin_date)} → {fmt(b.checkout_date)}
                  </td>
                  <td className="px-4 py-3 text-lawo-gray">{b.nights}</td>
                  <td className="px-4 py-3 text-lawo-black font-semibold whitespace-nowrap">
                    RM {Number(b.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${b.deposit_paid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {b.deposit_paid ? "Dibayar" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status] ?? ""}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="text-xs text-lawo-gray hover:text-lawo-black underline underline-offset-2">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-lawo-gray text-sm">
                    Tiada tempahan ditemui.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
