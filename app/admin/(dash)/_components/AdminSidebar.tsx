"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  IconLayoutDashboard,
  IconCalendarEvent,
  IconCalendarOff,
  IconLogout,
} from "@tabler/icons-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Tempahan", icon: IconCalendarEvent, exact: false },
  { href: "/admin/blocked", label: "Tarikh Disekat", icon: IconCalendarOff, exact: false },
];

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-56 shrink-0 bg-lawo-black min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-lawo-white/10 flex items-center gap-3">
        <Image
          src="/logo-white.svg"
          alt="The Lawo Homestay"
          width={28}
          height={36}
          unoptimized
          className="h-9 w-auto shrink-0"
        />
        <p className="font-outfit text-lawo-white/40 text-xs leading-tight">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-[8px] font-outfit text-sm transition-colors",
                active
                  ? "bg-lawo-white/10 text-lawo-white font-semibold"
                  : "text-lawo-white/50 hover:text-lawo-white hover:bg-lawo-white/5",
              ].join(" ")}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-lawo-white/10">
        <p className="font-outfit text-xs text-lawo-white/30 px-3 mb-2 truncate">{username}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] font-outfit text-sm text-lawo-white/50 hover:text-lawo-white hover:bg-lawo-white/5 transition-colors"
        >
          <IconLogout size={17} />
          Log Keluar
        </button>
      </div>
    </aside>
  );
}
