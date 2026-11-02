import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, Instrument_Serif, Reem_Kufi, Space_Mono } from "next/font/google";
import { EVENT } from "@/lib/event";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const dmsans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap" });
const reem = Reem_Kufi({ subsets: ["arabic"], variable: "--font-reem", display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono-face", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${EVENT.name} · University & Career Discovery Day`,
  description: `${EVENT.tagline} ${EVENT.dateLabel} at ${EVENT.venue}, ${EVENT.area}. Free for high-school students and parents.`,
  openGraph: {
    title: `${EVENT.name} (${EVENT.arabic})`,
    description: EVENT.tagline,
    type: "website",
    locale: "en_EG",
  },
};

export const viewport: Viewport = { themeColor: "#10292b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${dmsans.variable} ${reem.variable} ${mono.variable}`}>
      <body className="grain antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
