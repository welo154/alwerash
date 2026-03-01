import { Suspense } from "react";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { ToastFromUrl } from "@/components/ToastFromUrl";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic", "normal"],
  variable: "--font-logo",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Alwerash — Subscription education for design & creative",
    template: "%s | Alwerash",
  },
  description:
    "Learn from industry experts. Subscribe once, access all courses in design, motion, and creative skills.",
  openGraph: {
    title: "Alwerash — Subscription education for design & creative",
    description: "Learn from industry experts. Subscribe once, access all courses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastFromUrl />
          </Suspense>
          <SessionProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
