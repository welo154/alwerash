"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    mins: Math.floor((ms / 60_000) % 60),
    secs: Math.floor((ms / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[1.1em] overflow-hidden font-[family-name:var(--font-mono)] text-3xl font-bold tabular-nums sm:text-4xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="eyebrow mt-1 !text-[0.65rem] opacity-70">{label}</span>
    </div>
  );
}

export function Countdown({ className = "" }: { className?: string }) {
  const target = new Date(EVENT.date).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const done = t && t.days + t.hours + t.mins + t.secs === 0;
  if (done) return <p className={`display text-3xl ${className}`}>It&apos;s happening today ✦</p>;

  return (
    <div className={`flex items-end gap-3 sm:gap-5 ${className}`} aria-label="Countdown to the event" role="timer">
      <Digit value={t?.days ?? null} label="days" />
      <span className="pb-6 text-2xl opacity-40">:</span>
      <Digit value={t?.hours ?? null} label="hrs" />
      <span className="pb-6 text-2xl opacity-40">:</span>
      <Digit value={t?.mins ?? null} label="min" />
      <span className="pb-6 text-2xl opacity-40">:</span>
      <Digit value={t?.secs ?? null} label="sec" />
    </div>
  );
}
