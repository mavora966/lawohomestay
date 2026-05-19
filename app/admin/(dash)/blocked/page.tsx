import { prisma } from "@/lib/prisma";
import { addBlockedDate, deleteBlockedDate } from "@/lib/admin-actions";
import { IconTrash } from "@tabler/icons-react";

function fmt(d: Date) {
  return d.toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function BlockedDatesPage() {
  const blocked = await prisma.blockedDate.findMany({
    orderBy: { date_from: "asc" },
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl font-bold text-lawo-black">Tarikh Disekat</h1>
        <p className="font-outfit text-sm text-lawo-gray mt-1">
          Sekat tarikh tertentu supaya tidak boleh ditempah (cuti, penyelenggaraan, dll.)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="bg-lawo-white rounded-[12px] p-5 h-fit">
          <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider mb-4">
            Tambah Sekatan
          </h2>
          <form action={addBlockedDate} className="flex flex-col gap-4">
            <div>
              <label className="font-outfit text-xs font-semibold text-lawo-gray block mb-1.5">Unit</label>
              <select
                name="unit"
                required
                className="w-full border border-lawo-gray-light rounded-[8px] px-3 py-2.5 font-outfit text-sm text-lawo-black focus:outline-none focus:border-lawo-black"
              >
                <option value="unit1">Unit 1 — Pengadang Baru</option>
                <option value="unit2">Unit 2 — Bukit Besar</option>
              </select>
            </div>

            <div>
              <label className="font-outfit text-xs font-semibold text-lawo-gray block mb-1.5">Dari Tarikh</label>
              <input
                type="date"
                name="date_from"
                min={today}
                required
                className="w-full border border-lawo-gray-light rounded-[8px] px-3 py-2.5 font-outfit text-sm text-lawo-black focus:outline-none focus:border-lawo-black"
              />
            </div>

            <div>
              <label className="font-outfit text-xs font-semibold text-lawo-gray block mb-1.5">Hingga Tarikh</label>
              <input
                type="date"
                name="date_to"
                min={today}
                required
                className="w-full border border-lawo-gray-light rounded-[8px] px-3 py-2.5 font-outfit text-sm text-lawo-black focus:outline-none focus:border-lawo-black"
              />
            </div>

            <div>
              <label className="font-outfit text-xs font-semibold text-lawo-gray block mb-1.5">
                Sebab <span className="text-lawo-gray/60 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="reason"
                placeholder="cth: Penyelenggaraan, Cuti Raya..."
                className="w-full border border-lawo-gray-light rounded-[8px] px-3 py-2.5 font-outfit text-sm text-lawo-black focus:outline-none focus:border-lawo-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm rounded-[8px] hover:bg-lawo-gray-dark transition-colors"
            >
              Sekat Tarikh
            </button>
          </form>
        </div>

        {/* Blocked list */}
        <div className="lg:col-span-2 bg-lawo-white rounded-[12px] overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-lawo-bg">
            <h2 className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider">
              Senarai Sekatan ({blocked.length})
            </h2>
          </div>
          <div className="divide-y divide-lawo-bg">
            {blocked.map((b) => {
              const deleteWithId = deleteBlockedDate.bind(null, b.id);
              return (
                <div key={b.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-outfit text-xs font-semibold bg-lawo-black text-lawo-white px-2 py-0.5 rounded-full capitalize">
                        {b.unit}
                      </span>
                      <span className="font-outfit text-sm text-lawo-black">
                        {fmt(b.date_from)} → {fmt(b.date_to)}
                      </span>
                    </div>
                    {b.reason && (
                      <p className="font-outfit text-xs text-lawo-gray">{b.reason}</p>
                    )}
                  </div>
                  <form action={deleteWithId}>
                    <button
                      type="submit"
                      className="p-2 rounded-[6px] text-lawo-gray hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Padam"
                    >
                      <IconTrash size={15} />
                    </button>
                  </form>
                </div>
              );
            })}
            {blocked.length === 0 && (
              <div className="px-5 py-10 text-center font-outfit text-sm text-lawo-gray">
                Tiada tarikh disekat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
