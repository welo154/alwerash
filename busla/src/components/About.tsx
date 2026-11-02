"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/event";
import { Reveal, WordsUp } from "./Reveal";

const STAT_COLORS = ["bg-saffron", "bg-sky", "bg-lime", "bg-rose"];
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function Counter({ to, suffix }: { to: number; suffix: string }) {
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

const AUDIENCE = [
  {
    who: "Students",
    detail: "Grades 9 to 12, any curriculum",
    body: "Test-drive majors before you commit four-plus years to one. Leave with a shortlist, not a headache.",
    color: "bg-nile text-cream",
    icon: "✎",
  },
  {
    who: "Parents",
    detail: "Your own lounge & sessions",
    body: "Get straight answers on costs, admissions and the job market, and see your teen light up at something.",
    color: "bg-brick text-cream",
    icon: "☕",
  },
  {
    who: "Schools",
    detail: "Counselors & teachers",
    body: "Bring a group, get a counselor pack, and follow up with students using the same Compass mentor.",
    color: "bg-saffron text-ink",
    icon: "⌂",
  },
];

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Reveal>
            <p className="eyebrow text-brick">What is Busla?</p>
          </Reveal>
          <h2 className="display mt-4 text-5xl sm:text-7xl">
            <WordsUp text="Choosing a major" />
            <br />
            <WordsUp text="shouldn't feel like" delay={0.15} className="serif-i font-normal" />
            <br />
            <WordsUp text="a coin toss." delay={0.3} className="scribble" />
          </h2>
        </div>
        <Reveal delay={0.2} className="space-y-6 self-end text-lg leading-relaxed text-ink-2">
          <p>
            <span className="font-[family-name:var(--font-arabic)] text-2xl text-nile">بوصلة</span> means{" "}
            <em>compass</em>. Busla is a one-day discovery festival at Seven Pillars School where high-school students
            stop guessing and start trying: sitting a real first-year lecture, running a mock ER, pitching a startup,
            and asking university students the questions nobody puts in a brochure.
          </p>
          <p>
            Before you arrive, <strong>Compass</strong>, our AI mentor, gets to know what you love and maps out the labs,
            talks and university booths worth your day.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <motion.div
              whileHover={{ rotate: 0, y: -6 }}
              className={`card-pop ${STAT_COLORS[i]} ${TILTS[i]} rounded-3xl p-5 sm:p-7`}
            >
              <p className="display text-5xl sm:text-6xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 font-medium">{s.label}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="eyebrow text-nile">Built for</p>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.who} delay={i * 0.1}>
              <div className={`card-pop group relative h-full overflow-hidden rounded-[2rem] p-7 ${a.color}`}>
                <span
                  aria-hidden
                  className="absolute -right-4 -top-6 text-[8rem] leading-none opacity-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                >
                  {a.icon}
                </span>
                <h3 className="display text-4xl">{a.who}</h3>
                <p className="eyebrow mt-2 opacity-80">{a.detail}</p>
                <p className="mt-6 text-lg leading-relaxed">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
