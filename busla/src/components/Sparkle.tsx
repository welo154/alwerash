"use client";

import { motion } from "motion/react";

/** Four-point "compass spark" from the mood board. Decorative. */
export function Sparkle({
  size = 48,
  fill = "var(--color-saffron)",
  className = "",
  spin = true,
  delay = 0,
}: {
  size?: number;
  fill?: string;
  className?: string;
  spin?: boolean;
  delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={`pointer-events-none ${className}`}
      initial={{ scale: 0, rotate: -90 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 180, damping: 12, delay }}
    >
      <motion.path
        d="M50 4 C54 36 64 46 96 50 C64 54 54 64 50 96 C46 64 36 54 4 50 C36 46 46 36 50 4Z"
        fill={fill}
        stroke="var(--color-ink)"
        strokeWidth={size > 80 ? 3.5 : 5.5}
        strokeLinejoin="round"
        style={{ originX: "50px", originY: "50px" }}
        animate={spin ? { rotate: [0, 12, -8, 0], scale: [1, 1.08, 0.96, 1] } : undefined}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      />
    </motion.svg>
  );
}
