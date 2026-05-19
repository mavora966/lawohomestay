import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { confirmBooking, cancelBooking } from "@/lib/admin-actions";
import { IconArrowLeft } from "@tabler/icons-react";

function fmt(d: Date) {
  return d.toLocaleDateString("ms-MY", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtDt(d: Date) {
  return d.toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
  completed: "bg-blue-100 text-blue-700",
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
  if (!booking) notFound();

  const confirmWithId = confirmBooking.bind(null, booking.id);
  const cancelWithId = cancelBooking.bind(null, booking.id);

  const fields = [
    { label: "Kod Tempahan", value: booking.booking_code },
    { label: "Unit", value: booking.unit },
    { label: "Check-in", value: fmt(booking.checkin_date) },
    { label: "Check-out", value: fmt(booking.checkout_date) },
    { label: "Bilangan Malam", value: `${booking.nights} malam` },
    { label: "Jenis Hari", value: booking.day_type },
    { label: "Jumlah", value: `RM ${Number(booking.amount).toLocaleString()}` },
    { label: "Deposit", value: `RM ${Number(booking.deposit).toLocaleString()}` },
    { label: "Sumber", value: booking.source },
    { label: "Billplz Bill ID", value: booking.billplz_bill_id ?? "-" },
    { label: "Tarikh Dibuat", value: fmtDt(booking.created_at) },
  ];

  const guestFields = [
    { label: "Nama", value: booking.guest_name },
    { label: "No. Telefon", value: booking.guest_phone },
    { label: "Emel", value: booking.guest_email ?? "-" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 font-outfit text-sm text-lawo-gray hover:text-lawo-black mb-6 transition-colors">
        <IconArrowLeft size={15} />
        Kembali
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-lawo-black">{booking.booking_code}</h1>
          <p className="font-outfit text-sm text-lawo-gray mt-1">{booking.unit} · {booking.guest_name}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-outfit ${STATUS_COLORS[booking.status] ?? ""}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Booking details */}
        <div className="bg-lawo-white rounded-[12px] p-5">
          <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider mb-4">Maklumat Tempahan</h2>
          <dl className="flex flex-col gap-3">
            {fields.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="font-outfit text-xs text-lawo-gray shrink-0">{label}</dt>
                <dd className="font-outfit text-xs text-lawo-black font-medium text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Guest + deposit */}
        <div className="flex flex-col gap-4">
          <div className="bg-lawo-white rounded-[12px] p-5">
            <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider mb-4">Maklumat Tetamu</h2>
            <dl className="flex flex-col gap-3">
              {guestFields.map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="font-outfit text-xs text-lawo-gray shrink-0">{label}</dt>
                  <dd className="font-outfit text-xs text-lawo-black font-medium text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-lawo-white rounded-[12px] p-5">
            <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider mb-4">Status Pembayaran</h2>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${booking.deposit_paid ? "bg-green-500" : "bg-amber-400"}`} />
              <span className="font-outfit text-sm text-lawo-black font-medium">
                Deposit {booking.deposit_paid ? "Diterima" : "Belum Diterima"}
              </span>
            </div>
            {booking.deposit_paid_at && (
              <p className="font-outfit text-xs text-lawo-gray ml-4">{fmtDt(booking.deposit_paid_at)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="bg-lawo-white rounded-[12px] p-5 mb-6">
          <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider mb-2">Nota</h2>
          <p className="font-outfit text-sm text-lawo-gray-dark">{booking.notes}</p>
        </div>
      )}

      {/* Actions */}
      {(booking.status === "pending" || booking.status === "confirmed") && (
        <div className="bg-lawo-white rounded-[12px] p-5">
          <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider mb-4">Tindakan</h2>
          <div className="flex gap-3">
            {booking.status === "pending" && (
              <form action={confirmWithId}>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-green-600 text-white font-outfit font-semibold text-sm rounded-[8px] hover:bg-green-700 transition-colors"
                >
                  Sahkan Tempahan
                </button>
              </form>
            )}
            <form action={cancelWithId}>
              <button
                type="submit"
                className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 font-outfit font-semibold text-sm rounded-[8px] hover:bg-red-100 transition-colors"
              >
                Batalkan Tempahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
