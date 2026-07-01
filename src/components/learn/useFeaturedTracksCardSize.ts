"use client";

import { useEffect, useState, type RefObject } from "react";
import {
  CATALOG_SHOWCASE_CARD_H,
  CATALOG_SHOWCASE_CARD_W,
} from "@/components/cards";
import { learnCarouselSwiperBehavior } from "@/components/learn/learn-carousel-swiper-config";

const VISIBLE_TRACK_COUNT = 4;

export function useFeaturedTracksCardSize(
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [size, setSize] = useState({
    cardW: CATALOG_SHOWCASE_CARD_W,
    cardH: CATALOG_SHOWCASE_CARD_H,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const gap = learnCarouselSwiperBehavior.spaceBetween;

    const update = () => {
      const available = el.clientWidth;
      if (available <= 0) return;

      const cardW = Math.min(
        CATALOG_SHOWCASE_CARD_W,
        Math.floor((available - gap * (VISIBLE_TRACK_COUNT - 1)) / VISIBLE_TRACK_COUNT)
      );
      const cardH = Math.round(
        cardW * (CATALOG_SHOWCASE_CARD_H / CATALOG_SHOWCASE_CARD_W)
      );

      setSize((prev) =>
        prev.cardW === cardW && prev.cardH === cardH ? prev : { cardW, cardH }
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return size;
}
