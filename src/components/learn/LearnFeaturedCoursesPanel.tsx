"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { CatalogShowcaseCard, type CatalogShowcaseCardProps } from "@/components/cards";

const SLIDE_MS = 400;

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export type LearnFeaturedSlide = { id: string; cardProps: CatalogShowcaseCardProps };

export function LearnFeaturedCoursesPanel({ slides }: { slides: LearnFeaturedSlide[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-[1125px] shrink-0">
      <div className="relative h-[743px] w-[1125px] shrink-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={1125}
          height={743}
          viewBox="0 0 1125 743"
          fill="none"
          className="pointer-events-none block h-[743px] w-[1125px] shrink-0"
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

        <div className="absolute inset-0 z-10 box-border flex w-full flex-col pb-[42px] pl-[24.04px] pr-[24px] pt-[116px]">
          {/*
            Swiper viewport: 1055px wide from the first card’s left edge (inside pl-[24.04px]).
          */}
          <div className="w-[1055px] max-w-full min-w-0 shrink-0 overflow-hidden">
            <Swiper
              dir="ltr"
              slidesPerView="auto"
              spaceBetween={18}
              slidesPerGroup={1}
              speed={SLIDE_MS}
              grabCursor
              allowTouchMove
              simulateTouch
              watchOverflow
              className="learn-featured-swiper ml-0! mr-0! w-full min-w-0"
              onSwiper={(s) => {
                swiperRef.current = s;
              }}
            >
              {slides.map(({ id, cardProps }) => (
                <SwiperSlide key={id} className="w-auto!">
                  <CatalogShowcaseCard {...cardProps} className="shrink-0" />
                </SwiperSlide>
              ))}
            </Swiper>
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
                  fontStyle: "italic",
                  fontWeight: 600,
                  lineHeight: "57.6px",
                }}
              >
                FEATURED
              </span>
              <span
                style={{
                  fontFamily: pangeaFont,
                  color: "#000",
                  fontSize: "48px",
                  fontWeight: 400,
                  lineHeight: "57.6px",
                }}
              >
                {" "}
                COURSES
              </span>
            </h1>
          </div>
          <button
            type="button"
            className="-ml-[15px] inline-flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0"
            aria-label="Next featured courses"
            suppressHydrationWarning
            onClick={() => swiperRef.current?.slideNext(SLIDE_MS)}
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
