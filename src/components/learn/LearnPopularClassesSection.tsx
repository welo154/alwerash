"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { LearnPopularClassesHeading } from "@/components/learn/LearnPopularClassesHeading";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

const SLIDE_MS = 400;

export type { LearnPopularTile } from "@/components/learn/learn-popular-types";

export function LearnPopularClassesSection({
  tiles = [],
}: {
  tiles?: LearnPopularTile[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="min-w-0 w-full max-w-full">
      <LearnPopularClassesHeading onNext={() => swiperRef.current?.slideNext(SLIDE_MS)} />

      <div
        className="mt-8 w-[1125px] max-w-full min-w-0 shrink-0 overflow-x-hidden overflow-y-visible"
        style={{ minHeight: tiles.length > 0 ? LEARN_POPULAR_FIGMA_TILE_H : undefined }}
      >
        <Swiper
          dir="ltr"
          slidesPerView="auto"
          spaceBetween={18}
          slidesPerGroup={1}
          speed={SLIDE_MS}
          autoHeight
          grabCursor
          allowTouchMove
          simulateTouch
          watchOverflow
          className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
        >
          {tiles.map((tile) => (
            <SwiperSlide
              key={tile.id}
              className="h-auto! shrink-0"
              style={{ width: LEARN_POPULAR_FIGMA_TILE_W }}
            >
              <LearnPopularFigmaTile {...tile} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
