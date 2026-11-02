"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { CompassGlyph } from "./Compass";
import { CountdownInline } from "./Countdown";
import { openMentor } from "./colors";

const LINKS = [
  { href: "#about", label: "About", color: "bg-saffron" },
  { href: "#activities", label: "Zones", color: "bg-lime" },
  { href: "#mentor", label: "Compass AI", color: "bg-rose" },
  { href: "#schedule", label: "Schedule", color: "bg-sky" },
  { href: "#faq", label: "FAQ", color: "bg-saffron" },
  { href: "#venue", label: "Venue", color: "bg-lime" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 500 && y > prev && !open);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b-[3px] border-ink bg-ink text-cream"
        animate={{ y: hidden ? -90 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="mx-auto flex h-[68px] max-w-[90rem] items-center gap-6 px-4 sm:px-6 lg:px-10" aria-label="Main">
          <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="Busla home">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-cream bg-saffron text-ink transition-transform duration-700 hover:rotate-[360deg]">
              <CompassGlyph className="h-6 w-6" />
            </span>
            <span className="display text-3xl">Busla</span>
          </a>

          <ul className="hidden items-center gap-1 xl:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative inline-block overflow-hidden rounded-lg px-3 py-1.5 font-bold">
                  <span className={`absolute inset-0 translate-y-full rounded-lg ${l.color} transition-transform duration-300 group-hover:translate-y-0`} />
                  <span className="relative transition-colors group-hover:text-ink">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <CountdownInline className="ml-auto hidden md:flex" />
          <span className="hidden h-8 w-0.5 bg-cream/25 md:block" aria-hidden />

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a
              href="#register"
              className="hidden rounded-xl border-2 border-cream bg-saffron px-4 py-2 font-[family-name:var(--font-display)] font-extrabold text-ink transition-transform hover:-translate-y-0.5 sm:inline-block"
            >
              Register free
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-xl border-2 border-cream bg-saffron xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="dots fixed inset-0 z-40 flex flex-col bg-sky px-4 pb-8 pt-24 text-ink xl:hidden"
            initial={{ clipPath: "circle(0% at 94% 4%)" }}
            animate={{ clipPath: "circle(150% at 94% 4%)" }}
            exit={{ clipPath: "circle(0% at 94% 4%)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="flex flex-1 flex-col gap-3">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`display inline-block rounded-2xl border-[3px] border-ink px-4 pb-1 pt-3 text-5xl shadow-[4px_4px_0_var(--color-ink)] ${l.color}`}
                    style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href="#register" onClick={() => setOpen(false)} className="btn bg-saffron">
                Register free
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  openMentor();
                }}
                className="btn bg-ink text-cream"
              >
                Ask Compass
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
