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
import { LibraryFeaturedBook } from "@/components/library/LibraryFeaturedBook";
import { LibraryArticleCardVisual } from "@/components/library/LibraryArticleCardVisual";
import { LandingEverythingInOneSection } from "@/components/landing/LandingEverythingInOneSection";
import { LandingCurrentMostsSection } from "@/components/landing/LandingCurrentMostsSection";
import { LibraryPopularsSection } from "@/components/home/LibraryPopularsSection";
import { StudentsRatingWorkSection } from "@/components/students/StudentsRatingWorkSection";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingGetStartedCtaSection } from "@/components/landing/LandingGetStartedCtaSection";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";

/** Same card gap as Continue Learning mobile swiper. */
const MOBILE_SWIPER_CARD_GAP_PX = 20;
const DESKTOP_SWIPER_CARD_GAP_PX = 27;
const MOBILE_SECTION_INSET_PX = 30;

function useSwiperCardGap() {
  const [gap, setGap] = useState(MOBILE_SWIPER_CARD_GAP_PX);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setGap(media.matches ? DESKTOP_SWIPER_CARD_GAP_PX : MOBILE_SWIPER_CARD_GAP_PX);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return gap;
}

function useMobileSwiperInset() {
  const [inset, setInset] = useState(MOBILE_SECTION_INSET_PX);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setInset(media.matches ? 0 : MOBILE_SECTION_INSET_PX);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return inset;
}

/** Break out of a padded ancestor to viewport width without transform (avoids left-edge clipping). */
const FULL_BLEED = "w-screen max-w-[100vw] ml-[calc(50%-50vw)]";

/** Same continuous drift as LearnTrendingClassesSection. */
const MARQUEE_PIXELS_PER_SECOND = 47;

const pillFont = {
  fontFamily: pangeaFontFamily,
  lineHeight: "19.6px",
} as const;

const bodyTextFont = {
  fontFamily: pangeaFontFamily,
} as const;

const sectionLabelFont = {
  color: "var(--White, #FFF)",
  fontFamily: pangeaFontFamily,
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
} as const;

function SectionLabelUnderline({ width }: { width: number }) {
  return (
    <div
      className="shrink-0 bg-[#FFF]"
      style={{ width, height: "1.2px", minHeight: "1.2px", maxHeight: "1.2px" }}
      aria-hidden
    />
  );
}

function MobileDiscoverCta({
  className,
  textClassName = "text-black",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <p
        className={`m-0 w-[315px] text-[20px] font-normal leading-[127%] ${textClassName}`}
        style={bodyTextFont}
      >
        Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by
        industry professionals.
      </p>
      <Link
        href="/course"
        className="mt-[20px] inline-flex h-[49px] w-fit items-center self-start rounded-[8px] border-[0.2px] border-black px-4 text-[20px] font-normal leading-[19.6px] text-[#141413] no-underline transition-opacity hover:opacity-90"
        style={{ ...pillFont, backgroundColor: "var(--Blue, #64E1FF)" }}
      >
        Discover
      </Link>
    </div>
  );
}

