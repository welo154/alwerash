"use client";

import { usePathname } from "next/navigation";
import { SiteLayout } from "./SiteLayout";
import { AdminLayout } from "./AdminLayout";
import { ConditionalSiteFooter } from "./ConditionalSiteFooter";

function isStandaloneRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/verify-email" ||
    pathname === "/subscription"
  );
}

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");
  /** Guest marketing home — HeroSection includes its own green nav shell. */
  const isGuestLanding = pathname === "/";
  const isStandalone = isStandaloneRoute(pathname);

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isStandalone) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col bg-white">
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    );
  }

  if (isGuestLanding) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
        <main className="min-w-0 flex-1">{children}</main>
        <ConditionalSiteFooter />
      </div>
    );
  }

  return <SiteLayout>{children}</SiteLayout>;
}
