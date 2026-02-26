import { Suspense } from "react";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { ToastFromUrl } from "@/components/ToastFromUrl";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
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
