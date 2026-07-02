"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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

const TRENDING_AUTOPLAY_MS = 1400;
const TRENDING_SLIDE_MS = 450;
const MIN_LOOP_SLIDES = 8;

type LoopTile = LearnPopularTile & { loopKey: string };

function buildLoopTiles(tiles: LearnPopularTile[]): LoopTile[] {
  if (tiles.length === 0) return [];
  const targetCount = Math.max(MIN_LOOP_SLIDES, tiles.length * 2);
  const result: LoopTile[] = [];
  let round = 0;

  while (result.length < targetCount) {
    for (const tile of tiles) {
      result.push({ ...tile, loopKey: `${tile.id}-${round}` });
      if (result.length >= targetCount) break;
    }
    round += 1;
  }

  return result;
}

export function LearnTrendingClassesSection({
  tiles = [],
}: {
  tiles?: LearnPopularTile[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(false);
  const loopTiles = useMemo(() => buildLoopTiles(tiles), [tiles]);
  const canLoop = tiles.length > 1;

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    requestAnimationFrame(() => {
      swiper.update();
      if (canLoop) swiper.autoplay?.start();
    });
  }, [canLoop]);

  const slideNext = useCallback(() => {
    swiperRef.current?.slideNext(TRENDING_SLIDE_MS);
  }, []);

  const slidePrev = useCallback(() => {
    swiperRef.current?.slidePrev(TRENDING_SLIDE_MS);
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
      if (e.deltaX > 0) swiper.slideNext(TRENDING_SLIDE_MS);
      else swiper.slidePrev(TRENDING_SLIDE_MS);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, TRENDING_SLIDE_MS + 80);
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
          speed={TRENDING_SLIDE_MS}
          loop={canLoop}
          loopAdditionalSlides={tiles.length}
          loopPreventsSliding={false}
          autoplay={
            canLoop
              ? {
                  delay: TRENDING_AUTOPLAY_MS,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                }
              : false
          }
          mousewheel={learnCarouselMousewheel}
          className="learn-trending-swiper learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
          onSwiper={handleSwiper}
        >
          {loopTiles.map((tile) => (
            <SwiperSlide
              key={tile.loopKey}
              className="h-auto! shrink-0 overflow-visible!"
              style={{ width: LEARN_POPULAR_FIGMA_TILE_W }}
            >
              <LearnPopularFigmaTile
                id={tile.id}
                href={tile.href}
                title={tile.title}
                authorLabel={tile.authorLabel}
                tagPrimary={tile.tagPrimary}
                coverImageSrc={tile.coverImageSrc}
              />
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
