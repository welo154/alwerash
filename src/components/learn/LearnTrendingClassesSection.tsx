"use client";

import { useCallback, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnClassesCarouselHeading } from "@/components/learn/LearnClassesCarouselHeading";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

const TRENDING_AUTOPLAY_MS = 2000;

export function LearnTrendingClassesSection({
  tiles = [],
}: {
  tiles?: LearnPopularTile[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(false);
  const canLoop = tiles.length > 1;

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    requestAnimationFrame(() => swiper.update());
  }, []);

  const slideNext = useCallback(() => {
    swiperRef.current?.slideNext(400);
  }, []);

  const slidePrev = useCallback(() => {
    swiperRef.current?.slidePrev(400);
  }, []);

  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      if (e.deltaX > 0) swiper.slideNext(400);
      else swiper.slidePrev(400);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 480);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  if (tiles.length === 0) return null;

  return (
    <div className="min-w-0 w-full max-w-full">
      <LearnClassesCarouselHeading
        primary="TRENDING"
        onNext={slideNext}
        atEnd={false}
        nextAriaLabel="Next trending class"
      />

      <div
        ref={scrollAreaRef}
        className="relative mt-8 w-full min-w-0 shrink-0 overflow-x-visible overflow-y-visible"
        style={{
          minHeight: LEARN_POPULAR_FIGMA_TILE_H,
          clipPath: "inset(-200px -200vw -200px 0)",
        }}
      >
        <Swiper
          dir="ltr"
          modules={[Mousewheel, Autoplay]}
          {...learnCarouselSwiperBehavior}
          loop={canLoop}
          autoplay={
            canLoop
              ? {
                  delay: TRENDING_AUTOPLAY_MS,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          mousewheel={learnCarouselMousewheel}
          className="learn-trending-swiper learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
          onSwiper={handleSwiper}
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
          atBeginning={false}
          atEnd={false}
          onPrev={slidePrev}
          onNext={slideNext}
          prevLabel="Previous trending class"
          nextLabel="Next trending class"
        />
      </div>
    </div>
  );
}
