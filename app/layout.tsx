import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { Header, Footer, WhatsAppFloat } from "@/components/layout";
import { GTMScript, GTMNoscript } from "@/components/tracking/GTMScript";
import Analytics from "@/components/tracking/Analytics";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const BASE = "https://lawohomestay.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "The Lawo Homestay — Kuala Terengganu",
    template: "%s | The Lawo Homestay",
  },
  description:
    "Homestay eksklusif di Kuala Terengganu. 2 unit mewah dengan kolam renang peribadi. Sesuai untuk keluarga dan kumpulan besar.",
  keywords: [
    "homestay kuala terengganu",
    "homestay pool terengganu",
    "the lawo homestay",
    "kolam renang kuala terengganu",
    "homestay sewa kuala terengganu",
  ],
  authors: [{ name: "The Lawo Homestay" }],
  openGraph: {
    title: "The Lawo Homestay — Kuala Terengganu",
    description:
      "Homestay eksklusif di Kuala Terengganu. 2 unit mewah dengan kolam renang peribadi.",
    url: BASE,
    siteName: "The Lawo Homestay",
    locale: "ms_MY",
    type: "website",
    images: [{ url: "/images/unit1/pool-unit1-1.jpeg", width: 1200, height: 630, alt: "The Lawo Homestay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lawo Homestay — Kuala Terengganu",
    description: "Homestay eksklusif di Kuala Terengganu. 2 unit mewah dengan kolam renang peribadi.",
    images: ["/images/unit1/pool-unit1-1.jpeg"],
  },
  alternates: { canonical: BASE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ms"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lawo-bg text-lawo-black font-outfit">
        <GTMNoscript />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
        <GTMScript />
        <Analytics />
      </body>
    </html>
  );
}
