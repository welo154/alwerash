"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnTrendingClassesHeading } from "@/components/learn/LearnTrendingClassesHeading";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

const MOBILE_COURSE_CAROUSEL_CARD_W = 315;
const MOBILE_COURSE_CAROUSEL_GAP = 20;
const MOBILE_COURSE_CAROUSEL_INSET_PX = 30;

function useIsLgUp() {
  const [isLgUp, setIsLgUp] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLgUp(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isLgUp;
}

export function LearnTrendingClassesSection({
  tiles = [],
  /**
   * `true` — full viewport breakout (centered).
   * `false` — stay inside the parent column.
   * `"right"` — keep the left edge, bleed to the viewport’s right edge (no white gutter).
   */
  fullBleed = true,
  hideNavOnMobile = false,
}: {
  tiles?: LearnPopularTile[];
  fullBleed?: boolean | "right";
  hideNavOnMobile?: boolean;
}) {
  const isLgUp = useIsLgUp();
  const bleedWrapRef = useRef<HTMLDivElement | null>(null);
  const bleedRight = fullBleed === "right";
  const bleedWidth = useBleedRightToViewport(bleedWrapRef, bleedRight);

  const slideW = isLgUp ? LEARN_POPULAR_FIGMA_TILE_W : MOBILE_COURSE_CAROUSEL_CARD_W;
  const slideGap = isLgUp ? learnCarouselSwiperBehavior.spaceBetween : MOBILE_COURSE_CAROUSEL_GAP;
  const slidesOffsetBefore = isLgUp ? 0 : MOBILE_COURSE_CAROUSEL_INSET_PX;

  const {
    scrollAreaRef,
    atBeginning,
    atEnd,
    handleSwiper,
    handleNavSync,
    slideNext,
    slidePrev,
  } = useLearnCarouselSwiper();

  if (tiles.length === 0) return null;

  const trackWrapClass =
    fullBleed === true
      ? "relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2"
      : bleedRight
        ? "relative max-lg:-ml-6 max-lg:mt-[35px] max-lg:w-screen max-lg:max-w-[100vw] max-lg:overflow-x-visible sm:max-lg:-ml-8 lg:mt-8 lg:max-w-none lg:overflow-x-clip lg:overflow-y-visible"
        : "relative mt-8 w-full min-w-0 max-w-full overflow-x-clip";

  const bleedWrapStyle =
    bleedRight && bleedWidth != null ? { width: bleedWidth } : undefined;

  return (
    <div className="min-w-0 w-full max-w-full">
      <LearnTrendingClassesHeading onNext={slideNext} atEnd={atEnd} />

      <div ref={bleedWrapRef} className={trackWrapClass} style={bleedWrapStyle}>
        <div
          ref={scrollAreaRef}
          className="relative w-full min-w-0 shrink-0 overflow-x-clip overflow-y-visible max-lg:overflow-x-visible"
          style={{
            clipPath:
              fullBleed === false
                ? "inset(-200px 0 -200px 0)"
                : "inset(-200px -100vw -200px 0)",
          }}
        >
          <Swiper
            dir="ltr"
            modules={[Mousewheel]}
            {...learnCarouselSwiperBehavior}
            spaceBetween={slideGap}
            slidesOffsetBefore={slidesOffsetBefore}
            mousewheel={learnCarouselMousewheel}
            className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full max-lg:max-w-none"
            onSwiper={handleSwiper}
            onSlideChange={handleNavSync}
            onSlidesUpdated={handleNavSync}
            onResize={handleNavSync}
          >
            {tiles.map((tile) => (
              <SwiperSlide
                key={tile.id}
                className="h-auto! shrink-0 overflow-visible!"
                style={{ width: slideW }}
              >
                <LearnPopularFigmaTile {...tile} />
              </SwiperSlide>
            ))}
          </Swiper>

          <LearnCarouselEdgeNav
            atBeginning={atBeginning}
            atEnd={atEnd}
            onPrev={slidePrev}
            onNext={slideNext}
            prevLabel="Previous recently added class"
            nextLabel="Next recently added class"
            hideNavOnMobile={hideNavOnMobile}
          />
        </div>
      </div>
    </div>
  );
}
