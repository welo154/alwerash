import { Suspense } from "react";
import { auth } from "@/auth";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { ToastFromUrl } from "@/components/ToastFromUrl";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { pangeaVar } from "@/lib/fonts/pangea";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={`${pangeaVar.variable} ${pangeaVar.className}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <MicrosoftClarity userId={session?.user?.id} />
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastFromUrl />
          </Suspense>
          <SessionProvider session={session}>
            <ConditionalLayout>{children}</ConditionalLayout>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
