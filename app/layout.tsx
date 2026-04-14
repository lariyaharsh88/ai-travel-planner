import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import PremiumNavbar from "@/components/PremiumNavbar";
import Providers from "@/components/Providers";

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EpicIndiaTrips AI Planner — Premium India trip & creator kit",
  description:
    "Plan India trips with AI — practical itineraries, maps & routes, budgets, reel scripts, Instagram spots, photo angles & SEO blog drafts. Built for travelers and creators.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSans.className} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-[var(--surface-page)] text-[var(--foreground)] antialiased">
        <Providers>
          <a href="#planner-form" className="skip-link">
            Skip to trip form
          </a>
          <PremiumNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
