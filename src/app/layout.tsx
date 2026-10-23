import { Suspense } from "react";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { ToastFromUrl } from "@/components/ToastFromUrl";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { pangeaVar } from "@/lib/fonts/pangea";
import "./globals.css";

export const metadata = {
  title: {
    default: "ALWERASH",
    template: "ALWERASH",
  },
  description:
    "Learn from industry experts. Subscribe once, access all courses in design, motion, and creative skills.",
  openGraph: {
    title: "Alwerash",
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
            <LocaleProvider>
              <MicrosoftClarity />
              <LenisProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </LenisProvider>
            </LocaleProvider>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
