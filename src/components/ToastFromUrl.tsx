"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "./Toast";

/** Reads ?toast= from URL, shows toast, then removes the param. */
export function ToastFromUrl() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const msg = searchParams.get("toast");
    if (!msg) return;
    toast(decodeURIComponent(msg));
    const next = new URLSearchParams(searchParams);
    next.delete("toast");
    const q = next.toString();
    router.replace(pathname + (q ? `?${q}` : ""));
  }, [searchParams, pathname, router, toast]);

  return null;
}
