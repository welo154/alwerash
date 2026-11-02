import type { Metadata } from "next";
import { Suspense } from "react";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { ToastFromUrl } from "@/components/ToastFromUrl";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { MOTION_BOOT_SCRIPT } from "@/components/motion/motion-boot";
import { pangeaVar } from "@/lib/fonts/pangea";
import { getLocale } from "@/server/i18n";
import "./globals.css";

const COPY = {
  en: {
    description:
      "Learn from industry experts. Subscribe once, access all courses in design, motion, and creative skills.",
    ogDescription: "Learn from industry experts. Subscribe once, access all courses.",
    ogLocale: "en_US",
  },
  ar: {
    description:
      "تعلّم من خبراء المجال. اشترك مرة واحدة واحصل على جميع الدورات في التصميم والموشن والمهارات الإبداعية.",
    ogDescription: "تعلّم من خبراء المجال. اشترك مرة واحدة واحصل على جميع الدورات.",
    ogLocale: "ar_AR",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const copy = COPY[await getLocale()];
  return {
    title: {
      default: "ALWERASH",
      template: "ALWERASH",
    },
    description: copy.description,
    openGraph: {
      title: "Alwerash",
      description: copy.ogDescription,
      type: "website",
      locale: copy.ogLocale,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className={`${pangeaVar.variable} ${pangeaVar.className}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastFromUrl />
          </Suspense>
          <SessionProvider>
            <LocaleProvider initialLocale={locale}>
              <MicrosoftClarity />
              <MotionProvider />
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
