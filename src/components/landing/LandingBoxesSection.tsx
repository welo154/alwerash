"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { CatalogShowcaseCard, LANDING_SHOWCASE_CAROUSEL_CARDS } from "@/components/cards";
import "swiper/css";

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

const TAGS = [
  "FEATURED",
  "DRAWING & PAINTING",
  "ANIMATION",
  "UI/UX DESIGN",
  "CREATIVE WRITING",
  "DIGITAL ILLUSTRATION",
  "FILM & VIDEO",
  "CRAFTS",
  "GRAPHIC DESIGN",
  "TYPOGRAPHY",
  "PRODUCTIVITY",
];

const CARDS_SLIDE_MS = 450;

const TAGS_ROW_2 = [
  "PHOTOGRAPHY",
  "ACTIVITY",
  "MARKETING",
  "ART & DESIGN",
  "MOTION",
  "BRANDING",
  "3D & VFX",
  "ILLUSTRATION",
  "VIDEO EDITING",
  "SOCIAL MEDIA",
  "BUSINESS",
];

export function LandingBoxesSection() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTagRow2, setActiveTagRow2] = useState<string | null>(null);
  const cardsSwiperRef = useRef<SwiperType | null>(null);
  const [cardsAtEnd, setCardsAtEnd] = useState(false);
  const [cardsAtBeginning, setCardsAtBeginning] = useState(true);

  /** Sync nav disabled state only — never call `swiper.update()` here (it fires `onSlidesUpdated` → recursion). */
  const syncCardsNav = (swiper: SwiperType) => {
    cardsSwiperRef.current = swiper;
    setCardsAtEnd(swiper.isEnd);
    setCardsAtBeginning(swiper.isBeginning);
  };

  return (
    <section className="mt-[107px] w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={25}
            grabCursor
            autoplay={{ delay: 2400, disableOnInteraction: false, stopOnLastSlide: true }}
            className="overflow-visible!"
          >
            {TAGS.map((tag, i) => (
              <SwiperSlide key={tag} className="w-auto!">
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={activeTag === tag}
                  className={`inline-flex h-[45px] items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black ${
                    activeTag === tag ? "bg-[#59CBE8]" : "bg-white"
                  }`}
                  style={{
                    fontFamily:
                      '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                    lineHeight: "19.6px",
                  }}
                >
                  {tag}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative left-1/2 mt-[11px] w-screen -translate-x-1/2 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={25}
            grabCursor
            autoplay={{ delay: 2600, disableOnInteraction: false, stopOnLastSlide: true }}
            className="overflow-visible!"
          >
            {TAGS_ROW_2.map((tag) => (
              <SwiperSlide key={tag} className="w-auto!">
                <button
                  type="button"
                  onClick={() => setActiveTagRow2(tag)}
                  aria-pressed={activeTagRow2 === tag}
                  className={`inline-flex h-[45px] items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black ${
                    activeTagRow2 === tag ? "bg-[#59CBE8]" : "bg-white"
                  }`}
                  style={{
                    fontFamily:
                      '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                    lineHeight: "19.6px",
                  }}
                >
                  {tag}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative left-1/2 mt-[64px] w-screen -translate-x-1/2 overflow-hidden pl-[116px] pr-[88px]">
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

        <div className="relative left-1/2 mt-[65px] w-screen -translate-x-1/2">
          <div className="flex min-h-[216px] flex-wrap items-center justify-between gap-6 pl-[116px] pr-[96px]">
            <p
              className="w-[612px] max-w-full text-[24px] font-normal not-italic leading-[127%] text-black"
              style={{
                fontFamily:
                  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
              }}
            >
              Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by
              industry professionals.
            </p>
            <Link
              href="/learn"
              className="inline-flex h-[91px] w-[247px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[36px] font-normal not-italic leading-[19.6px] text-[color:var(--Text-Primary,#141413)] no-underline transition-opacity hover:opacity-90"
              style={{
                fontFamily:
                  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                backgroundColor: "var(--Blue, #64E1FF)",
              }}
            >
              Discover
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
