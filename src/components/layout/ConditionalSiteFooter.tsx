"use client";

import { usePathname } from "next/navigation";
import { LandingMobileFooter } from "@/components/landing/LandingMobileFooter";
import { SiteFooter } from "./SiteFooter";

/** Hide global footer on auth flows (login, sign-up, register sub-routes). */
export function ConditionalSiteFooter() {
  const pathname = usePathname() ?? "";

  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/")) {
    return null;
  }

  return (
    <>
      <div className="overflow-x-clip bg-white lg:hidden min-[744px]:overflow-hidden">
        <div className="mx-auto flex w-full max-w-[393px] flex-col items-center px-0 pb-0 min-[744px]:max-w-[744px]">
          <LandingMobileFooter />
        </div>
      </div>
      <div className="max-lg:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
