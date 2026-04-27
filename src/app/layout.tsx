import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Chez Jules — Fleuriste artisan",
    template: "%s · Chez Jules",
  },
  description:
    "Bouquets, plantes et compositions florales façonnés à la main. Livraison soignée et retrait en boutique.",
  keywords: [
    "fleuriste",
    "bouquet",
    "livraison fleurs",
    "abonnement fleurs",
    "plantes",
    "Chez Jules",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Chez Jules — Fleuriste artisan",
    description:
      "Bouquets, plantes et compositions florales façonnés à la main.",
    siteName: "Chez Jules",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-dvh flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
