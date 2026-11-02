"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, type Activity } from "@/lib/event";
import { BG, openMentor } from "./colors";
import { Reveal } from "./Reveal";

const SHAPES = [
  "rounded-full",
  "rounded-none rotate-45",
  "rounded-tl-full",
  "rounded-[40%_60%_55%_45%]",
  "rounded-br-full",
];

function Card({ a, i }: { a: Activity; i: number }) {
  return (
    <article
      className={`card-pop group relative flex h-[30rem] w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] p-7 sm:w-[24rem] ${BG[a.color]}`}
    >
      <span
        aria-hidden
        className={`absolute -bottom-10 -right-10 h-44 w-44 border-2 border-current opacity-25 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-[30deg] ${SHAPES[i % SHAPES.length]}`}
      />
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-sm">{String(i + 1).padStart(2, "0")}</span>
        <span className="eyebrow rounded-full border-2 border-current px-3 py-1 !text-[0.65rem]">{a.zone}</span>
      </div>
      <p className="serif-i mt-10 text-2xl opacity-90">{a.kicker}</p>
      <h3 className="display mt-1 text-4xl">{a.title}</h3>
      <p className="mt-4 leading-relaxed opacity-90">{a.blurb}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {a.tags.map((t) => (
          <span key={t} className="rounded-full bg-paper/25 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            #{t.replace(/\s/g, "")}
          </span>
        ))}
      </div>
      <button
        onClick={() => openMentor(`Is "${a.title}" a good fit for me? Ask me a couple of questions first.`)}
        className="mt-5 self-start text-sm font-bold underline decoration-2 underline-offset-4 opacity-90 hover:opacity-100"
      >
        Is this for me? Ask Compass →
      </button>
    </article>
  );
}

export function Activities() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setPinned(mq.matches);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
    };
    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -distance]), { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const header = (
    <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
      <div>
        <Reveal>
          <p className="eyebrow text-saffron">The day, zone by zone</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-3 text-5xl text-cream sm:text-7xl">
            Don&apos;t just hear about it. <span className="serif-i font-normal text-rose">Try it.</span>
          </h2>
        </Reveal>
      </div>
      <Reveal delay={0.2} className="max-w-sm text-cream/80">
        Nine zones running all day. Wander, or let Compass build you a route.
      </Reveal>
    </div>
  );

  return (
    <section
      id="activities"
      ref={section}
      className="relative bg-ink"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-24"}>
        {header}
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`mt-12 flex gap-6 px-4 sm:px-6 ${
            pinned ? "w-max" : "snap-x snap-mandatory overflow-x-auto pb-6 [scrollbar-width:none]"
          }`}
        >
          {ACTIVITIES.map((a, i) => (
            <Card key={a.id} a={a} i={i} />
          ))}
          <div className="flex h-[30rem] w-[82vw] shrink-0 snap-start flex-col justify-center rounded-[2rem] border-2 border-dashed border-cream/40 p-8 text-cream sm:w-[22rem]">
            <p className="display text-4xl">Not sure where to start?</p>
            <button onClick={() => openMentor("Build me a route for the day based on my interests.")} className="btn mt-6 self-start bg-saffron text-ink">
              Plan my day 🧭
            </button>
          </div>
        </motion.div>
        {pinned && (
          <div className="mx-auto mt-10 h-1.5 w-[min(32rem,80vw)] overflow-hidden rounded-full bg-cream/15">
            <motion.div className="h-full rounded-full bg-saffron" style={{ width: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}
