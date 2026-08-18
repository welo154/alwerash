"use client";

import { usePathname } from "next/navigation";
import { SiteLayout } from "./SiteLayout";
import { AdminLayout } from "./AdminLayout";
import { ConditionalSiteFooter } from "./ConditionalSiteFooter";
import { LibraryHeader } from "@/components/library/LibraryHeader";

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
  /** Library has its own dedicated header — skip the global SiteHeader. */
  const isLibrary = pathname === "/library" || pathname.startsWith("/library/");

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isStandalone) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col bg-white">
        <main className="mx-auto w-full max-w-[1440px] min-w-0 flex-1">{children}</main>
      </div>
    );
  }

  if (isGuestLanding) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
        <main className="mx-auto w-full max-w-[1440px] min-w-0 flex-1">{children}</main>
        <ConditionalSiteFooter />
      </div>
    );
  }

  if (isLibrary) {
    return (
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
        <div className="mx-auto w-full max-w-[1440px] min-w-0">
          <LibraryHeader compactBottom={pathname.startsWith("/library/books")} />
        </div>
        <main className="mx-auto w-full max-w-[1440px] min-w-0 flex-1">{children}</main>
        <ConditionalSiteFooter />
      </div>
    );
  }

  return <SiteLayout>{children}</SiteLayout>;
}
