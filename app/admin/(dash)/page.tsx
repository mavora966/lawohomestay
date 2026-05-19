import { prisma } from "@/lib/prisma";
import Link from "next/link";

function fmt(d: Date) {
  return d.toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
  completed: "bg-blue-100 text-blue-700",
};

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [pending, confirmedMonth, revenueMonth, recent] = await Promise.all([
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.count({ where: { status: "confirmed", created_at: { gte: monthStart } } }),
    prisma.booking.aggregate({
      _sum: { deposit: true },
      where: { deposit_paid: true, deposit_paid_at: { gte: monthStart } },
    }),
    prisma.booking.findMany({
      orderBy: { created_at: "desc" },
      take: 8,
      select: {
        id: true,
        booking_code: true,
        unit: true,
        guest_name: true,
        checkin_date: true,
        checkout_date: true,
        nights: true,
        status: true,
        deposit_paid: true,
        created_at: true,
      },
    }),
  ]);

  const revenue = Number(revenueMonth._sum.deposit ?? 0);

  const stats = [
    { label: "Menunggu Konfirmasi", value: pending, color: "text-amber-600" },
    { label: "Disahkan Bulan Ini", value: confirmedMonth, color: "text-green-600" },
    { label: "Deposit Diterima (Bulan Ini)", value: `RM ${revenue.toLocaleString()}`, color: "text-lawo-black" },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-playfair text-2xl font-bold text-lawo-black">Dashboard</h1>
        <p className="font-outfit text-sm text-lawo-gray mt-1">
          {now.toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-lawo-white rounded-[12px] p-5">
            <p className="font-outfit text-xs text-lawo-gray uppercase tracking-wider mb-2">{label}</p>
            <p className={`font-playfair text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-lawo-white rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-lawo-bg">
          <h2 className="font-outfit font-semibold text-sm text-lawo-black">Tempahan Terbaru</h2>
          <Link href="/admin/bookings" className="font-outfit text-xs text-lawo-gray hover:text-lawo-black transition-colors">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-outfit">
            <thead>
              <tr className="border-b border-lawo-bg">
                {["Kod", "Unit", "Tetamu", "Check-in", "Malam", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-lawo-gray font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id} className="border-b border-lawo-bg last:border-0 hover:bg-lawo-bg/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="font-mono text-xs text-lawo-black hover:underline">
                      {b.booking_code}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-lawo-gray capitalize">{b.unit}</td>
                  <td className="px-5 py-3 text-lawo-black">{b.guest_name}</td>
                  <td className="px-5 py-3 text-lawo-gray">{fmt(b.checkin_date)}</td>
                  <td className="px-5 py-3 text-lawo-gray">{b.nights}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status] ?? ""}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-lawo-gray text-sm">
                    Tiada tempahan lagi.
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
