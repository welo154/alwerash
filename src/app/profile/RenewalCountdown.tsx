"use client";

import { useState, useEffect } from "react";

function formatCountdown(expiresAt: Date): string {
  const now = new Date();
  const diff = Math.max(0, expiresAt.getTime() - now.getTime());
  const s = Math.floor(diff / 1000) % 60;
  const m = Math.floor(diff / 60000) % 60;
  const h = Math.floor(diff / 3600000) % 24;
  const d = Math.floor(diff / 86400000) % 365;
  const y = Math.floor(diff / (365.25 * 86400000));
  return `${y}y : ${d}d : ${h}h : ${m}m : ${s}s`;
}

export function RenewalCountdown({ expiresAt }: { expiresAt: Date }) {
  const [countdown, setCountdown] = useState(() => formatCountdown(expiresAt));

  useEffect(() => {
    const t = setInterval(() => setCountdown(formatCountdown(expiresAt)), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  return <span>{countdown}</span>;
}
