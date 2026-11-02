"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { CompassGlyph } from "./Compass";
import { openMentor } from "./colors";

const LINKS = [
  { href: "#about", label: "About", color: "bg-saffron" },
  { href: "#activities", label: "Activities", color: "bg-lime" },
  { href: "#mentor", label: "AI Mentor", color: "bg-rose" },
  { href: "#schedule", label: "Schedule", color: "bg-sky" },
  { href: "#faq", label: "FAQ", color: "bg-saffron" },
  { href: "#venue", label: "Venue", color: "bg-lime" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border-2 px-3 py-2 transition-colors duration-300 sm:px-4 ${
            scrolled ? "border-ink bg-paper/90 shadow-[4px_4px_0_var(--color-ink)] backdrop-blur" : "border-transparent"
          }`}
          aria-label="Main"
        >
          <a href="#top" className="flex items-center gap-2 pl-1" aria-label="Busla home">
            <CompassGlyph className="h-8 w-8 text-brick transition-transform duration-700 hover:rotate-[360deg]" />
            <span className="display text-2xl">Busla</span>
            <span className="font-[family-name:var(--font-arabic)] text-lg text-nile">بوصلة</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative inline-block overflow-hidden rounded-full px-4 py-2 font-medium"
                >
                  <span className={`absolute inset-0 translate-y-full rounded-full ${l.color} transition-transform duration-300 group-hover:translate-y-0`} />
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#register" className="btn hidden bg-brick !py-2 text-cream sm:inline-flex">
              Register free
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-saffron lg:hidden"
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
            className="fixed inset-0 z-40 flex flex-col bg-ink px-4 pb-8 pt-24 text-cream lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="flex flex-1 flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="display flex items-center gap-3 py-1 text-5xl">
                    <span className={`h-3 w-3 rounded-full ${l.color}`} />
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href="#register" onClick={() => setOpen(false)} className="btn bg-saffron text-ink">
                Register free
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  openMentor();
                }}
                className="btn bg-rose text-ink"
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
