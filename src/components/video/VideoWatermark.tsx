"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Per-viewer watermark overlay.
 *
 * Purpose is attribution, not prevention: signed URLs and device limits stop
 * casual sharing, but nothing can stop someone screen-recording content they are
 * legitimately watching. A marker burned into that recording makes the leak
 * traceable to an account.
 *
 * The text is an opaque marker derived server-side (see server/video/watermark.ts).
 * It is never an email address or user id, so a leaked frame exposes no personal
 * data to third parties.
 *
 * This is a client-side overlay, so a technical user can remove it with devtools
 * before recording. Defeating that would require server-side burn-in during
 * transcoding, which Mux does not offer on the current plan and which would break
 * per-viewer marking anyway (one encode serves everyone).
 */

/**
 * Anchor points, kept clear of the bottom control bar and of dead centre.
 * Cycling between them means a crop that removes the marker in one position
 * will not remove it in the next.
 */
const POSITIONS = [
  { top: "7%", left: "6%" },
  { top: "7%", left: "62%" },
  { top: "32%", left: "10%" },
  { top: "32%", left: "58%" },
  { top: "58%", left: "6%" },
  { top: "58%", left: "62%" },
] as const;

const CYCLE_MS = 25_000;
const MOVE_DURATION = "2s";

export const WATERMARK_POSITION_COUNT = POSITIONS.length;

/** Stagger the starting anchor per viewer so the pattern is not uniform. */
export function startIndex(text: string): number {
  let sum = 0;
  for (let i = 0; i < text.length; i += 1) {
    sum = (sum * 31 + text.charCodeAt(i)) % 9973;
  }
  return sum % POSITIONS.length;
}

export function VideoWatermark({ text }: { text: string }) {
  const first = useMemo(() => startIndex(text), [text]);
  const [index, setIndex] = useState(first);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setIndex(first);
  }, [first]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % POSITIONS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Drifting text is uncomfortable for some viewers; still reposition, just jump.
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimate(!query.matches);
    const onChange = (e: MediaQueryListEvent) => setAnimate(!e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const position = POSITIONS[index];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        className="absolute select-none whitespace-nowrap"
        style={{
          top: position.top,
          left: position.left,
          transition: animate
            ? `top ${MOVE_DURATION} ease-in-out, left ${MOVE_DURATION} ease-in-out`
            : undefined,
          maxWidth: "34%",
          overflow: "hidden",
          color: "rgba(255, 255, 255, 0.32)",
          // Keeps the marker legible over both bright and dark frames.
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
          fontSize: "clamp(9px, 1vw, 13px)",
          letterSpacing: "0.08em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {text}
      </span>
    </div>
  );
}
