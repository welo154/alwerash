"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SCHEDULE, type ScheduleItem } from "@/lib/event";
import { Reveal } from "./Reveal";

const TRACKS: { id: "All" | ScheduleItem["track"]; color: string }[] = [
  { id: "All", color: "bg-ink text-cream" },
  { id: "Stage", color: "bg-sky" },
  { id: "Labs", color: "bg-lime" },
  { id: "Fair", color: "bg-saffron" },
  { id: "Parents", color: "bg-rose" },
];

const DOT: Record<ScheduleItem["track"], string> = {
  Stage: "bg-sky",
  Labs: "bg-lime",
  Fair: "bg-saffron",
  Parents: "bg-rose",
};

export function Schedule() {
  const [track, setTrack] = useState<(typeof TRACKS)[number]["id"]>("All");
  const items = SCHEDULE.filter((s) => track === "All" || s.track === track);

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Reveal>
            <p className="eyebrow text-nile">Schedule</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-3 text-5xl sm:text-7xl">
              Seven hours, <span className="serif-i font-normal text-brick">well spent.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by track">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={track === t.id}
              onClick={() => setTrack(t.id)}
              className={`relative rounded-full border-2 border-ink px-4 py-2 font-bold transition-transform hover:-translate-y-0.5 ${
                track === t.id ? `${t.color} shadow-[3px_3px_0_var(--color-ink)]` : "bg-transparent"
              }`}
            >
              {t.id}
            </button>
          ))}
        </Reveal>
      </div>

      <motion.ol layout className="mt-12 border-t-2 border-ink">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((s) => (
            <motion.li
              key={s.time + s.title}
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group relative grid grid-cols-[4.5rem_1fr] items-center gap-4 overflow-hidden border-b-2 border-ink py-5 sm:grid-cols-[7rem_1fr_auto] sm:py-6"
            >
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${DOT[s.track]}`}
              />
              <time className="pl-1 font-[family-name:var(--font-mono)] text-lg font-bold sm:text-2xl">{s.time}</time>
              <div>
                <p className="display text-xl sm:text-3xl">{s.title}</p>
                <p className="mt-1 text-sm text-ink-2 sm:hidden">
                  {s.where} · {s.track}
                </p>
              </div>
              <div className="hidden items-center gap-3 pr-2 sm:flex">
                <span className="text-ink-2">{s.where}</span>
                <span className={`rounded-full border-2 border-ink px-3 py-1 text-sm font-bold ${DOT[s.track]}`}>{s.track}</span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>
    </section>
  );
}
