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
    const lockViewport = pathname === "/login" || pathname === "/register";
    return (
      <div
        className={
          lockViewport
            ? "flex h-dvh max-h-dvh min-w-0 flex-col overflow-hidden bg-white"
            : "flex min-h-screen min-w-0 flex-col bg-white"
        }
      >
        <main
          className={
            lockViewport
              ? "mx-auto h-full min-h-0 w-full min-w-0 max-w-[1600px] overflow-hidden"
              : "mx-auto w-full max-w-[1440px] min-w-0 flex-1"
          }
        >
          {children}
        </main>
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
        <div className="w-full min-w-0">
          <div className="mx-auto w-full max-w-[1440px] min-w-0">
            <LibraryHeader compactBottom={pathname.startsWith("/library/books")} />
          </div>
        </div>
        <main className="w-full min-w-0 flex-1">{children}</main>
        <ConditionalSiteFooter />
      </div>
    );
  }

  return <SiteLayout>{children}</SiteLayout>;
}
