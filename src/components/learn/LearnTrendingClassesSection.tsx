"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnClassesCarouselHeading } from "@/components/learn/LearnClassesCarouselHeading";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

const CARD_GAP = 18;
const CARD_STEP = LEARN_POPULAR_FIGMA_TILE_W + CARD_GAP;
/** Slow continuous drift — bumped 30% faster than prior marquee speed. */
const MARQUEE_PIXELS_PER_SECOND = 47;

type LoopTile = LearnPopularTile & { loopKey: string };

function buildMarqueeTiles(tiles: LearnPopularTile[]): LoopTile[] {
  if (tiles.length === 0) return [];
  const copies = tiles.length < 4 ? 3 : 2;
  const result: LoopTile[] = [];
  for (let round = 0; round < copies; round += 1) {
    for (const tile of tiles) {
      result.push({ ...tile, loopKey: `${tile.id}-m${round}` });
    }
  }
  return result;
}

export function LearnTrendingClassesSection({
  tiles = [],
  /**
   * `true` — full viewport breakout (centered).
   * `false` — stay inside the parent column.
   * `"right"` — keep the left edge, bleed to the viewport’s right edge (no white gutter).
   */
  fullBleed = true,
}: {
  tiles?: LearnPopularTile[];
  fullBleed?: boolean | "right";
}) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const bleedWrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const bleedRight = fullBleed === "right";
  const bleedWidth = useBleedRightToViewport(bleedWrapRef, bleedRight);

  const marqueeTiles = useMemo(() => buildMarqueeTiles(tiles), [tiles]);
  const copyCount = tiles.length > 0 ? marqueeTiles.length / tiles.length : 1;
  const loopWidthRef = useRef(0);

  const applyOffset = useCallback((px: number) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return;
    let next = px % loopWidth;
    if (next < 0) next += loopWidth;
    offsetRef.current = next;
    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(-${next}px, 0, 0)`;
  }, []);

  const nudge = useCallback(
    (deltaPx: number) => {
      applyOffset(offsetRef.current + deltaPx);
    },
    [applyOffset]
  );

  /** Next moves the strip rightward (cards travel to the right). */
  const slideNext = useCallback(() => nudge(-CARD_STEP), [nudge]);
  const slidePrev = useCallback(() => nudge(CARD_STEP), [nudge]);

  useEffect(() => {
    pausedRef.current = paused || reduceMotion;
  }, [paused, reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || copyCount < 1) return;

    const syncLoopWidth = () => {
      loopWidthRef.current = track.scrollWidth / copyCount;
    };

    syncLoopWidth();
    const ro = new ResizeObserver(syncLoopWidth);
    ro.observe(track);
    return () => ro.disconnect();
  }, [copyCount, marqueeTiles]);

  useEffect(() => {
    if (loopWidthRef.current <= 0) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current) {
        // Negative delta → strip moves right.
        applyOffset(offsetRef.current - MARQUEE_PIXELS_PER_SECOND * dt);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyOffset]);

  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      nudge(e.deltaX);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [nudge]);

  if (tiles.length === 0) return null;

  return (
    <div className="min-w-0 w-full max-w-full">
      <LearnClassesCarouselHeading
        primary="TRENDING"
        onNext={slideNext}
        atEnd={false}
        nextAriaLabel="Next trending class"
      />

      <div
        ref={bleedWrapRef}
        className={
          fullBleed === true
            ? "relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2"
            : bleedRight
              ? "relative mt-8 max-w-none overflow-x-visible"
              : "relative mt-8 w-full min-w-0 max-w-full overflow-x-clip"
        }
        style={bleedRight ? { width: bleedWidth ?? "100%" } : undefined}
      >
        <div
          ref={scrollAreaRef}
          className="learn-trending-marquee relative w-full min-w-0 shrink-0 overflow-x-visible overflow-y-visible"
          style={{
            minHeight: LEARN_POPULAR_FIGMA_TILE_H,
            /* Clip left (protect sidebar); allow cards to exit past the right edge. */
            clipPath:
              fullBleed === false
                ? "inset(-220px 0 -220px 0)"
                : "inset(-220px -100vw -220px 0)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          <div
            ref={trackRef}
            className="flex w-max will-change-transform"
            style={{ gap: CARD_GAP }}
          >
            {marqueeTiles.map((tile) => (
              <div key={tile.loopKey} className="learn-trending-tile relative shrink-0">
                <LearnPopularFigmaTile
                  id={tile.id}
                  href={tile.href}
                  title={tile.title}
                  authorLabel={tile.authorLabel}
                  tagPrimary={tile.tagPrimary}
                  coverImageSrc={tile.coverImageSrc}
                />
              </div>
            ))}
          </div>

          <LearnCarouselEdgeNav
            atBeginning={false}
            atEnd={false}
            onPrev={slidePrev}
            onNext={slideNext}
            prevLabel="Previous trending class"
            nextLabel="Next trending class"
          />
        </div>
      </div>
    </div>
  );
}
