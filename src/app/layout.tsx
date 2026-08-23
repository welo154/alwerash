import { Suspense } from "react";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { ToastFromUrl } from "@/components/ToastFromUrl";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { pangeaVar } from "@/lib/fonts/pangea";
import "./globals.css";

export const metadata = {
  title: {
    default: "Alwerash — Subscription education for design & creative",
    template: "%s | Alwerash",
  },
  description:
    "Learn from industry experts. Subscribe once, access all courses in design, motion, and creative skills.",
  icons: {
    icon: "/brand/alwerash-logo.png",
  },
  openGraph: {
    title: "Alwerash — Subscription education for design & creative",
    description: "Learn from industry experts. Subscribe once, access all courses.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${pangeaVar.variable} ${pangeaVar.className}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastFromUrl />
          </Suspense>
          <SessionProvider>
            <MicrosoftClarity />
            <LenisProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </LenisProvider>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
