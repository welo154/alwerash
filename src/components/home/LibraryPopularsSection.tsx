"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

import { learnCarouselMousewheel } from "@/components/learn/learn-carousel-swiper-config";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import {
  ARTICLE_COVER_WIDTH,
  LibraryArticleCardVisual,
} from "@/components/library/LibraryArticleCardVisual";
import { LibraryMaterialCard } from "@/components/library/LibraryMaterialCard";
import { LIBRARY_BOOKS } from "@/components/library/library-books";
import {
  LibraryPodcastCard,
  PODCAST_CARD_FRAME_WIDTH,
  PODCAST_CARDS,
} from "@/components/library/LibraryPodcastsSection";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const FULL_BLEED = "w-screen max-w-[100vw] ml-[calc(50%-50vw)]";
const SWIPER_GAP_PX = 60;
const MOBILE_SECTION_INSET_PX = 30;

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

const pangeaFont = pangeaFontFamily;

const META_TEXT_STYLE = {
  fontFamily: pangeaFont,
  fontSize: "18px",
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "120%",
  width: "138px",
};

type PopularArticleSlide = {
  kind: "article";
  id: string;
  title: string;
  priceLabel: string;
};

type PopularSlide =
  | { kind: "book"; id: string; bookId: string }
  | PopularArticleSlide
  | { kind: "podcast"; id: string; podcastId: string };

const POPULAR_SLIDES: PopularSlide[] = [
  { kind: "book", id: "popular-book-0", bookId: LIBRARY_BOOKS[0]?.id ?? "mid-century-modern" },
  { kind: "article", id: "popular-article-1", title: "The Secret Lives of Color", priceLabel: "Free" },
  { kind: "podcast", id: "popular-podcast-0", podcastId: PODCAST_CARDS[0]?.id ?? "secret-lives-of-color" },
  { kind: "book", id: "popular-book-1", bookId: LIBRARY_BOOKS[1]?.id ?? LIBRARY_BOOKS[0]?.id ?? "mid-century-modern" },
  { kind: "podcast", id: "popular-podcast-1", podcastId: PODCAST_CARDS[1]?.id ?? PODCAST_CARDS[0]?.id ?? "secret-lives-of-color" },
  { kind: "article", id: "popular-article-2", title: "The Secret Lives of Color", priceLabel: "Free" },
  { kind: "book", id: "popular-book-2", bookId: LIBRARY_BOOKS[2]?.id ?? LIBRARY_BOOKS[0]?.id ?? "mid-century-modern" },
  { kind: "podcast", id: "popular-podcast-2", podcastId: PODCAST_CARDS[2]?.id ?? PODCAST_CARDS[0]?.id ?? "secret-lives-of-color" },
];

function ArticleCardFavoriteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      className="h-[19px] w-[21px] shrink-0"
      aria-hidden
    >
      <path
        d="M20.1815 2.47954C19.6684 1.94702 19.0591 1.52458 18.3886 1.23636C17.718 0.94815 16.9993 0.799805 16.2735 0.799805C15.5476 0.799805 14.8289 0.94815 14.1583 1.23636C13.4878 1.52458 12.8785 1.94702 12.3654 2.47954L11.3005 3.5842L10.2356 2.47954C9.19913 1.40438 7.79337 0.800362 6.32757 0.800362C4.86177 0.800362 3.45601 1.40438 2.41954 2.47954C1.38307 3.5547 0.800781 5.01293 0.800781 6.53344C0.800781 8.05395 1.38307 9.51218 2.41954 10.5873L11.3005 19.7998L20.1815 10.5873C20.6949 10.0551 21.1021 9.42309 21.3799 8.7275C21.6578 8.03192 21.8008 7.28637 21.8008 6.53344C21.8008 5.78051 21.6578 5.03496 21.3799 4.33938C21.1021 3.6438 20.6949 3.01182 20.1815 2.47954Z"
        fill="#FFF"
        stroke="#1E1E1E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryPopularArticleCard({ slide }: { slide: PopularArticleSlide }) {
  return (
    <article className="w-fit shrink-0">
      <LibraryArticleCardVisual clipId={slide.id} />
      <div className="mt-5 flex items-start gap-[30px]">
        <div className="min-w-0">
          <p className="m-0 text-black" style={META_TEXT_STYLE}>
            {slide.title}
          </p>
          <p
            className="m-0 mt-0.5"
            style={{ ...META_TEXT_STYLE, color: "rgba(0, 0, 0, 0.60)" }}
          >
            {slide.priceLabel}
          </p>
        </div>
        <button
          type="button"
          className="mt-0.5 shrink-0 rounded-sm hover:opacity-80"
          aria-label={`Save ${slide.title}`}
        >
          <ArticleCardFavoriteIcon />
        </button>
      </div>
    </article>
  );
}

