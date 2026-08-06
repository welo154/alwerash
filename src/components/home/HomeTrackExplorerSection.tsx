"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import {
  CatalogShowcaseCard,
  CATALOG_SHOWCASE_CARD_H,
  CATALOG_SHOWCASE_CARD_W,
} from "@/components/cards";
import type { LandingShowcaseSlide } from "@/components/cards/catalog-showcase-map";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import {
  learnCarouselMousewheel,
} from "@/components/learn/learn-carousel-swiper-config";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import type { HomeTrackMetaFilter, HomeTrackPill } from "@/types/home-track-explorer";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

/** Break out of a padded ancestor to viewport width without transform (avoids left-edge clipping). */
const FULL_BLEED = "w-screen max-w-[100vw] ml-[calc(50%-50vw)]";

/** Same continuous drift as LearnTrendingClassesSection. */
const MARQUEE_PIXELS_PER_SECOND = 47;
const PILL_GAP_PX = 25;

const pillFont = {
  fontFamily: pangeaFontFamily,
  lineHeight: "19.6px",
} as const;

const bodyTextFont = {
  fontFamily: pangeaFontFamily,
} as const;

function TrackLinkPill({ pill }: { pill: HomeTrackPill }) {
  return (
    <Link
      href={`/tracks/${encodeURIComponent(pill.slug)}`}
      className="inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-[24px] font-bold text-black no-underline transition-colors hover:bg-slate-50"
      style={{ ...pillFont, lineHeight: "19.6px" }}
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
      style={{ ...pillFont, lineHeight: "19.6px" }}
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
  /** Two-row infinite marquee for track pills (guest home). */
  marqueeTrackPills?: boolean;
  /** When set, align pills + cards to this inset from the viewport left (e.g. logged-in `/home`). */
  contentLeftPx?: number;
  /** Gap between track pills; falls back to 25px rows. */
  pillGapPx?: number;
  /** When set, show only the first N track pills (combined across both rows). */
  maxPills?: number;
  /** "WHAT TO LEARN NEXT" heading between the pills and the cards (logged-in `/home`). */
  showWhatToLearnNextHeading?: boolean;
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
  marqueeTrackPills = false,
  contentLeftPx,
  pillGapPx,
  maxPills,
  showWhatToLearnNextHeading = false,
}: HomeTrackExplorerSectionProps) {
  const {
    scrollAreaRef,
    atBeginning,
    atEnd,
    handleSwiper,
    handleNavSync,
    slideNext,
    slidePrev,
  } = useLearnCarouselSwiper();

  const allPills = useMemo(
    () => [...trackPillRow1, ...trackPillRow2],
    [trackPillRow1, trackPillRow2]
  );
  const pillRow1 = maxPills != null ? allPills.slice(0, maxPills) : trackPillRow1;
  const pillRow2 = maxPills != null ? [] : trackPillRow2;

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

  const trackSlides = slidesByFilter.featured ?? [];
  const courseTiles = trackPillSelectsCourses
    ? activeTrackSlug
      ? (courseTilesByTrackSlug[activeTrackSlug] ?? [])
      : []
    : [];

  const visibleCourseTiles =
    trackPillSelectsCourses && maxVisibleCourses != null && !showWhatToLearnNextHeading
      ? courseTiles.slice(0, maxVisibleCourses)
      : courseTiles;

  const showViewMoreCourses =
    trackPillSelectsCourses &&
    !showWhatToLearnNextHeading &&
    maxVisibleCourses != null &&
    activeTrackSlug != null &&
    courseTiles.length > maxVisibleCourses;

  const cardGridKey = trackPillSelectsCourses
    ? `courses-${activeTrackSlug ?? "none"}`
    : "featured";

  const isEmpty = trackPillSelectsCourses ? courseTiles.length === 0 : trackSlides.length === 0;

  const pillRowClass =
    contentLeftPx != null
      ? "flex flex-wrap gap-[25px] pr-[160px]"
      : `${FULL_BLEED} flex flex-wrap gap-[25px] px-6 sm:px-8`;
  const pillRowStyle =
    contentLeftPx != null || pillGapPx != null
      ? {
          paddingLeft: contentLeftPx != null ? `${contentLeftPx}px` : undefined,
          gap: pillGapPx != null ? `${pillGapPx}px` : undefined,
        }
      : undefined;

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
      {marqueeTrackPills ? (
        <div>
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
          {pillRow1.length > 0 ? (
            <div className={pillRowClass} style={pillRowStyle}>
              {pillRow1.map((pill) => renderTrackPill(pill))}
            </div>
          ) : null}

          {pillRow2.length > 0 ? (
            <div
              className={`${pillRowClass} mt-[11px]${contentLeftPx == null ? " pr-[68px]" : ""}`}
              style={pillRowStyle}
            >
              {pillRow2.map((pill) => renderTrackPill(pill))}
            </div>
          ) : null}
        </>
      )}

      {showWhatToLearnNextHeading ? (
        <div
          className="mt-[76px] flex items-center gap-[26px]"
          style={{
            paddingLeft: contentLeftPx != null ? `${contentLeftPx}px` : undefined,
          }}
        >
          <h2
            className="m-0 text-[36px] font-normal leading-[120%] text-black"
            style={{ fontFamily: pangeaFontFamily }}
          >
            WHAT TO LEARN NEXT
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="43"
            viewBox="0 0 45 45"
            fill="none"
            aria-hidden
            className="shrink-0"
          >
            <path
              d="M22.5 44C34.3741 44 44 34.3741 44 22.5C44 10.6259 34.3741 1 22.5 1C10.6259 1 1 10.6259 1 22.5C1 34.3741 10.6259 44 22.5 44Z"
              fill="white"
            />
            <path d="M22.5 31.1L31.1 22.5L22.5 13.9" fill="white" />
            <path
              d="M22.5 13.9L31.1 22.5L22.5 31.1M31.1 22.5L13.9 22.5M44 22.5C44 34.3741 34.3741 44 22.5 44C10.6259 44 1 34.3741 1 22.5C1 10.6259 10.6259 1 22.5 1C34.3741 1 44 10.6259 44 22.5Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}

      {showWhatToLearnNextHeading ? (
        <p
          className="m-0 mt-[5px] text-[18px] font-normal leading-[127%] text-black"
          style={{
            fontFamily: pangeaFontFamily,
            paddingLeft: contentLeftPx != null ? `${contentLeftPx}px` : undefined,
          }}
        >
          Recommended for you
        </p>
      ) : null}

      {showWhatToLearnNextHeading ? (
        <div
          key={cardGridKey}
          className="home-learn-next-track relative left-1/2 mt-[67px] w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip overflow-y-visible"
          style={{
            paddingLeft: contentLeftPx != null ? `${contentLeftPx}px` : undefined,
            paddingRight: 24,
          }}
        >
          <div
            ref={scrollAreaRef}
            className="relative w-full min-w-0 overflow-x-visible overflow-y-visible"
            style={{
              minHeight: trackPillSelectsCourses
                ? LEARN_POPULAR_FIGMA_TILE_H
                : CATALOG_SHOWCASE_CARD_H,
              /* Allow hover expand card to paint outside the slide without page scroll. */
              clipPath: "inset(-160px -320px -160px 0)",
            }}
          >
            {isEmpty ? (
              <p
                className="text-left text-[20px] text-black/60"
                style={pillFont}
              >
                {trackPillSelectsCourses && activeTrackSlug
                  ? "No published courses in this track yet."
                  : "No tracks to show."}
              </p>
            ) : (
              <>
                <Swiper
                  key={cardGridKey}
                  dir="ltr"
                  modules={[Mousewheel]}
                  slidesPerView="auto"
                  spaceBetween={27}
                  slidesPerGroup={1}
                  speed={400}
                  grabCursor
                  allowTouchMove
                  simulateTouch
                  observer
                  observeParents
                  watchOverflow
                  mousewheel={learnCarouselMousewheel}
                  className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full overflow-visible!"
                  onSwiper={handleSwiper}
                  onSlideChange={handleNavSync}
                  onSlidesUpdated={handleNavSync}
                  onResize={handleNavSync}
                >
                  {trackPillSelectsCourses
                    ? visibleCourseTiles.map((tile) => (
                        <SwiperSlide
                          key={`${cardGridKey}-${tile.id}`}
                          className="h-auto! w-[346px]! shrink-0 overflow-visible!"
                        >
                          <LearnPopularFigmaTile {...tile} />
                        </SwiperSlide>
                      ))
                    : trackSlides.map(({ slug, cardProps }) => (
                        <SwiperSlide
                          key={`${cardGridKey}-${slug}`}
                          className="h-auto! shrink-0 overflow-visible!"
                          style={{ width: CATALOG_SHOWCASE_CARD_W }}
                        >
                          <CatalogShowcaseCard
                            {...cardProps}
                            showcaseSlug={slug}
                          />
                        </SwiperSlide>
                      ))}
                </Swiper>

                <LearnCarouselEdgeNav
                  atBeginning={atBeginning}
                  atEnd={atEnd}
                  onPrev={slidePrev}
                  onNext={slideNext}
                  prevLabel="Previous course"
                  nextLabel="Next course"
                />
              </>
            )}
          </div>
        </div>
      ) : (
      <div
        key={cardGridKey}
        className="mt-[64px] mx-auto flex w-full max-w-full flex-wrap justify-center gap-x-[27px] gap-y-6 px-4 sm:px-6"
        style={{
          minHeight: trackPillSelectsCourses ? undefined : CATALOG_SHOWCASE_CARD_H,
        }}
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
            {visibleCourseTiles.map((tile) => (
              <LearnPopularFigmaTile key={`${cardGridKey}-${tile.id}`} {...tile} />
            ))}
          </>
        ) : (
          trackSlides.map(({ slug, cardProps }) => (
            <CatalogShowcaseCard key={`${cardGridKey}-${slug}`} {...cardProps} showcaseSlug={slug} />
          ))
        )}
      </div>
      )}

      {showViewMoreCourses && trackPillSelectsCourses ? (
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
