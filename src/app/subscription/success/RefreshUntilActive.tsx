"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVAL_MS = 3000;
const MAX_TRIES = 40;

/** Re-renders the server page until the webhook has activated the membership. */
export function RefreshUntilActive() {
  const router = useRouter();

  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (tries > MAX_TRIES) {
        window.clearInterval(id);
        return;
      }
      router.refresh();
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [router]);

  return null;
}
