"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LandingMobileFooter } from "@/components/landing/LandingMobileFooter";
import { SiteFooter } from "./SiteFooter";

type FooterMenuLink = { label: string; href: string };

/** Hide global footer on auth flows (login, sign-up, register sub-routes). */
export function ConditionalSiteFooter() {
  const pathname = usePathname() ?? "";
  const [menu, setMenu] = useState<{ allCourses: FooterMenuLink[]; software: FooterMenuLink[] }>({
    allCourses: [],
    software: [],
  });

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/catalog/courses-menu", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as {
          allCourses?: FooterMenuLink[];
          software?: FooterMenuLink[];
        };
        if (!Array.isArray(data.allCourses) || !Array.isArray(data.software)) return null;
        return { allCourses: data.allCourses, software: data.software };
      })
      .then((next) => {
        if (!cancelled && next) setMenu(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/")) {
    return null;
  }

  return (
    <>
      <div className="overflow-x-clip bg-white lg:hidden min-[744px]:overflow-hidden">
        <div className="mx-auto flex w-full max-w-[393px] flex-col items-center px-0 pb-0 min-[744px]:max-w-[744px]">
          <LandingMobileFooter courseLinks={menu.allCourses} softwareLinks={menu.software} />
        </div>
      </div>
      <div className="max-lg:hidden">
        <SiteFooter courseLinks={menu.allCourses} softwareLinks={menu.software} />
      </div>
    </>
  );
}
