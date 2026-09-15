"use client";

import { useEffect, useState } from "react";
import { learnCarouselSwiperBehavior } from "@/components/learn/learn-carousel-swiper-config";

/** Same as Continue Learning on iPad. */
export const COURSE_SWIPER_TABLET = { width: 345, gap: 33, inset: 61 } as const;
export const COURSE_SWIPER_MOBILE = { width: 315, gap: 20, inset: 30 } as const;
/** Desktop tile width — keep in sync with `LEARN_POPULAR_FIGMA_TILE_W`. */
const DESKTOP_TILE_W = 346;

export function useCourseCarouselMetrics() {
  const [metrics, setMetrics] = useState({
    width: COURSE_SWIPER_MOBILE.width,
    gap: COURSE_SWIPER_MOBILE.gap,
    inset: COURSE_SWIPER_MOBILE.inset,
    isLgUp: false,
  });

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1036px)");
    const tablet = window.matchMedia("(min-width: 744px)");
    const update = () => {
      if (desktop.matches) {
        setMetrics({
          width: DESKTOP_TILE_W,
          gap: learnCarouselSwiperBehavior.spaceBetween,
          inset: 0,
          isLgUp: true,
        });
        return;
      }
      if (tablet.matches) {
        setMetrics({
          width: COURSE_SWIPER_TABLET.width,
          gap: COURSE_SWIPER_TABLET.gap,
          inset: COURSE_SWIPER_TABLET.inset,
          isLgUp: false,
        });
        return;
      }
      setMetrics({
        width: COURSE_SWIPER_MOBILE.width,
        gap: COURSE_SWIPER_MOBILE.gap,
        inset: COURSE_SWIPER_MOBILE.inset,
        isLgUp: false,
      });
    };
    update();
    desktop.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);

  return metrics;
}
