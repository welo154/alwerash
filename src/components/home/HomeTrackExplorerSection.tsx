"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CatalogShowcaseCard, CATALOG_SHOWCASE_CARD_H } from "@/components/cards";
import type { LandingShowcaseSlide } from "@/components/cards/catalog-showcase-map";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import type { HomeTrackMetaFilter, HomeTrackPill } from "@/types/home-track-explorer";

/** Break out of a padded ancestor to viewport width without transform (avoids left-edge clipping). */
const FULL_BLEED = "w-screen max-w-[100vw] ml-[calc(50%-50vw)]";

const META_FILTERS: { id: HomeTrackMetaFilter; label: string }[] = [
  { id: "featured", label: "FEATURED" },
  { id: "topRated", label: "TOP RATED" },
  { id: "activity", label: "ACTIVITY" },
];

/** Same continuous drift as LearnTrendingClassesSection. */
const MARQUEE_PIXELS_PER_SECOND = 47;
const PILL_GAP_PX = 25;

const pillFont = {
  fontFamily: '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
  lineHeight: "19.6px",
} as const;

const bodyTextFont = {
  fontFamily: '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
} as const;

function MetaFilterPill({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black ${
        pressed ? "bg-[#59CBE8]" : "bg-white"
      }`}
      style={pillFont}
    >
      {label}
    </button>
  );
}

function TrackLinkPill({ pill }: { pill: HomeTrackPill }) {
  return (
    <Link
      href={`/tracks/${encodeURIComponent(pill.slug)}`}
      className="inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-[24px] font-bold text-black no-underline transition-colors hover:bg-slate-50"
      style={pillFont}
    >
      {pill.label}
    </Link>
  );
}

function TrackSelectPill({
  pill,
  pressed,
  onClick,
}: {
  pill: HomeTrackPill;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black transition-colors ${
        pressed ? "bg-[#59CBE8]" : "bg-white hover:bg-slate-50"
      }`}
      style={pillFont}
    >
      {pill.label}
    </button>
  );
}

type LoopPill = HomeTrackPill & { loopKey: string };

function buildMarqueePills(pills: HomeTrackPill[]): LoopPill[] {
  if (pills.length === 0) return [];
  const copies = pills.length < 6 ? 4 : 2;
  const result: LoopPill[] = [];
  for (let round = 0; round < copies; round += 1) {
    for (const pill of pills) {
      result.push({ ...pill, loopKey: `${pill.slug}-m${round}` });
    }
  }
  return result;
}

