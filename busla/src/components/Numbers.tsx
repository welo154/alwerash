"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { Sparkle } from "./Sparkle";

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

const TILE = "card-pop rounded-[1.75rem] p-6 sm:p-7";

export function Numbers() {
  return (
    <section aria-labelledby="numbers-title" className="border-y-4 border-ink bg-nile py-24 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 id="numbers-title" className="display text-6xl text-cream sm:text-8xl">
              Busla day,
              <br />
              by the numbers
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow rounded-full border-2 border-ink bg-lime px-3.5 py-2 font-bold">Targets for Edition 01</span>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(10rem,auto)] grid-cols-2 gap-5 lg:grid-cols-4">
          <Reveal className="col-span-2 row-span-2">
            <div className={`${TILE} relative h-full overflow-hidden bg-saffron`}>
              <p className="display text-[7rem] sm:text-[11rem]">
                <Count to={40} suffix="+" />
              </p>
              <p className="mt-2 max-w-xs text-xl font-extrabold sm:text-2xl">Universities &amp; colleges on the fair floor</p>
              <Sparkle size={170} fill="var(--color-cream)" className="absolute bottom-6 right-6 hidden sm:block" />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className={`${TILE} h-full bg-lime`}>
              <p className="display text-6xl sm:text-7xl"><Count to={60} /></p>
              <p className="mt-2 font-extrabold">Taster labs &amp; career simulations</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${TILE} h-full bg-cream`}>
              <p className="display text-6xl sm:text-7xl"><Count to={9} /></p>
              <p className="mt-2 font-extrabold">Zones, from Maker Yard to Main Stage</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={`${TILE} h-full bg-rose`}>
              <p className="display text-6xl sm:text-7xl"><Count to={1500} /></p>
              <p className="mt-2 font-extrabold">Student seats, Grades 9–12</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={`${TILE} h-full bg-cream`}>
              <p className="display text-6xl sm:text-7xl"><Count to={14} /></p>
              <p className="mt-2 font-extrabold">Sessions on the schedule</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="col-span-2 lg:col-span-1">
            <div className={`${TILE} flex h-full flex-col justify-between bg-sky`}>
              <p className="display text-6xl sm:text-7xl"><Count to={7} /> hrs</p>
              <p className="mt-2 font-extrabold">To change your mind, 10 AM – 5 PM</p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="col-span-2 lg:col-span-3">
            <div className="h-full rounded-[1.75rem] border-[3px] border-ink bg-ink p-6 text-cream shadow-[7px_7px_0_var(--color-saffron)] sm:p-8">
              <p className="display text-4xl text-saffron sm:text-6xl">One mentor in your pocket</p>
              <div className="mt-6 flex flex-wrap gap-x-14 gap-y-5">
                {[
                  ["24/7", "Compass AI, before & after", "text-lime"],
                  ["AR · EN", "And Franco, it follows you", "text-rose"],
                  ["0 EGP", "Entry, labs and mentoring", "text-sky"],
                ].map(([v, l, c]) => (
                  <div key={v}>
                    <p className={`display text-4xl ${c}`}>{v}</p>
                    <p className="text-sm font-bold text-cream/85">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
