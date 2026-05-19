"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconMenu2,
  IconX,
  IconPhone,
} from "@tabler/icons-react";

const navLinks = [
  { label: "Utama", href: "/" },
  { label: "Unit 1 — Pengadang Baru", href: "/unit1" },
  { label: "Unit 2 — Bukit Besar", href: "/unit2" },
  { label: "Hubungi Kami", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          transparent
            ? "bg-transparent"
            : "bg-lawo-white/95 backdrop-blur-md border-b border-lawo-gray-light",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {/* Single black SVG — CSS invert makes it white on transparent header */}
              <img
                src="/logo-black.svg"
                alt="The Lawo Homestay"
                className={[
                  "h-12 w-auto transition-all duration-300",
                  transparent ? "invert" : "",
                ].join(" ")}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "font-outfit text-sm font-medium transition-all duration-200 relative group",
                    transparent
                      ? "text-lawo-white/90 hover:text-lawo-white"
                      : "text-lawo-gray hover:text-lawo-black",
                    pathname === link.href ? "!text-lawo-black font-semibold" : "",
                  ].join(" ")}
                >
                  {link.label}
                  <span
                    className={[
                      "absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-200",
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full",
                    ].join(" ")}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "hidden md:flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium font-outfit transition-all duration-200",
                transparent
                  ? "bg-lawo-white text-lawo-black hover:bg-lawo-white/90"
                  : "bg-lawo-black text-lawo-white hover:bg-lawo-gray-dark",
              ].join(" ")}
            >
              <IconPhone size={16} />
              WhatsApp Kami
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={[
                "md:hidden p-2 rounded-lg transition-colors",
                transparent
                  ? "text-lawo-white hover:bg-lawo-white/10"
                  : "text-lawo-black hover:bg-lawo-gray-light",
              ].join(" ")}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            >
              {menuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={[
          "fixed inset-0 z-30 md:hidden transition-all duration-300",
          menuOpen ? "visible" : "invisible",
        ].join(" ")}
      >
        {/* Backdrop */}
        <div
          className={[
            "absolute inset-0 bg-lawo-black/50 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={[
            "absolute top-0 right-0 h-full w-4/5 max-w-xs bg-lawo-white flex flex-col transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="h-16 flex items-center px-6 border-b border-lawo-gray-light">
            <img
              src="/logo-black.svg"
              alt="The Lawo Homestay"
              className="h-10 w-auto"
            />
          </div>

          <nav className="flex-1 flex flex-col px-6 py-8 gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                className={[
                  "py-3 px-4 rounded-[10px] font-outfit text-base font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-lawo-black text-lawo-white"
                    : "text-lawo-gray-dark hover:bg-lawo-bg hover:text-lawo-black",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-8">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-[10px] bg-lawo-black text-lawo-white font-outfit font-medium text-base"
            >
              <IconPhone size={18} />
              WhatsApp Kami
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
