"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

const TICKS = Array.from({ length: 48 }, (_, i) => i);

/** The hero compass: the needle swings toward the pointer, with a little overshoot. */
export function Compass({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const angle = useMotionValue(-28);
  const needle = useSpring(angle, { stiffness: 60, damping: 7, mass: 1.2 });
  const dial = useTransform(needle, (a) => a * -0.15);

  useEffect(() => {
    let last = -28;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const raw = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
      // unwrap so the needle takes the short way round
      let delta = raw - (last % 360);
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      last += delta;
      angle.set(last);
    };
    // gentle idle sway for touch devices
    const idle = window.setInterval(() => {
      if (matchMedia("(hover: none)").matches) angle.set(-30 + Math.random() * 60);
    }, 2200);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearInterval(idle);
    };
  }, [angle]);

  return (
    <svg ref={ref} viewBox="0 0 400 400" className={className} role="img" aria-label="Busla compass">
      <circle cx="200" cy="200" r="192" fill="var(--color-saffron)" stroke="var(--color-ink)" strokeWidth="6" />
      <motion.g style={{ rotate: dial, originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="200" r="160" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="4" />
        {TICKS.map((i) => {
          const long = i % 12 === 0;
          const mid = i % 4 === 0;
          return (
            <line
              key={i}
              x1="200"
              y1={long ? 48 : 52}
              x2="200"
              y2={long ? 76 : mid ? 68 : 62}
              stroke="var(--color-ink)"
              strokeWidth={long ? 5 : 2.5}
              strokeLinecap="round"
              transform={`rotate(${i * 7.5} 200 200)`}
            />
          );
        })}
        {[
          ["N", 0, "var(--color-brick)"],
          ["E", 90, "var(--color-ink)"],
          ["S", 180, "var(--color-ink)"],
          ["W", 270, "var(--color-ink)"],
        ].map(([l, a, c]) => (
          <text
            key={l as string}
            x="200"
            y="108"
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill={c as string}
            style={{ fontFamily: "var(--font-display)" }}
            transform={`rotate(${a} 200 200)`}
          >
            {l}
          </text>
        ))}
        <circle cx="200" cy="200" r="70" fill="none" stroke="var(--color-nile)" strokeWidth="3" strokeDasharray="4 9" />
      </motion.g>
      <motion.g style={{ rotate: needle, originX: "200px", originY: "200px" }}>
        <path d="M200 56 L226 200 L200 344 L174 200 Z" fill="var(--color-ink)" />
        <path d="M200 56 L226 200 L174 200 Z" fill="var(--color-brick)" />
        <path d="M200 56 L226 200 L174 200 Z" fill="none" stroke="var(--color-ink)" strokeWidth="4" strokeLinejoin="round" />
      </motion.g>
      <circle cx="200" cy="200" r="16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="5" />
    </svg>
  );
}

export function CompassGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 5 L20 16 L16 27 L12 16 Z" fill="currentColor" />
    </svg>
  );
}
