"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
  CATALOG_SHOWCASE_CARD_H,
  CATALOG_SHOWCASE_CARD_W,
  type CatalogShowcaseCardProps,
} from "@/components/cards";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { ScaledCatalogShowcaseCard } from "@/components/learn/ScaledCatalogShowcaseCard";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/** Desktop green tracks shell — Figma 1101×646. */
const DESKTOP_PANEL_W = 1101;
const DESKTOP_PANEL_H = 646;
const DESKTOP_SVG_LEFT_PX = 57;
const DESKTOP_CURVE_HIDE_PX = 55;

/** Mobile green shell on `/course`. */
const MOBILE_PANEL_H = 674;
const MOBILE_SVG_W = 473;
const MOBILE_SVG_LEFT_PX = 6;
const MOBILE_FEATURED_CARD_W = 307;

/** iPad green shell on `/course` — 1126×646, bleeds past the right edge. */
const TABLET_PANEL_W = 1126;
const TABLET_PANEL_H = 646;
const TABLET_SVG_LEFT_PX = 6;
const TABLET_CARD_W = 323;
const TABLET_CARD_GAP_PX = 30;

const MOBILE_SHELL_PATH =
  "M418 0C448.376 0 473 24.6243 473 55V619C473 649.376 448.376 674 418 674H55C24.6243 674 0 649.376 0 619V122.967C0 95.3526 22.3858 72.9668 50 72.9668H265.41C289.711 72.9668 309.41 53.2673 309.41 28.9668C309.41 12.9689 322.379 0 338.377 0H418Z";

const TABLET_SHELL_PATH =
  "M1071 0C1101.38 0 1126 24.6243 1126 55V591C1126 621.376 1101.38 646 1071 646H55C24.6243 646 1.44977e-07 621.376 0 591V122.967C0 95.3526 22.3858 72.9668 50 72.9668H414.41C438.711 72.9668 458.41 53.2673 458.41 28.9668C458.41 12.9689 471.379 0 487.377 0H1071Z";

const DESKTOP_SHELL_PATH =
  "M1046 0C1076.38 3.83335e-06 1101 24.6243 1101 55V591C1101 621.376 1076.38 646 1046 646H55C24.6243 646 1.44977e-07 621.376 0 591V122.967C0 95.3526 22.3858 72.9668 50 72.9668H414.41C438.711 72.9668 458.41 53.2673 458.41 28.9668C458.41 12.9689 471.379 0 487.377 0H1046Z";

export type LearnFeaturedSlide = { id: string; cardProps: CatalogShowcaseCardProps };

type FeaturedBp = "phone" | "tablet" | "desktop";

function useFeaturedBreakpoint() {
  const [bp, setBp] = useState<FeaturedBp>("phone");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1036px)");
    const tablet = window.matchMedia("(min-width: 744px)");
    const update = () => {
      if (desktop.matches) setBp("desktop");
      else if (tablet.matches) setBp("tablet");
      else setBp("phone");
    };
    update();
    desktop.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);

  return bp;
}

