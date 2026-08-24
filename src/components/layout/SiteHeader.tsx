"use client";

import { useEffect, useState } from "react";
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
  const { data: session } = useSession();
  const pathname = usePathname() ?? "";
  const [mounted, setMounted] = useState(false);
  const isAdmin = Boolean((session?.user as { roles?: string[] } | undefined)?.roles?.includes("ADMIN"));

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? session?.user : undefined;

  if (pathname === "/") {
    return null;
  }

  if (pathname === "/home") {
    if (user) {
      return <LoggedInAppHeader user={user} isAdmin={isAdmin} homeLayout />;
    }
    return null;
  }

  if (user) {
    const flushBottom =
      pathname === "/course" ||
      pathname.startsWith("/course/") ||
      pathname.startsWith("/course-access") ||
      pathname.startsWith("/tracks/") ||
      pathname === "/profile" ||
      pathname.startsWith("/profile/");
    return (
      <LoggedInAppHeader
        user={user}
        isAdmin={isAdmin}
        flushBottom={flushBottom}
      />
    );
  }

  return (
    <GuestSiteHeader
      flushBottom={
        pathname === "/course" ||
        pathname.startsWith("/course/") ||
        pathname.startsWith("/course-access") ||
        pathname.startsWith("/tracks/")
      }
    />
  );
}