function TrackPillsMarqueeRow({
  pills,
  renderPill,
  className = "",
  reverse = false,
}: {
  pills: HomeTrackPill[];
  renderPill: (pill: HomeTrackPill, key: string) => ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const marqueePills = useMemo(() => buildMarqueePills(pills), [pills]);
  const copyCount = pills.length > 0 ? marqueePills.length / pills.length : 1;
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
  }, [copyCount, marqueePills]);

  useEffect(() => {
    if (marqueePills.length === 0) return;
    let raf = 0;
    let last = performance.now();
    const direction = reverse ? -1 : 1;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current && loopWidthRef.current > 0) {
        applyOffset(offsetRef.current + direction * MARQUEE_PIXELS_PER_SECOND * dt);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyOffset, marqueePills.length, reverse]);

  if (pills.length === 0) return null;

  return (
    <div
      ref={scrollAreaRef}
      className={`${FULL_BLEED} overflow-hidden ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform pl-6 sm:pl-8"
        style={{ gap: PILL_GAP_PX }}
      >
        {marqueePills.map((pill) => (
          <div key={pill.loopKey} className="shrink-0">
            {renderPill(pill, pill.loopKey)}
          </div>
        ))}
      </div>
    </div>
  );
}

export type HomeTrackExplorerSectionProps = {
  trackPillRow1: HomeTrackPill[];
  trackPillRow2: HomeTrackPill[];
  slidesByFilter: Record<HomeTrackMetaFilter, LandingShowcaseSlide[]>;
  /** When true, track pills select one track and cards show that track's courses. */
  trackPillSelectsCourses?: boolean;
  courseTilesByTrackSlug?: Record<string, LearnPopularTile[]>;
  /** Cap course tiles when track pills select courses (guest landing). */
  maxVisibleCourses?: number;
  showDiscoverCta?: boolean;
  sectionClassName?: string;
  /** Featured / Top rated / Activity row. Off on guest home for now. */
  showMetaFilters?: boolean;
  /** Two-row infinite marquee for track pills (guest home). */
  marqueeTrackPills?: boolean;
};

export function HomeTrackExplorerSection({
  trackPillRow1,
  trackPillRow2,
  slidesByFilter,
  trackPillSelectsCourses = false,
  courseTilesByTrackSlug = {},
  maxVisibleCourses,
  showDiscoverCta = true,
  sectionClassName = "mt-[107px]",
  showMetaFilters = true,
  marqueeTrackPills = false,
}: HomeTrackExplorerSectionProps) {
  const [metaFilter, setMetaFilter] = useState<HomeTrackMetaFilter>("featured");
  const allPills = useMemo(
    () => [...trackPillRow1, ...trackPillRow2],
    [trackPillRow1, trackPillRow2]
  );

  const defaultTrackSlug = allPills[0]?.slug ?? null;
  const [selectedTrackSlug, setSelectedTrackSlug] = useState<string | null>(defaultTrackSlug);

  useEffect(() => {
    if (!trackPillSelectsCourses) return;
    setSelectedTrackSlug(defaultTrackSlug);
  }, [trackPillSelectsCourses, defaultTrackSlug]);

  const activeTrackSlug =
    trackPillSelectsCourses && selectedTrackSlug
      ? selectedTrackSlug
      : null;

  const trackSlides = slidesByFilter[metaFilter] ?? [];
  const courseTiles = trackPillSelectsCourses
    ? activeTrackSlug
      ? (courseTilesByTrackSlug[activeTrackSlug] ?? [])
      : []
    : [];

  const visibleCourseTiles =
    trackPillSelectsCourses && maxVisibleCourses != null
      ? courseTiles.slice(0, maxVisibleCourses)
      : courseTiles;

  const showViewMoreCourses =
    trackPillSelectsCourses &&
    maxVisibleCourses != null &&
    activeTrackSlug != null &&
    courseTiles.length > maxVisibleCourses;

  const cardGridKey = trackPillSelectsCourses
    ? `courses-${activeTrackSlug ?? "none"}`
    : metaFilter;

  const isEmpty = trackPillSelectsCourses ? courseTiles.length === 0 : trackSlides.length === 0;

  const renderTrackPill = (pill: HomeTrackPill, key = pill.slug) =>
    trackPillSelectsCourses ? (
      <TrackSelectPill
        key={key}
        pill={pill}
        pressed={pill.slug === activeTrackSlug}
        onClick={() => setSelectedTrackSlug(pill.slug)}
      />
    ) : (
      <TrackLinkPill key={key} pill={pill} />
    );

  return (
    <section className={`${sectionClassName} w-full`}>
      {showMetaFilters ? (
        <div className={`${FULL_BLEED} flex flex-wrap gap-[25px] px-6 sm:px-8`}>
          {META_FILTERS.map((f) => (
            <MetaFilterPill
              key={f.id}
              label={f.label}
              pressed={metaFilter === f.id}
              onClick={() => setMetaFilter(f.id)}
            />
          ))}
        </div>
      ) : null}

      {marqueeTrackPills ? (
        <div className={showMetaFilters ? "mt-[25px]" : undefined}>
          <TrackPillsMarqueeRow
            pills={trackPillRow1}
            renderPill={(pill, key) => renderTrackPill(pill, key)}
          />
          {trackPillRow2.length > 0 ? (
            <TrackPillsMarqueeRow
              pills={trackPillRow2}
              renderPill={(pill, key) => renderTrackPill(pill, key)}
              className="mt-[11px]"
              reverse
            />
          ) : null}
        </div>
      ) : (
        <>
          {trackPillRow1.length > 0 ? (
            <div
              className={`${FULL_BLEED} ${showMetaFilters ? "mt-[25px]" : ""} flex flex-wrap gap-[25px] px-6 sm:px-8`}
            >
              {trackPillRow1.map((pill) => renderTrackPill(pill))}
            </div>
          ) : null}

          {trackPillRow2.length > 0 ? (
            <div className={`${FULL_BLEED} mt-[11px] flex flex-wrap gap-[25px] px-6 sm:px-8 pr-[68px]`}>
              {trackPillRow2.map((pill) => renderTrackPill(pill))}
            </div>
          ) : null}
        </>
      )}

      <div
        className="mx-auto mt-[64px] w-full max-w-[1600px] px-6 sm:px-8"
        style={trackPillSelectsCourses ? undefined : { minHeight: CATALOG_SHOWCASE_CARD_H }}
      >
        {isEmpty ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={pillFont}
          >
            {trackPillSelectsCourses && activeTrackSlug
              ? "No published courses in this track yet."
              : "No tracks to show."}
          </p>
        ) : trackPillSelectsCourses ? (
          <>
            <div key={cardGridKey} className="flex flex-wrap justify-center gap-6">
              {visibleCourseTiles.map((tile) => (
                <LearnPopularFigmaTile key={tile.id} {...tile} />
              ))}
            </div>
            {showViewMoreCourses ? (
              <div className="mt-10 flex justify-center">
                <Link
                  href={`/tracks/${encodeURIComponent(activeTrackSlug!)}`}
                  className="inline-flex h-[56px] items-center justify-center rounded-[8px] border border-black bg-white px-8 text-[24px] font-bold text-black no-underline transition-colors hover:bg-black hover:text-white"
                  style={pillFont}
                >
                  View more
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <div key={cardGridKey} className="flex flex-wrap justify-center gap-[30px]">
            {trackSlides.map(({ slug, cardProps }) => (
              <CatalogShowcaseCard key={slug} {...cardProps} showcaseSlug={slug} />
            ))}
          </div>
        )}
      </div>

      {showDiscoverCta ? (
        <div className={`${FULL_BLEED} mt-[65px] px-6 lg:pl-[116px] lg:pr-[96px]`}>
          <div className="flex min-h-[216px] flex-wrap items-center justify-between gap-6">
            <p
              className="w-[612px] max-w-full text-[24px] font-normal leading-[127%] text-black"
              style={bodyTextFont}
            >
              Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by
              industry professionals.
            </p>
            <Link
              href="/course"
              className="inline-flex h-[91px] w-[247px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[36px] font-normal leading-[19.6px] text-[color:var(--Text-Primary,#141413)] no-underline transition-opacity hover:opacity-90"
              style={{ ...pillFont, backgroundColor: "var(--Blue, #64E1FF)" }}
            >
              Discover
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
