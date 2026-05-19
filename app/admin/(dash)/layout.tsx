import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminDashLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const username = session.user?.name ?? "Admin";

  return (
    <div className="flex min-h-screen bg-lawo-bg">
      <AdminSidebar username={username} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
