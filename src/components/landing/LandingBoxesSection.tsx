"use client";

import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { CatalogShowcaseCard, CATALOG_SHOWCASE_CARD_H, CATALOG_SHOWCASE_CARD_W } from "@/components/cards";
import type { LandingShowcaseSlide } from "@/components/cards/catalog-showcase-map";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import "swiper/css";

/** Break out of a centered page column to full viewport width (no horizontal scroll). */
const FULL_BLEED =
  "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2";

const CARDS_SLIDE_MS = 450;
const EDGE_GUTTER_PX = 24;
const TAG_GAP_PX = 25;
/** Repeat tags until the track is wide enough for loop + full-bleed on large screens. */
const TAG_TRACK_MIN_WIDTH_PX = 7200;

function estimateTagWidthPx(tag: string): number {
  return 32 + tag.length * 14 + TAG_GAP_PX;
}

function tagsForLoopRow(tags: string[]): string[] {
  if (tags.length === 0) return [];
  const cycleWidth = tags.reduce((sum, tag) => sum + estimateTagWidthPx(tag), 0);
  const repeats = Math.max(8, Math.ceil(TAG_TRACK_MIN_WIDTH_PX / Math.max(cycleWidth, 1)) + 2);
  return Array.from({ length: repeats }, () => tags).flat();
}

function initTagSwiper(swiper: SwiperType) {
  requestAnimationFrame(() => {
    swiper.update();
    swiper.autoplay?.start();
  });
}

/** Same artwork as next; horizontal flip so the chevron points left. */
function CardsPrevIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      aria-hidden
      className="scale-x-[-1]"
    >
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="white"
      />
      <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="white" />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardsNextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none" aria-hidden>
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="white"
      />
      <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="white" />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LandingTagPill({
  tag,
  pressed,
  onClick,
}: {
  tag: string;
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
      style={{
        fontFamily: pangeaFontFamily,
        lineHeight: "19.6px",
      }}
      suppressHydrationWarning
    >
      {tag}
    </button>
  );
}

const TAG_SWIPER_BASE = {
  modules: [Autoplay],
  slidesPerView: "auto" as const,
  spaceBetween: TAG_GAP_PX,
  loop: true,
  speed: 650,
  grabCursor: true,
  allowTouchMove: true,
  simulateTouch: true,
  observer: true,
  observeParents: true,
  watchSlidesProgress: true,
};

