"use client";

import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { openMentor } from "./colors";
import { CompassGlyph } from "./Compass";
import { Magnetic } from "./Magnetic";

const PROMPTS = [
  "I love drawing and video games. What should I study?",
  "Medicine or engineering? I like both.",
  "أنا شاطر في الرياضة بس مش عارف أدخل إيه",
  "My parents want medicine, I want design. Help.",
];

const DEMO = [
  { from: "me", text: "I'm in Grade 11, IGCSE. I like fixing stuff and I'm decent at physics." },
  { from: "bot", text: "Nice combo. Do you prefer figuring out *why* something broke, or designing something new?" },
  { from: "me", text: "Designing new things, honestly." },
  {
    from: "bot",
    text: "Then look at Mechatronics and Architectural Engineering. At Busla, hit the Maker Yard robotics arena at 14:30 and the bridge challenge in Career Simulations.",
  },
];

export function MentorSection() {
  return (
    <section id="mentor" className="relative overflow-hidden bg-rose py-24 sm:py-32">
      <div aria-hidden className="absolute -left-16 top-10 h-56 w-56 animate-spin-slow rounded-full border-[3px] border-dashed border-ink/30" />
      <div aria-hidden className="absolute -bottom-24 right-[-5rem] h-80 w-80 rounded-full bg-saffron" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-2">
              <CompassGlyph className="h-4 w-4 text-brick" /> Meet Compass
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-4 text-5xl sm:text-7xl">
              A mentor that asks <span className="serif-i font-normal">you</span> questions first.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed">
              Tell Compass what you enjoy, how you like to work, and what scares you about choosing. It suggests majors
              worth exploring, the exact Busla sessions to attend, and what to ask the universities. Arabic, English, or
              Franco: it follows your lead.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
            {PROMPTS.map((p) => (
              <motion.button
                key={p}
                whileHover={{ y: -3, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openMentor(p)}
                dir="auto"
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2.5 text-left text-sm font-medium shadow-[3px_3px_0_var(--color-ink)]"
              >
                {p}
              </motion.button>
            ))}
          </Reveal>
          <Reveal delay={0.4} className="mt-10">
            <Magnetic>
              <button onClick={() => openMentor()} className="btn bg-ink text-lg text-cream">
                Start a conversation <span aria-hidden>→</span>
              </button>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="card-pop relative mx-auto max-w-md rotate-2 rounded-[2rem] bg-cream p-5 transition-transform hover:rotate-0">
            <div className="flex items-center gap-3 border-b-2 border-ink/10 pb-4">
              <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-saffron">
                <CompassGlyph className="h-6 w-6 text-ink" />
              </span>
              <div>
                <p className="display text-lg">Compass</p>
                <p className="text-xs text-nile">● online · replies in seconds</p>
              </div>
            </div>
            <div className="space-y-3 pt-4">
              {DEMO.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.55, type: "spring", stiffness: 200, damping: 20 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "me" ? "ml-auto rounded-br-sm bg-nile text-cream" : "rounded-bl-sm border-2 border-ink bg-paper"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
