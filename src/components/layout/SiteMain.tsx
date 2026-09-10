"use client";

import { usePathname } from "next/navigation";

export function SiteMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isCourseAccess = pathname.startsWith("/course-access");

  return (
    <main
      className={
        isCourseAccess
          ? "mx-auto w-full max-w-[1440px] min-w-0 overflow-x-visible max-lg:flex-none lg:flex-1"
          : "mx-auto w-full max-w-[1440px] min-w-0 flex-1 overflow-x-visible"
      }
    >
      {children}
    </main>
  );
}
