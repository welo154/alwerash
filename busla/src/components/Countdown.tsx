"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event";

type Parts = { days: number; hours: number; mins: number; secs: number };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    mins: Math.floor((ms / 60_000) % 60),
    secs: Math.floor((ms / 1000) % 60),
  };
}

export function useCountdown() {
  const target = new Date(EVENT.date).getTime();
  const [t, setT] = useState<Parts | null>(null);
  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

const pad = (n: number | undefined, len = 2) => (n === undefined ? "--" : String(n).padStart(len, "0"));

function Flip({ text }: { text: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          className="block"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Tile countdown used on the ticket. */
export function CountdownTiles({ className = "" }: { className?: string }) {
  const t = useCountdown();
  const cells = [
    { v: pad(t?.days), l: "Days" },
    { v: pad(t?.hours), l: "Hours" },
    { v: pad(t?.mins), l: "Min" },
    { v: pad(t?.secs), l: "Sec", accent: true },
  ];
  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`} role="timer" aria-label="Countdown to the event">
      {cells.map((c) => (
        <div
          key={c.l}
          className={`rounded-xl border-[3px] border-ink py-1.5 text-center shadow-[3px_3px_0_var(--color-ink)] ${c.accent ? "bg-saffron" : "bg-paper"}`}
        >
          <div className="display text-3xl tabular-nums sm:text-4xl">
            <Flip text={c.v} />
          </div>
          <div className="eyebrow !text-[0.6rem]">{c.l}</div>
        </div>
      ))}
    </div>
  );
}

/** Compact inline countdown for the nav bar. */
export function CountdownInline({ className = "" }: { className?: string }) {
  const t = useCountdown();
  const cells = [
    { v: pad(t?.days), l: "Days" },
    { v: pad(t?.hours), l: "Hrs" },
    { v: pad(t?.mins), l: "Min" },
    { v: pad(t?.secs), l: "Sec" },
  ];
  return (
    <div className={`flex items-baseline gap-3 ${className}`} aria-hidden>
      {cells.map((c) => (
        <span key={c.l} className="flex items-baseline gap-1 text-xs text-cream/70">
          <span className="display text-2xl tabular-nums text-saffron">
            <Flip text={c.v} />
          </span>
          {c.l}
        </span>
      ))}
    </div>
  );
}
