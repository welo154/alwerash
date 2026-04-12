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
 * Other routes: GuestSiteHeader (black) vs LoggedInAppHeader when signed in.
 */
export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdmin = Boolean((session?.user as { roles?: string[] } | undefined)?.roles?.includes("ADMIN"));

  if (pathname === "/") {
    if (status === "loading") return null;
    return null;
  }

  if (pathname === "/home") {
    if (status === "loading") {
      return (
        <div
          className="sticky top-0 z-50 h-[112px] w-full animate-pulse bg-neutral-100"
          aria-busy
          aria-label="Loading header"
        />
      );
    }
    if (session?.user) {
      return <LoggedInAppHeader user={session.user} isAdmin={isAdmin} />;
    }
    return null;
  }

  if (status === "loading") {
    return (
      <div
        className="sticky top-0 z-50 h-[80px] w-full animate-pulse bg-neutral-100"
        aria-busy
        aria-label="Loading header"
      />
    );
  }

  if (session?.user) {
    return <LoggedInAppHeader user={session.user} isAdmin={isAdmin} />;
  }

  return <GuestSiteHeader />;
}
