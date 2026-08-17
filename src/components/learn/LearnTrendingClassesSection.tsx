"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnClassesCarouselHeading } from "@/components/learn/LearnClassesCarouselHeading";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

export function LearnTrendingClassesSection({
  tiles = [],
  /**
   * `true` — full viewport breakout (centered).
   * `false` — stay inside the parent column.
   * `"right"` — keep the left edge, bleed to the viewport’s right edge (no white gutter).
   */
  fullBleed = true,
}: {
  tiles?: LearnPopularTile[];
  fullBleed?: boolean | "right";
}) {
  const bleedWrapRef = useRef<HTMLDivElement | null>(null);
  const bleedRight = fullBleed === "right";
  const bleedWidth = useBleedRightToViewport(bleedWrapRef, bleedRight);

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
        ? "relative mt-8 max-w-none overflow-x-clip overflow-y-visible"
        : "relative mt-8 w-full min-w-0 max-w-full overflow-x-clip";

  return (
    <div className="min-w-0 w-full max-w-full">
      <LearnClassesCarouselHeading
        primary="RECENTLY"
        secondary="ADDED"
        onNext={slideNext}
        atEnd={atEnd}
        nextAriaLabel="Next recently added class"
        arrowGapPx={25}
        arrowSize={47}
      />

      <div
        ref={bleedWrapRef}
        className={trackWrapClass}
        style={bleedRight ? { width: bleedWidth ?? "100%" } : undefined}
      >
        <div
          ref={scrollAreaRef}
          className="relative w-full min-w-0 shrink-0 overflow-x-clip overflow-y-visible"
          style={{
            minHeight: LEARN_POPULAR_FIGMA_TILE_H,
            /* Clip left (protect sidebar); allow cards to exit past the right edge. */
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
            mousewheel={learnCarouselMousewheel}
            className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
            onSwiper={handleSwiper}
            onSlideChange={handleNavSync}
            onSlidesUpdated={handleNavSync}
            onResize={handleNavSync}
          >
            {tiles.map((tile) => (
              <SwiperSlide
                key={tile.id}
                className="h-auto! shrink-0 overflow-visible!"
                style={{ width: LEARN_POPULAR_FIGMA_TILE_W }}
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
          />
        </div>
      </div>
    </div>
  );
}
