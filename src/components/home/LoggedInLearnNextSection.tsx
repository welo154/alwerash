"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { CatalogShowcaseCard, LANDING_SHOWCASE_CAROUSEL_CARDS } from "@/components/cards";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const CARDS_SLIDE_MS = 450;

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

function HeaderArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 62" fill="none" width={60} height={60} aria-hidden>
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
  );
}

const recommendedDurationBySlug: Partial<Record<(typeof LANDING_SHOWCASE_CAROUSEL_CARDS)[number]["slug"], string>> = {
  "digital-illustration": "56h34m",
};

export function LoggedInLearnNextSection() {
  const cardsSwiperRef = useRef<SwiperType | null>(null);
  const [cardsAtEnd, setCardsAtEnd] = useState(false);
  const [cardsAtBeginning, setCardsAtBeginning] = useState(true);

  const syncCardsNav = (swiper: SwiperType) => {
    cardsSwiperRef.current = swiper;
    setCardsAtEnd(swiper.isEnd);
    setCardsAtBeginning(swiper.isBeginning);
  };

  return (
    <section className="mt-[88px] w-full bg-white py-[38px]" aria-label="What to learn next">
      <div className="mx-auto w-full max-w-[1339px]">
        <div className="flex items-center gap-[30px]">
          <h2
            className="m-0 uppercase"
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "48px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
              fontVariationSettings: '"wght" 400',
            }}
          >
            WHAT TO LEARN NEXT
          </h2>
          <HeaderArrowIcon />
        </div>
        <p
          className="mt-[6px] m-0"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "127%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          Recommended for you
        </p>
      </div>

      <div className="relative left-1/2 mt-[36px] w-screen -translate-x-1/2 overflow-hidden pl-[116px] pr-[88px]">
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
          className="overflow-visible!"
          onSwiper={(swiper) => {
            cardsSwiperRef.current = swiper;
            setCardsAtEnd(swiper.isEnd);
            setCardsAtBeginning(swiper.isBeginning);
            requestAnimationFrame(() => {
              setCardsAtEnd(swiper.isEnd);
              setCardsAtBeginning(swiper.isBeginning);
            });
          }}
          onSlideChange={syncCardsNav}
          onSlidesUpdated={syncCardsNav}
          onResize={syncCardsNav}
        >
          {LANDING_SHOWCASE_CAROUSEL_CARDS.map((card) => (
            <SwiperSlide key={card.slug} className="w-[347px]!">
              <CatalogShowcaseCard
                showcaseSlug={card.slug}
                titlePrimary={card.titlePrimary}
                titleSecondary={card.titleSecondary}
                levelLabel="Beginner"
                durationLabel={recommendedDurationBySlug[card.slug] ?? "12hrs"}
                viewMoreHref="/learn"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="absolute top-1/2 left-6 z-30 flex h-[43px] w-[43px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous courses"
          disabled={cardsAtBeginning}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const swiper = cardsSwiperRef.current;
            if (!swiper) return;
            swiper.slidePrev(CARDS_SLIDE_MS);
          }}
        >
          <CardsPrevIcon />
        </button>

        <button
          type="button"
          className="absolute top-1/2 right-6 z-30 flex h-[43px] w-[43px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next courses"
          disabled={cardsAtEnd}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const swiper = cardsSwiperRef.current;
            if (!swiper) return;
            swiper.slideNext(CARDS_SLIDE_MS);
          }}
        >
          <CardsNextIcon />
        </button>
      </div>
    </section>
  );
}