export function LearnFeaturedCoursesPanel({
  slides,
  hideNavOnMobile = false,
}: {
  slides: LearnFeaturedSlide[];
  hideNavOnMobile?: boolean;
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const bleedWrapRef = useRef<HTMLDivElement | null>(null);
  const bp = useFeaturedBreakpoint();
  const isLgUp = bp === "desktop";
  const isTablet = bp === "tablet";
  const bleedWidth = useBleedRightToViewport(bleedWrapRef, isLgUp);
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
  }, [handleNavSync, slides.length, bleedWidth, bp]);

  const cardW = isLgUp
    ? CATALOG_SHOWCASE_CARD_W
    : isTablet
      ? TABLET_CARD_W
      : MOBILE_FEATURED_CARD_W;
  const cardH = isLgUp
    ? CATALOG_SHOWCASE_CARD_H
    : isTablet
      ? CATALOG_SHOWCASE_CARD_H * (TABLET_CARD_W / CATALOG_SHOWCASE_CARD_W)
      : CATALOG_SHOWCASE_CARD_H * (MOBILE_FEATURED_CARD_W / CATALOG_SHOWCASE_CARD_W);
  const cardGap = isTablet ? TABLET_CARD_GAP_PX : learnCarouselSwiperBehavior.spaceBetween;

  const cardSwiperStyle = {
    ["--landing-showcase-card-w" as string]: `${cardW}px`,
    ["--landing-showcase-card-h" as string]: `${cardH}px`,
  } as const;

  return (
    <div
      ref={bleedWrapRef}
      className="relative max-lg:-ml-6 max-lg:w-[calc(100%+1.5rem)] sm:max-lg:-ml-8 sm:max-lg:w-[calc(100%+2rem)] max-[743px]:h-[674px] min-[744px]:max-lg:h-[646px] max-lg:overflow-x-visible max-lg:overflow-y-visible lg:ml-0 lg:min-w-0 lg:overflow-x-clip"
      style={
        isLgUp && bleedWidth
          ? { width: bleedWidth, height: DESKTOP_PANEL_H }
          : undefined
      }
    >
      {/* Phone shell — 6px from viewport left; extends past the right edge. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={MOBILE_SVG_W}
        height={MOBILE_PANEL_H}
        viewBox="0 0 473 674"
        fill="none"
        className="pointer-events-none absolute top-0 z-0 hidden max-[743px]:block"
        style={{
          left: MOBILE_SVG_LEFT_PX,
          width: MOBILE_SVG_W,
          height: MOBILE_PANEL_H,
        }}
        aria-hidden
      >
        <path d={MOBILE_SHELL_PATH} fill="var(--Green, #8AF396)" />
      </svg>

      {/* iPad shell — 1126×646, bleeds past the right edge. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={TABLET_PANEL_W}
        height={TABLET_PANEL_H}
        viewBox={`0 0 ${TABLET_PANEL_W} ${TABLET_PANEL_H}`}
        fill="none"
        className="pointer-events-none absolute top-0 z-0 hidden min-[744px]:max-lg:block"
        style={{
          left: TABLET_SVG_LEFT_PX,
          width: TABLET_PANEL_W,
          height: TABLET_PANEL_H,
        }}
        aria-hidden
      >
        <path d={TABLET_SHELL_PATH} fill="var(--Green, #8AF396)" />
      </svg>

      {/* Desktop shell */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={DESKTOP_PANEL_W}
        height={DESKTOP_PANEL_H}
        viewBox={`0 0 ${DESKTOP_PANEL_W} ${DESKTOP_PANEL_H}`}
        fill="none"
        className="pointer-events-none absolute top-0 z-0 hidden h-[646px] lg:block"
        style={{
          left: DESKTOP_SVG_LEFT_PX,
          width: `calc(100% - ${DESKTOP_SVG_LEFT_PX}px + ${DESKTOP_CURVE_HIDE_PX}px)`,
          height: DESKTOP_PANEL_H,
        }}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={DESKTOP_SHELL_PATH} fill="var(--Green, #8AF396)" />
      </svg>

      <div
        className="absolute inset-y-0 left-0 z-10 box-border flex w-full flex-col max-[743px]:pt-[136px] max-[743px]:pb-[50px] max-[743px]:pl-[30px] min-[744px]:max-lg:justify-end min-[744px]:max-lg:pb-[41px] min-[744px]:max-lg:pl-[48px] lg:pt-[116px] lg:pb-[42px] lg:pl-[81px]"
      >
        <div
          ref={scrollAreaRef}
          className="relative w-full min-w-0 shrink-0 overflow-y-visible max-lg:overflow-x-visible lg:overflow-x-clip"
          style={{
            minHeight: cardH,
            clipPath: isLgUp
              ? "inset(-200px 0 -200px 0)"
              : "inset(-200px -100vw -200px 0)",
            ...cardSwiperStyle,
          }}
        >
          <Swiper
            dir="ltr"
            modules={[Mousewheel]}
            {...learnCarouselSwiperBehavior}
            spaceBetween={cardGap}
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
                  width: cardW,
                  height: cardH,
                }}
              >
                <ScaledCatalogShowcaseCard
                  {...cardProps}
                  cardW={cardW}
                  cardH={cardH}
                  className="shrink-0"
                />
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
            hideNavOnMobile={hideNavOnMobile}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-30 w-full min-w-0">
        <div
          className="pointer-events-auto absolute inline-flex w-fit flex-row items-center gap-[11px] max-[743px]:left-[30px] max-[743px]:top-[30px] min-[744px]:max-lg:left-[61px] min-[744px]:max-lg:top-[20px] min-[744px]:max-lg:h-[41px] min-[744px]:max-lg:gap-[29px] lg:left-[57px] lg:top-[10px] lg:gap-[30px]"
        >
          <h1
            className="m-0 flex w-fit items-center uppercase leading-[120%] text-[color:var(--Black,#000)] min-[744px]:max-lg:h-[41px] min-[744px]:max-lg:leading-none"
            style={{ fontFamily: pangeaFont }}
          >
            <span className="text-[24px] font-semibold italic min-[744px]:max-lg:text-[32px] min-[744px]:max-lg:font-bold lg:text-[36px]">
              FEATURED
            </span>
            <span className="text-[24px] font-normal not-italic min-[744px]:max-lg:text-[32px] lg:text-[36px]">
              {"\u00A0"}COURSES
            </span>
          </h1>
          <button
            type="button"
            className="inline-flex size-[28px] shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40 min-[744px]:max-lg:size-[41px] lg:size-[46px]"
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
              width={28}
              height={28}
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden
              className="block size-[28px] min-[744px]:max-lg:size-[41px] lg:size-full"
            >
              <path
                d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47Z"
                fill="var(--White, #FFF)"
              />
              <path d="M24 33.2L33.2 24L24 14.8" fill="var(--White, #FFF)" />
              <path
                d="M24 14.8L33.2 24L24 33.2M33.2 24L14.8 24M47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1C36.7025 1 47 11.2975 47 24Z"
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
