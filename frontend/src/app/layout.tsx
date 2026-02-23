import { SessionProvider } from "@/components/SessionProvider";
import { SiteLayout } from "@/components/layout/SiteLayout";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider>
          <SiteLayout>{children}</SiteLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