function TrackLinkPill({ pill }: { pill: HomeTrackPill }) {
  return (
    <Link
      href={`/tracks/${encodeURIComponent(pill.slug)}`}
      className="inline-flex h-[27px] w-fit shrink-0 items-center justify-center rounded-[8px] border-[0.3px] border-black bg-white px-4 text-center text-[18px] font-bold leading-[19.6px] text-black no-underline transition-colors hover:bg-slate-50 lg:h-[45px] lg:border lg:text-[24px]"
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
      className={`inline-flex h-[27px] w-fit shrink-0 items-center justify-center rounded-[8px] border-[0.3px] border-black px-4 text-center text-[18px] font-bold leading-[19.6px] text-black transition-colors lg:h-[45px] lg:border lg:text-[24px] ${
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
        className="flex w-max will-change-transform gap-[9px] pl-6 sm:pl-8 lg:gap-[25px]"
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
  /** Mentors for mobile guest landing “Current Mosts” strip. */
  landingMostsMentors?: LandingMostsMentorCardDto[];
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
  landingMostsMentors = [],
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
  const swiperCardGap = useSwiperCardGap();
  const mobileSwiperInset = useMobileSwiperInset();

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

  const contentInsetClass =
    contentLeftPx != null ? "max-lg:pl-[30px] max-lg:pr-0 lg:pl-[120px]" : "";
  const pillRowGapClass =
    contentLeftPx != null ? "max-lg:gap-[9px] lg:gap-[15px]" : "gap-[25px]";
  const pillRowClass =
    contentLeftPx != null
      ? `flex flex-wrap ${pillRowGapClass} max-lg:pr-0 lg:pr-[160px] ${contentInsetClass}`
      : `${FULL_BLEED} flex flex-wrap gap-[25px] px-6 sm:px-8`;
  const pillRowStyle =
    pillGapPx != null && contentLeftPx == null
      ? {
          gap: `${pillGapPx}px`,
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
              className="mt-[10px] lg:mt-[11px]"
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
          className={`mt-[60px] flex items-center gap-[13px] lg:mt-[76px] lg:gap-[26px] ${contentInsetClass}`}
        >
          <h2
            className="m-0 text-[24px] font-normal leading-[120%] text-black lg:text-[36px]"
            style={{ fontFamily: pangeaFontFamily }}
          >
            WHAT TO LEARN NEXT
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 45 45"
            fill="none"
            aria-hidden
            className="size-[28px] shrink-0 lg:size-[43px]"
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
          className={`m-0 mt-[2px] text-[16px] font-normal leading-[127%] text-black lg:mt-[5px] lg:text-[18px] ${contentInsetClass}`}
          style={{
            fontFamily: pangeaFontFamily,
          }}
        >
          Recommended for you
        </p>
      ) : null}

      {showWhatToLearnNextHeading ? (
        <div
          key={cardGridKey}
          className={`home-learn-next-track ${FULL_BLEED} relative mt-[29px] overflow-x-clip overflow-y-visible lg:mt-[67px] lg:ml-0 lg:w-full lg:max-w-none ${
            contentLeftPx != null ? "lg:pl-[120px] lg:pr-6" : "pr-6"
          }`}
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
                  spaceBetween={swiperCardGap}
                  slidesPerGroup={1}
                  slidesOffsetBefore={mobileSwiperInset}
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
                          className="h-auto! w-[315px]! shrink-0 overflow-visible! lg:w-[346px]!"
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

                <div className="hidden lg:contents">
                  <LearnCarouselEdgeNav
                    atBeginning={atBeginning}
                    atEnd={atEnd}
                    onPrev={slidePrev}
                    onNext={slideNext}
                    prevLabel="Previous course"
                    nextLabel="Next course"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
      <div
        key={cardGridKey}
        className={`${FULL_BLEED} relative mt-[50px] overflow-x-clip overflow-y-visible lg:mt-[64px]`}
      >
        <div
          ref={scrollAreaRef}
          className="home-learn-next-track relative w-full min-w-0 overflow-x-visible overflow-y-visible"
          style={{
            minHeight: trackPillSelectsCourses
              ? LEARN_POPULAR_FIGMA_TILE_H
              : CATALOG_SHOWCASE_CARD_H,
            clipPath: "inset(-160px -320px -160px 0)",
          }}
        >
          {isEmpty ? (
            <p
              className="px-6 text-center text-[20px] text-black/60 sm:px-8"
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
                spaceBetween={swiperCardGap}
                slidesPerGroup={1}
                slidesOffsetBefore={mobileSwiperInset}
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
                        className="h-auto! w-[315px]! shrink-0 overflow-visible! lg:w-[346px]!"
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

              <div className="hidden lg:contents">
                <LearnCarouselEdgeNav
                  atBeginning={atBeginning}
                  atEnd={atEnd}
                  onPrev={slidePrev}
                  onNext={slideNext}
                  prevLabel="Previous course"
                  nextLabel="Next course"
                />
              </div>
            </>
          )}
        </div>
      </div>
      )}

      {showWhatToLearnNextHeading ? (
        <LibraryPopularsSection contentLeftPx={contentLeftPx} />
      ) : null}

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
        <>
          <div className="lg:hidden">
          <MobileDiscoverCta className="mt-[45px] pl-[31px]" />

          <div
            className="relative mx-auto mt-[45px] box-border overflow-hidden"
            style={{
              width: 393,
              height: 1386.999,
              borderRadius: 55,
              background: "var(--Dark-Green, #004B3C)",
            }}
          >
            {/* Figma 1181:6349 — WORK book */}
            <div
              className="absolute left-[32px] top-[40px] flex h-[298.201px] w-[210.303px] items-center justify-center"
            >
              <div className="flex-none" style={{ transform: "rotate(-4.96deg)" }}>
                <div
                  className="relative h-[283.146px] w-[186.543px] overflow-hidden rounded-br-[20px] rounded-tr-[20px] shadow-[16px_16px_11px_0_rgba(0,0,0,0.1)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/library/books/book-work-mobile.png"
                    alt="Work book cover"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-3px_0_5px_0_rgba(0,0,0,0.25)]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
            <div
              className="pointer-events-none absolute left-[54px] top-[53px] flex h-[282px] w-[24.5px] items-center justify-center"
              aria-hidden
            >
              <div className="flex-none" style={{ transform: "rotate(85.04deg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/library/books/book-work-mobile-line-a.png"
                  alt=""
                  width={283}
                  height={1}
                  className="block max-w-none"
                />
              </div>
            </div>
            <div
              className="pointer-events-none absolute left-[53px] top-[53px] flex h-[282px] w-[24.5px] items-center justify-center"
              aria-hidden
            >
              <div className="flex-none" style={{ transform: "rotate(85.04deg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/library/books/book-work-mobile-line-b.png"
                  alt=""
                  width={283}
                  height={1}
                  className="block max-w-none"
                />
              </div>
            </div>

            {/* Books label */}
            <div className="absolute left-[265px] top-[142px] inline-flex flex-col">
              <div className="flex items-center gap-[4px]">
                <p className="m-0 whitespace-nowrap" style={sectionLabelFont}>
                  BOOKS
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                  aria-hidden
                >
                  <path
                    d="M0.599609 12.5996L12.5996 0.59961M12.5996 12.5996L12.5996 0.59961L0.599609 0.59961"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <SectionLabelUnderline width={77} />
            </div>

            {/* Articles label */}
            <div className="absolute left-[49px] top-[421px] inline-flex flex-col">
              <div className="flex items-center gap-[4px]">
                <p className="m-0 whitespace-nowrap" style={sectionLabelFont}>
                  ARTICLES
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                  aria-hidden
                >
                  <path
                    d="M0.599609 12.5996L12.5996 0.59961M12.5996 12.5996L12.5996 0.59961L0.599609 0.59961"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <SectionLabelUnderline width={95} />
            </div>

            {/* References & Materials label */}
            <div className="absolute left-[241px] top-[667px] inline-flex flex-col">
              <div className="inline-flex flex-col">
                <p className="m-0 whitespace-nowrap" style={sectionLabelFont}>
                  REFERENCES &
                </p>
                <SectionLabelUnderline width={125} />
              </div>
              <div className="inline-flex flex-col">
                <div className="flex items-center gap-[4px]">
                  <p className="m-0 whitespace-nowrap" style={sectionLabelFont}>
                    MATERIALS
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="shrink-0"
                    aria-hidden
                  >
                    <path
                      d="M0.599609 12.5996L12.5996 0.59961M12.5996 12.5996L12.5996 0.59961L0.599609 0.59961"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <SectionLabelUnderline width={108} />
              </div>
            </div>

            <div className="absolute right-[26px] top-[295px] z-20 origin-center" style={{ transform: "rotate(5deg)" }}>
              <LibraryArticleCardVisual clipId="mobile-landing-article" />
            </div>

            {/* Blue day film book — same size as WORK book */}
            <div className="absolute left-[31px] top-[558px] z-10 flex h-[298.201px] w-[210.303px] items-center justify-center">
              <div className="flex-none" style={{ transform: "rotate(-4.96deg)" }}>
                <div className="relative h-[283.146px] w-[186.543px] overflow-hidden rounded-br-[20px] rounded-tr-[20px] shadow-[16px_16px_11px_0_rgba(0,0,0,0.1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/library/books/book-blue-day-mobile.png"
                    alt="Blue day film book cover"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-3px_0_5px_0_rgba(0,0,0,0.25)]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
            <div
              className="pointer-events-none absolute left-[53px] top-[571px] z-10 flex h-[282px] w-[24.5px] items-center justify-center"
              aria-hidden
            >
              <div className="flex-none" style={{ transform: "rotate(85.04deg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/library/books/book-work-mobile-line-a.png"
                  alt=""
                  width={283}
                  height={1}
                  className="block max-w-none"
                />
              </div>
            </div>
            <div
              className="pointer-events-none absolute left-[52px] top-[571px] z-10 flex h-[282px] w-[24.5px] items-center justify-center"
              aria-hidden
            >
              <div className="flex-none" style={{ transform: "rotate(85.04deg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/library/books/book-work-mobile-line-b.png"
                  alt=""
                  width={283}
                  height={1}
                  className="block max-w-none"
                />
              </div>
            </div>

            <div
              className="absolute left-[170px] top-[813px] z-[9] origin-center overflow-visible"
              style={{ width: 173.605, height: 278.075, transform: "rotate(5deg)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={164.754}
                height={291.643}
                viewBox="0 0 150 265"
                fill="none"
                aria-hidden
                className="absolute"
                style={{ zIndex: 0, left: 33.145, top: 29.668 }}
              >
                <path
                  d="M148.786 250.232C150.933 259.222 143.194 268.125 138.556 262.003L112.816 228.025C105.146 232.813 96.0859 235.584 86.3778 235.584L24.163 235.584C15.3991 235.583 7.16316 233.326 0.000842263 229.365C4.47034 230.675 9.19933 231.378 14.0926 231.378L81.6034 231.379C109.218 231.379 131.603 208.993 131.603 181.379L131.603 15.4937C131.603 10.0855 130.745 4.87787 129.156 -0.000398477C133.739 7.55331 136.378 16.4174 136.378 25.898L136.378 185.584C136.378 188.715 136.088 191.78 135.537 194.753L148.786 250.232Z"
                  fill="#89F496"
                />
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/library/podcasts/podcasts-section-portrait.png"
                alt="Podcast host portrait"
                width={173.605}
                height={278.075}
                className="absolute left-0 top-0 h-full w-full object-cover"
                style={{ zIndex: 1 }}
                draggable={false}
              />
            </div>

            {/* Podcasts label */}
            <div className="absolute left-[44px] top-[946px] inline-flex flex-col">
              <div className="flex items-center gap-[4px]">
                <p className="m-0 whitespace-nowrap" style={sectionLabelFont}>
                  PODCASTS
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                  aria-hidden
                >
                  <path
                    d="M0.599609 12.5996L12.5996 0.59961M12.5996 12.5996L12.5996 0.59961L0.599609 0.59961"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <SectionLabelUnderline width={108} />
            </div>

            <MobileDiscoverCta
              className="absolute left-[31px] top-[1170px]"
              textClassName="text-white"
            />
          </div>

          <LandingEverythingInOneSection
            variant="mobile"
            showDecoBoxes={false}
            className="mt-[64px]"
          />

          {landingMostsMentors.length > 0 ? (
            <LandingCurrentMostsSection
              mentors={landingMostsMentors}
              className="mt-[68px]"
            />
          ) : null}

          <StudentsRatingWorkSection
            variant="mobile"
            sectionClassName="mt-[75px]"
          />

          <LandingFaqSection
            variant="mobile"
            className="mt-[100px]"
          />

          <LandingGetStartedCtaSection
            variant="mobile"
            className="mt-[96px]"
          />
          </div>

          <div className="max-lg:hidden">
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

          <div className={`${FULL_BLEED} flex justify-center px-4`}>
            <div
              className="box-border overflow-visible"
              style={{
                marginTop: 56,
                width: 1359.999,
                maxWidth: "100%",
                borderRadius: 55,
                background: "var(--Dark-Green, #004B3C)",
                paddingTop: 100,
                paddingBottom: 100,
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              <LibraryFeaturedBook embedded />

              <div
                className="mx-auto flex max-w-full flex-wrap items-center justify-between lg:pl-[92px] lg:pr-[72px]"
                style={{ marginTop: 25 }}
              >
                <p
                  className="w-[612px] max-w-full text-[24px] font-normal leading-[127%] text-white"
                  style={{ ...bodyTextFont, marginLeft: 90 }}
                >
                  Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by
                  industry professionals.
                </p>
                <Link
                  href="/course"
                  className="inline-flex h-[91px] w-[247px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[36px] font-normal leading-[19.6px] text-[color:var(--Text-Primary,#141413)] no-underline transition-opacity hover:opacity-90"
                  style={{
                    ...pillFont,
                    backgroundColor: "var(--Blue, #64E1FF)",
                    marginRight: 65,
                  }}
                >
                  Discover
                </Link>
              </div>
            </div>
          </div>
        </div>
        </>
      ) : null}
    </section>
  );
}
