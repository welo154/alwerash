"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EVENT } from "@/lib/event";
import { Compass } from "./Compass";
import { Countdown } from "./Countdown";
import { Magnetic } from "./Magnetic";
import { openMentor } from "./colors";

const ease = [0.16, 1, 0.3, 1] as const;

const STICKERS = [
  { text: "Free entry", cls: "bg-lime -rotate-6", pos: "left-[2%] top-[10%]" },
  { text: "Grades 9–12", cls: "bg-sky rotate-6", pos: "right-[0%] top-[22%]" },
  { text: "40+ universities", cls: "bg-rose -rotate-3", pos: "left-[-4%] bottom-[16%]" },
  { text: "AI mentor inside", cls: "bg-cream rotate-3", pos: "right-[4%] bottom-[4%]" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const compassY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const compassR = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const blockY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blockY2 = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pb-16 pt-28 sm:pt-32">
      {/* poster shapes */}
      <motion.div style={{ y: blockY }} aria-hidden className="absolute -left-28 top-[58rem] h-64 w-64 rounded-full bg-nile sm:h-80 sm:w-80 lg:top-[36rem]" />
      <motion.div style={{ y: blockY2 }} aria-hidden className="absolute -right-10 top-[40rem] h-40 w-72 rounded-tl-[120px] bg-brick sm:w-[28rem] lg:top-24" />
      <motion.div style={{ y: blockY }} aria-hidden className="absolute bottom-10 left-1/3 h-24 w-24 rotate-12 bg-lime" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative z-10">
          <motion.p
            className="eyebrow inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-brick" />
            {EVENT.edition} · University & Career Discovery Day
          </motion.p>

          <h1 className="display mt-6 text-[clamp(3.4rem,11vw,9.5rem)]">
            {["Find", "your"].map((w, i) => (
              <span key={w} className="mr-[0.2em] inline-block overflow-hidden pb-[0.06em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.08, ease }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <motion.span
                className="serif-i inline-block text-brick"
                initial={{ y: "105%", rotate: 6 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease }}
              >
                north
              </motion.span>
            </span>
            <motion.span
              className="inline-block text-nile"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.9, stiffness: 300, damping: 12 }}
            >
              .
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            One day of universities, real taster classes and hands-on career simulations for high-schoolers who
            aren&apos;t sure what comes next. <span className="serif-i text-2xl">So, everyone.</span>
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease }}
          >
            <Magnetic>
              <a href="#register" className="btn bg-brick text-lg text-cream">
                Save my free spot
                <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <button onClick={() => openMentor()} className="btn bg-cream text-lg">
                <span aria-hidden>🧭</span> Ask the AI mentor
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[min(30rem,88vw)]"
          style={{ y: compassY, rotate: compassR }}
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
        >
          <div className="absolute inset-3 translate-x-3 translate-y-3 rounded-full bg-ink" aria-hidden />
          <Compass className="relative h-full w-full" />
          {STICKERS.map((s, i) => (
            <motion.span
              key={s.text}
              className={`absolute ${s.pos} ${s.cls} rounded-full border-2 border-ink px-4 py-2 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)] sm:text-base`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 1 + i * 0.12, stiffness: 260, damping: 14 }}
              whileHover={{ scale: 1.12, rotate: 0 }}
            >
              {s.text}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* info strip */}
      <motion.div
        className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease }}
      >
        <div className="card-pop grid overflow-hidden rounded-3xl bg-cream md:grid-cols-[1fr_1fr_auto]">
          <div className="border-b-2 border-ink p-5 md:border-b-0 md:border-r-2">
            <p className="eyebrow text-nile">When</p>
            <p className="display mt-1 text-2xl">{EVENT.dateLabel}</p>
            <p className="text-ink-2">{EVENT.hours}</p>
          </div>
          <div className="border-b-2 border-ink p-5 md:border-b-0 md:border-r-2">
            <p className="eyebrow text-nile">Where</p>
            <p className="display mt-1 text-2xl">{EVENT.venue}</p>
            <p className="text-ink-2">{EVENT.area}</p>
          </div>
          <div className="bg-ink p-5 text-saffron">
            <p className="eyebrow mb-2 text-cream/70">Doors open in</p>
            <Countdown />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
