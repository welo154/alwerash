"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";

/** Hide global footer on auth flows (login, sign-up, register sub-routes). */
export function ConditionalSiteFooter() {
  const pathname = usePathname() ?? "";

  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/")) {
    return null;
  }

  return <SiteFooter />;
}
