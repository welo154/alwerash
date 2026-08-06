"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { GuestSiteHeader } from "./GuestSiteHeader";
import { LoggedInAppHeader } from "./LoggedInAppHeader";

/**
 * Chooses header by route + session.
 *
 * Guest marketing (`/`): no global header (Hero includes its own green shell + nav).
 *
 * Signed-in home (`/home`): LoggedInAppHeader only (separate route from `/`).
 *
 * Other routes: green app header (guest Log in / Sign up, or signed-in user menu).
 */
export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname() ?? "";
  const isAdmin = Boolean((session?.user as { roles?: string[] } | undefined)?.roles?.includes("ADMIN"));

  if (pathname === "/") {
    return null;
  }

  if (pathname === "/home") {
    if (status === "loading") {
      return (
        <div
          className="sticky top-0 z-50 mb-0 h-[112px] w-full animate-pulse bg-neutral-100"
          aria-busy
          aria-label="Loading header"
        />
      );
    }
    if (session?.user) {
      return <LoggedInAppHeader user={session.user} isAdmin={isAdmin} homeLayout />;
    }
    return null;
  }

  if (status === "loading") {
    return (
      <div
        className="sticky top-0 z-50 mb-[50px] h-[147px] w-full animate-pulse bg-neutral-100"
        aria-busy
        aria-label="Loading header"
      />
    );
  }

  if (session?.user) {
    const flushBottom = pathname === "/profile" || pathname.startsWith("/profile/");
    return (
      <LoggedInAppHeader
        user={session.user}
        isAdmin={isAdmin}
        flushBottom={flushBottom}
      />
    );
  }

  return <GuestSiteHeader />;
}
