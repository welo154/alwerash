"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
  CatalogShowcaseCard,
  CATALOG_SHOWCASE_CARD_H,
  CATALOG_SHOWCASE_CARD_W,
  type CatalogShowcaseCardProps,
} from "@/components/cards";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/** Green tracks shell — Figma 1101×646. */
const PANEL_W = 1101;
const PANEL_H = 646;
/** Inset from the content column’s left edge. */
const SVG_LEFT_PX = 57;
/** Bottom-right corner radius of the green path (~55); push past the viewport so it clips away. */
const CURVE_HIDE_PX = 55;

export type LearnFeaturedSlide = { id: string; cardProps: CatalogShowcaseCardProps };

export function LearnFeaturedCoursesPanel({ slides }: { slides: LearnFeaturedSlide[] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const {
    scrollAreaRef,
    atBeginning,
    atEnd,
    handleSwiper,
    handleNavSync,
    slideNext,
    slidePrev,
  } = useLearnCarouselSwiper();

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.update();
    handleNavSync(swiper);
  }, [handleNavSync, slides.length]);

  const cardSwiperStyle = {
    ["--landing-showcase-card-w" as string]: `${CATALOG_SHOWCASE_CARD_W}px`,
    ["--landing-showcase-card-h" as string]: `${CATALOG_SHOWCASE_CARD_H}px`,
  } as const;

  return (
    <div className="relative w-full min-w-0 overflow-x-visible" style={{ height: PANEL_H }}>
      {/*
        Green shell starts 57px from the left, then stretches to (and past) the
        viewport’s right edge so the bottom-right border curve is clipped off-screen.
      */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={PANEL_W}
        height={PANEL_H}
        viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
        fill="none"
        className="pointer-events-none absolute top-0 z-0 block h-[646px]"
        style={{
          left: SVG_LEFT_PX,
          right: "50%",
          marginRight: `calc(-50vw - ${CURVE_HIDE_PX}px)`,
          width: "auto",
          height: PANEL_H,
        }}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M1046 0C1076.38 3.83335e-06 1101 24.6243 1101 55V591C1101 621.376 1076.38 646 1046 646H55C24.6243 646 1.44977e-07 621.376 0 591V122.967C0 95.3526 22.3858 72.9668 50 72.9668H414.41C438.711 72.9668 458.41 53.2673 458.41 28.9668C458.41 12.9689 471.379 0 487.377 0H1046Z"
          fill="var(--Green, #8AF396)"
        />
      </svg>

      {/* Full-size cards in a horizontal swiper — extras peek on the right and stay reachable. */}
      <div
        className="absolute inset-0 z-10 box-border flex w-full flex-col pb-[42px] pt-[116px] pr-[24px]"
        style={{ paddingLeft: SVG_LEFT_PX + 24 }}
      >
        <div
          ref={scrollAreaRef}
          className="relative w-full min-w-0 shrink-0 overflow-x-visible overflow-y-visible"
          style={{
            minHeight: CATALOG_SHOWCASE_CARD_H,
            /* Allow cards to overflow right so the next slide peeks past the green. */
            clipPath: "inset(-200px -100vw -200px 0)",
            ...cardSwiperStyle,
          }}
        >
          <Swiper
            dir="ltr"
            modules={[Mousewheel]}
            {...learnCarouselSwiperBehavior}
            mousewheel={learnCarouselMousewheel}
            className="learn-featured-swiper landing-showcase-swiper landing-showcase-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              handleSwiper(swiper);
            }}
            onSlideChange={handleNavSync}
            onSlidesUpdated={handleNavSync}
            onResize={handleNavSync}
          >
            {slides.map(({ id, cardProps }) => (
              <SwiperSlide
                key={id}
                className="shrink-0 overflow-visible!"
                style={{
                  width: CATALOG_SHOWCASE_CARD_W,
                  height: CATALOG_SHOWCASE_CARD_H,
                }}
              >
                <CatalogShowcaseCard {...cardProps} className="shrink-0" />
              </SwiperSlide>
            ))}
          </Swiper>
          <LearnCarouselEdgeNav
            atBeginning={atBeginning}
            atEnd={atEnd}
            onPrev={slidePrev}
            onNext={slideNext}
            prevLabel="Previous featured track"
            nextLabel="Next featured track"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-30 w-full min-w-0">
        <div
          className="pointer-events-auto absolute top-0 flex items-center gap-4"
          style={{ left: SVG_LEFT_PX }}
        >
          <div className="inline-flex h-[72px] items-center rounded-[44px] bg-white pl-[22px] pr-[22px]">
            <h1 className="m-0 uppercase leading-none">
              <span
                style={{
                  fontFamily: pangeaFont,
                  color: "#000",
                  fontSize: "48px",
                  fontWeight: 400,
                  lineHeight: "57.6px",
                }}
              >
                TRACKS
              </span>
            </h1>
          </div>
          <button
            type="button"
            className="-ml-[15px] inline-flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Next featured track"
            disabled={atEnd}
            suppressHydrationWarning
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              slideNext();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
              viewBox="0 0 62 62"
              fill="none"
              className="h-[60px] w-[60px]"
              aria-hidden
            >
              <path
                d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z"
                fill="var(--White, #FFF)"
              />
              <path d="M31 43L43 31L31 19" fill="var(--White, #FFF)" />
              <path
                d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
                stroke="var(--Black, #000)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
