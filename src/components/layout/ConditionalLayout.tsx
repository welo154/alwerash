"use client";

import { usePathname } from "next/navigation";
import { SiteLayout } from "./SiteLayout";
import { AdminLayout } from "./AdminLayout";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  return <SiteLayout>{children}</SiteLayout>;
}
