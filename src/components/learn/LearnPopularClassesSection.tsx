"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnPopularClassesHeading } from "@/components/learn/LearnPopularClassesHeading";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

export type { LearnPopularTile } from "@/components/learn/learn-popular-types";

export function LearnPopularClassesSection({
  tiles = [],
}: {
  tiles?: LearnPopularTile[];
}) {
  const {
    scrollAreaRef,
    atBeginning,
    atEnd,
    handleSwiper,
    handleNavSync,
    slideNext,
    slidePrev,
  } = useLearnCarouselSwiper();

  return (
    <div className="min-w-0 w-full max-w-full">
      <LearnPopularClassesHeading onNext={slideNext} atEnd={atEnd} />

      <div
        ref={scrollAreaRef}
        className="relative mt-8 w-full min-w-0 shrink-0 overflow-x-visible overflow-y-visible"
        style={{
          minHeight: tiles.length > 0 ? LEARN_POPULAR_FIGMA_TILE_H : undefined,
          clipPath: "inset(-200px -200vw -200px 0)",
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
          prevLabel="Previous popular class"
          nextLabel="Next popular class"
        />
      </div>
    </div>
  );
}
