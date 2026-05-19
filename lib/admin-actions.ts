"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
}

export async function confirmBooking(id: number) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id },
    data: { status: "confirmed" },
  });
  await prisma.activityLog.create({
    data: { action: "booking_confirmed", description: `Tempahan #${id} disahkan`, booking_id: id, admin_user: "admin" },
  });
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

export async function cancelBooking(id: number) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id },
    data: { status: "cancelled" },
  });
  await prisma.activityLog.create({
    data: { action: "booking_cancelled", description: `Tempahan #${id} dibatalkan`, booking_id: id, admin_user: "admin" },
  });
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

export async function addBlockedDate(formData: FormData) {
  await requireAdmin();
  const unit = formData.get("unit") as string;
  const date_from = new Date(formData.get("date_from") as string);
  const date_to = new Date(formData.get("date_to") as string);
  const reason = (formData.get("reason") as string) || null;

  if (!unit || isNaN(date_from.getTime()) || isNaN(date_to.getTime())) return;
  if (date_to <= date_from) return;

  await prisma.blockedDate.create({
    data: { unit, date_from, date_to, reason, created_by: "admin" },
  });
  revalidatePath("/admin/blocked");
}

export async function deleteBlockedDate(id: number) {
  await requireAdmin();
  await prisma.blockedDate.delete({ where: { id } });
  revalidatePath("/admin/blocked");
}
