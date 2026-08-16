"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/** Stitch Clarity sessions to a logged-in user id (never email). */
export function MicrosoftClarityIdentify({ userId }: { userId: string }) {
  useEffect(() => {
    if (!userId) return;

    const tryIdentify = () => {
      if (typeof window.clarity === "function") {
        window.clarity("identify", userId);
        return true;
      }
      return false;
    };

    if (tryIdentify()) return;

    const interval = window.setInterval(() => {
      if (tryIdentify()) window.clearInterval(interval);
    }, 400);

    const timeout = window.setTimeout(() => window.clearInterval(interval), 15_000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [userId]);

  return null;
}