function LandingTagMarqueeRow({
  rowId,
  tags,
  autoplayDelayMs,
  activeTag,
  onSelectTag,
  className = "",
}: {
  rowId: string;
  tags: string[];
  autoplayDelayMs: number;
  activeTag: string | null;
  onSelectTag: (tag: string) => void;
  className?: string;
}) {
  const loopTags = useMemo(() => tagsForLoopRow(tags), [tags]);
  if (loopTags.length === 0) return null;

  return (
    <div className={`${FULL_BLEED} overflow-hidden pl-6 sm:pl-8 ${className}`.trim()}>
      <Swiper
        {...TAG_SWIPER_BASE}
        loopAdditionalSlides={Math.max(tags.length * 2, 8)}
        autoplay={{ delay: autoplayDelayMs, disableOnInteraction: false, pauseOnMouseEnter: true }}
        className="landing-showcase-swiper landing-showcase-swiper--tags w-full"
        onSwiper={initTagSwiper}
        onResize={initTagSwiper}
      >
        {loopTags.map((tag, i) => (
          <SwiperSlide key={`${rowId}-${tag}-${i}`}>
            <LandingTagPill tag={tag} pressed={activeTag === tag} onClick={() => onSelectTag(tag)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function LandingBoxesSection({
  showcaseSlides = [],
  showcaseTagRow1 = [],
  showcaseTagRow2 = [],
}: {
  showcaseSlides?: LandingShowcaseSlide[];
  showcaseTagRow1?: string[];
  showcaseTagRow2?: string[];
}) {
  const slides = showcaseSlides;
  const hasTagRows = showcaseTagRow1.length > 0 || showcaseTagRow2.length > 0;
  /** Row 1 only gets half the tracks — merge both rows so short rows still fill the viewport. */
  const tagRow1Unique = useMemo(() => {
    const merged = [...showcaseTagRow1];
    for (const tag of showcaseTagRow2) {
      if (!merged.includes(tag)) merged.push(tag);
    }
    return merged;
  }, [showcaseTagRow1, showcaseTagRow2]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTagRow2, setActiveTagRow2] = useState<string | null>(null);
  const cardsSwiperRef = useRef<SwiperType | null>(null);
  const [cardsAtEnd, setCardsAtEnd] = useState(false);
  const [cardsAtBeginning, setCardsAtBeginning] = useState(true);

  const syncCardsNav = (swiper: SwiperType) => {
    cardsSwiperRef.current = swiper;
    setCardsAtEnd(swiper.isEnd);
    setCardsAtBeginning(swiper.isBeginning);
  };

  const cardSwiperStyle = {
    ["--landing-showcase-card-h" as string]: `${CATALOG_SHOWCASE_CARD_H}px`,
    ["--landing-showcase-card-w" as string]: `${CATALOG_SHOWCASE_CARD_W}px`,
  } as const;

  return (
    <section className="mt-[107px] w-full overflow-x-hidden">
      {hasTagRows ? (
        <>
          {showcaseTagRow1.length > 0 ? (
            <LandingTagMarqueeRow
              rowId="r1"
              tags={tagRow1Unique}
              autoplayDelayMs={2400}
              activeTag={activeTag}
              onSelectTag={setActiveTag}
            />
          ) : null}

          {showcaseTagRow2.length > 0 ? (
            <LandingTagMarqueeRow
              rowId="r2"
              tags={showcaseTagRow2}
              autoplayDelayMs={2600}
              activeTag={activeTagRow2}
              onSelectTag={setActiveTagRow2}
              className="mt-[11px]"
            />
          ) : null}
        </>
      ) : null}

      <div
        className={`${FULL_BLEED} ${hasTagRows ? "mt-[64px]" : "mt-[24px]"}`}
        style={{ minHeight: CATALOG_SHOWCASE_CARD_H, ...cardSwiperStyle }}
      >
        <Swiper
          dir="ltr"
          slidesPerView="auto"
          spaceBetween={30}
          slidesPerGroup={1}
          speed={CARDS_SLIDE_MS}
          grabCursor
          allowTouchMove
          simulateTouch
          observer
          observeParents
          watchOverflow
          slidesOffsetBefore={EDGE_GUTTER_PX}
          slidesOffsetAfter={EDGE_GUTTER_PX}
          className="landing-showcase-swiper landing-showcase-swiper--cards w-full"
          onSwiper={(swiper) => {
            cardsSwiperRef.current = swiper;
            setCardsAtEnd(swiper.isEnd);
            setCardsAtBeginning(swiper.isBeginning);
            requestAnimationFrame(() => {
              swiper.update();
              setCardsAtEnd(swiper.isEnd);
              setCardsAtBeginning(swiper.isBeginning);
            });
          }}
          onSlideChange={syncCardsNav}
          onSlidesUpdated={syncCardsNav}
          onResize={syncCardsNav}
        >
          {slides.map(({ slug, cardProps }) => (
            <SwiperSlide key={slug}>
              <CatalogShowcaseCard {...cardProps} showcaseSlug={slug} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="absolute top-1/2 left-4 z-30 flex h-[43px] w-[43px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40 sm:left-6"
          aria-label="Previous tracks"
          disabled={cardsAtBeginning}
          suppressHydrationWarning
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            cardsSwiperRef.current?.slidePrev(CARDS_SLIDE_MS);
          }}
        >
          <CardsPrevIcon />
        </button>

        <button
          type="button"
          className="absolute top-1/2 right-4 z-30 flex h-[43px] w-[43px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40 sm:right-6"
          aria-label="Next tracks"
          disabled={cardsAtEnd}
          suppressHydrationWarning
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            cardsSwiperRef.current?.slideNext(CARDS_SLIDE_MS);
          }}
        >
          <CardsNextIcon />
        </button>
      </div>

      <div className="mx-auto mt-[65px] max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[216px] flex-wrap items-center justify-between gap-6 lg:pl-[92px] lg:pr-[72px]">
          <p
            className="w-[612px] max-w-full text-[24px] font-normal not-italic leading-[127%] text-black"
            style={{
              fontFamily: pangeaFontFamily,
            }}
          >
            Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by
            industry professionals.
          </p>
          <Link
            href="/course"
            className="inline-flex h-[91px] w-[247px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[36px] font-normal not-italic leading-[19.6px] text-[color:var(--Text-Primary,#141413)] no-underline transition-opacity hover:opacity-90"
            style={{
              fontFamily: pangeaFontFamily,
              backgroundColor: "var(--Blue, #64E1FF)",
            }}
          >
            Discover
          </Link>
        </div>
      </div>
    </section>
  );
}
