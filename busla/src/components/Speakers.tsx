"use client";

import { motion } from "motion/react";
import { SPEAKERS } from "@/lib/event";
import { BG } from "./colors";
import { Reveal } from "./Reveal";

const BLOBS = [
  "rounded-[60%_40%_55%_45%/50%_60%_40%_50%]",
  "rounded-[30%]",
  "rounded-t-full",
  "rounded-full",
  "rounded-[40%_60%_30%_70%]",
  "rounded-b-full",
];

export function Speakers() {
  return (
    <section className="border-y-4 border-ink bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow text-brick">Main Stage · The Detour</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-3 max-w-3xl text-5xl sm:text-7xl">
                People who took the <span className="serif-i font-normal">long way</span> round.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <span className="inline-block -rotate-3 rounded-full border-2 border-ink bg-lime px-4 py-2 font-bold">
              Names revealed in waves. Follow us
            </span>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPEAKERS.map((s, i) => (
            <Reveal key={s.role} delay={(i % 3) * 0.1}>
              <motion.article whileHover="hover" className="card-pop group h-full overflow-hidden rounded-[2rem] bg-cream">
                <div className={`relative grid h-56 place-items-center overflow-hidden border-b-2 border-ink ${BG[s.color]}`}>
                  <motion.div
                    variants={{ hover: { rotate: 25, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className={`grid h-36 w-36 place-items-center border-2 border-ink bg-cream text-ink ${BLOBS[i % BLOBS.length]}`}
                  >
                    <motion.span variants={{ hover: { rotate: -25 } }} className="display text-4xl">
                      {s.initials}
                    </motion.span>
                  </motion.div>
                  <span className="eyebrow absolute left-4 top-4 rounded-full bg-ink px-2 py-1 !text-[0.6rem] text-cream">
                    TBA
                  </span>
                </div>
                <div className="p-6">
                  <p className="eyebrow text-nile">{s.role}</p>
                  <p className="serif-i mt-2 text-2xl leading-snug">&ldquo;{s.topic}&rdquo;</p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
