import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteBanner } from "@/components/layout/SiteBanner";
import { Providers } from "@/lib/store";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chez Jules — Fleuriste artisan",
    template: "%s · Chez Jules",
  },
  description:
    "Fleuriste artisan à Paris. Bouquets de saison, roses anciennes, plantes d'intérieur, mariage et abonnements. Livraison soignée.",
  metadataBase: new URL("https://chez-jules.fr"),
  openGraph: {
    title: "Chez Jules — Fleuriste artisan",
    description:
      "Bouquets de saison composés à la main. Paris et Île-de-France.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Suspense fallback={null}>
            <SiteBanner />
          </Suspense>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
