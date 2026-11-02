"use client";

import { motion } from "motion/react";
import { Compass } from "./Compass";
import { Reveal, WordsUp } from "./Reveal";
import { Sparkle } from "./Sparkle";

const CHIPS = [
  { t: "Taster labs", c: "bg-saffron" },
  { t: "Career simulations", c: "bg-sky" },
  { t: "Mentor circles", c: "bg-rose" },
  { t: "Compass AI", c: "bg-ink text-cream" },
];

const AUDIENCE = [
  { who: "Students", detail: "Grades 9 to 12, any curriculum", body: "Test-drive majors before you commit four-plus years to one. Leave with a shortlist, not a headache.", color: "bg-saffron" },
  { who: "Parents", detail: "Your own lounge & sessions", body: "Straight answers on costs, admissions and the job market, and a chance to see your teen light up.", color: "bg-rose" },
  { who: "Schools", detail: "Counselors & teachers", body: "Bring a group, get a counselor pack, and follow up with students using the same Compass mentor.", color: "bg-lime" },
];

export function About() {
  return (
    <section id="about" className="bg-cream">
      <div className="mx-auto grid max-w-[90rem] items-center gap-16 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:px-10">
        <div className="flex flex-col gap-7">
          <Reveal>
            <p className="eyebrow font-bold text-nile">What is Busla?</p>
          </Reveal>
          <h2 className="display text-6xl sm:text-8xl">
            <WordsUp text="One day to find" />
            <br />
            <WordsUp text="which way" delay={0.12} />
            <WordsUp text="is north." delay={0.24} className="text-brick" />
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-xl text-lg leading-relaxed sm:text-xl">
              Busla is a discovery day at Seven Pillars School for students in Grades 9–12. Sit a real first-year class, run
              a mock ER, pitch a startup, and ask university students the questions no brochure answers.{" "}
              <span className="serif-i text-2xl sm:text-3xl">Then leave with a plan.</span>
            </p>
          </Reveal>
          <Reveal delay={0.3} className="flex flex-wrap gap-3">
            {CHIPS.map((c, i) => (
              <motion.span
                key={c.t}
                className={`chip ${c.c}`}
                whileHover={{ y: -4, rotate: i % 2 ? 3 : -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                {c.t}
              </motion.span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative mx-auto aspect-[1/1.05] w-full max-w-[36rem]">
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[2.2rem] border-4 border-ink bg-nile shadow-[14px_14px_0_var(--color-ink)]"
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 2 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 60, damping: 10, delay: 0.3 }}
          >
            <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,250,240,0.08)_0_18px,transparent_18px_36px)]" />
            <div className="absolute inset-[14%]">
              <div aria-hidden className="absolute inset-2 translate-x-2.5 translate-y-2.5 rounded-full bg-ink" />
              <Compass className="relative h-full w-full" />
            </div>
            <p className="eyebrow absolute bottom-5 left-5 rounded-lg bg-ink/70 px-3 py-2 text-cream">Move your cursor. It follows.</p>
          </motion.div>
          <motion.span
            className="display absolute -left-5 top-8 rounded-xl border-[3px] border-ink bg-cream px-4 pb-1 pt-2.5 text-2xl shadow-[5px_5px_0_var(--color-ink)]"
            initial={{ rotate: -30, scale: 0 }}
            whileInView={{ rotate: -8, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.6 }}
          >
            Edition 01
          </motion.span>
          <Sparkle size={96} fill="var(--color-lime)" className="absolute -right-2 -top-10 sm:-right-8" delay={0.5} />
          <Sparkle size={54} fill="var(--color-rose)" className="absolute -bottom-8 right-6" delay={0.7} />
        </Reveal>
      </div>

      <div className="mx-auto max-w-[90rem] px-4 pb-24 sm:px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow font-bold text-nile">Built for</p>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.who} delay={i * 0.1}>
              <div className={`card-pop h-full rounded-[1.75rem] p-7 ${a.color}`}>
                <h3 className="display text-5xl">{a.who}</h3>
                <p className="eyebrow mt-3 font-bold">{a.detail}</p>
                <p className="mt-5 text-lg leading-relaxed">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
