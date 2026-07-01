"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import type { CatalogShowcaseCardProps } from "@/components/cards";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { ScaledCatalogShowcaseCard } from "@/components/learn/ScaledCatalogShowcaseCard";
import { useFeaturedTracksCardSize } from "@/components/learn/useFeaturedTracksCardSize";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

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
  const { cardW, cardH } = useFeaturedTracksCardSize(scrollAreaRef);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.update();
    handleNavSync(swiper);
  }, [cardW, cardH, handleNavSync]);

  const cardSwiperStyle = {
    ["--landing-showcase-card-w" as string]: `${cardW}px`,
    ["--landing-showcase-card-h" as string]: `${cardH}px`,
  } as const;
  return (
    <div className="relative w-full min-w-0">
      <div className="relative h-[743px] w-full min-w-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={1125}
          height={743}
          viewBox="0 0 1125 743"
          fill="none"
          className="pointer-events-none block h-[743px] w-full min-w-0"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1070 0C1100.38 0.000247619 1125 24.6245 1125 55V688C1125 718.375 1100.38 743 1070 743H54.999C24.6236 743 1.65915e-06 718.375 0 688V134C0 106.386 22.3858 84 50 84H535.999C560.3 84 580 64.3005 580 40C580 17.9086 597.909 0 620 0H1070Z"
            fill="#8AF396"
          />
        </svg>

        <div className="absolute inset-0 z-10 box-border flex w-full flex-col px-[24px] pb-[42px] pt-[116px]">
          <div
            ref={scrollAreaRef}
            className="relative w-full min-w-0 shrink-0 overflow-x-visible overflow-y-visible"
            style={{
              minHeight: cardH,
              clipPath: "inset(-200px 0 -200px 0)",
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
                  style={{ width: cardW, height: cardH }}
                >
                  <ScaledCatalogShowcaseCard cardW={cardW} cardH={cardH} {...cardProps} className="shrink-0" />
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
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-30 w-full min-w-0">
        <div className="pointer-events-auto absolute left-0 top-0 flex items-center gap-4">
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
