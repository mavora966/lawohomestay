import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { Header, Footer, WhatsAppFloat } from "@/components/layout";

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

export const metadata: Metadata = {
  title: "The Lawo Homestay — Kuala Terengganu",
  description:
    "Homestay eksklusif di Kuala Terengganu. 2 unit mewah dengan kolam renang peribadi. Sesuai untuk keluarga dan kumpulan besar.",
  openGraph: {
    title: "The Lawo Homestay — Kuala Terengganu",
    description:
      "Homestay eksklusif di Kuala Terengganu. 2 unit mewah dengan kolam renang peribadi.",
    url: "https://lawohomestay.com",
    siteName: "The Lawo Homestay",
    locale: "ms_MY",
    type: "website",
  },
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
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