function renderPopularSlide(slide: PopularSlide) {
  if (slide.kind === "book") {
    const book = LIBRARY_BOOKS.find((item) => item.id === slide.bookId) ?? LIBRARY_BOOKS[0];
    if (!book) return null;
    return <LibraryMaterialCard book={book} />;
  }

  if (slide.kind === "article") {
    return <LibraryPopularArticleCard slide={slide} />;
  }

  const podcast = PODCAST_CARDS.find((item) => item.id === slide.podcastId) ?? PODCAST_CARDS[0];
  if (!podcast) return null;
  return (
    <div className="-translate-y-[70px]">
      <LibraryPodcastCard card={podcast} />
    </div>
  );
}

function getSlideWidth(slide: PopularSlide): number | undefined {
  if (slide.kind === "book") return 194;
  if (slide.kind === "article") return ARTICLE_COVER_WIDTH;
  return PODCAST_CARD_FRAME_WIDTH;
}

export type LibraryPopularsSectionProps = {
  contentLeftPx?: number;
};

export function LibraryPopularsSection({ contentLeftPx }: LibraryPopularsSectionProps) {
  const { scrollAreaRef, handleSwiper, handleNavSync } = useLearnCarouselSwiper();
  const mobileSwiperInset = useMobileSwiperInset();

  const contentInsetClass =
    contentLeftPx != null ? "max-lg:pl-[30px] max-lg:pr-0 lg:pl-[120px]" : "";

  return (
    <div className="mt-[60px] -mb-[70px] last:mb-[60px] lg:mt-[72px]">
      <div
        className={`flex items-center gap-[13px] lg:gap-[26px] ${contentInsetClass}`}
      >
        <h2
          className="m-0 text-[24px] font-normal leading-[120%] text-black lg:text-[36px]"
          style={{ fontFamily: pangeaFont }}
        >
          LIBRARY POPULARS
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

      <div
        className={`${FULL_BLEED} relative mt-[64px] overflow-x-clip overflow-y-visible lg:ml-0 lg:w-full lg:max-w-none ${
          contentLeftPx != null ? "lg:pl-[120px] lg:pr-6" : "pr-6"
        }`}
      >
        <div
          ref={scrollAreaRef}
          className="relative w-full min-w-0 overflow-x-visible overflow-y-visible"
          style={{ clipPath: "inset(-160px -320px -160px 0)" }}
        >
          <Swiper
            dir="ltr"
            modules={[Mousewheel]}
            slidesPerView="auto"
            spaceBetween={SWIPER_GAP_PX}
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
            className="library-populars-swiper ml-0! mr-0! w-full min-w-0 max-w-full overflow-visible!"
            onSwiper={handleSwiper}
            onSlideChange={handleNavSync}
            onSlidesUpdated={handleNavSync}
            onResize={handleNavSync}
          >
            {POPULAR_SLIDES.map((slide) => {
              const width = getSlideWidth(slide);
              return (
                <SwiperSlide
                  key={slide.id}
                  className="h-auto! shrink-0 overflow-visible!"
                  style={width != null ? { width } : undefined}
                >
                  {renderPopularSlide(slide)}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
