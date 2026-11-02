"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FAQ as ITEMS } from "@/lib/event";
import { Reveal } from "./Reveal";

const ACCENTS = ["bg-saffron", "bg-sky", "bg-lime", "bg-rose", "bg-saffron", "bg-sky"];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <Reveal>
          <p className="eyebrow text-brick">FAQ</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-3 text-5xl sm:text-7xl">
            Good <span className="serif-i font-normal">questions.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-sm text-lg text-ink-2">
            Didn&apos;t find yours? Ask Compass (bottom right) or drop us a line below.
          </p>
        </Reveal>
      </div>
      <div className="space-y-4">
        {ITEMS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className={`overflow-hidden rounded-3xl border-2 border-ink transition-colors duration-300 ${isOpen ? ACCENTS[i] : "bg-cream"}`}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <span className="display text-xl sm:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-2xl leading-none"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-6 pb-6 text-lg leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
