"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { LEARN_CAROUSEL_SLIDE_MS } from "./learn-carousel-swiper-config";

function syncNavState(
  swiper: SwiperType,
  setAtBeginning: (v: boolean) => void,
  setAtEnd: (v: boolean) => void
) {
  setAtBeginning(swiper.isBeginning);
  setAtEnd(swiper.isEnd);
}

export function useLearnCarouselSwiper(slideMs = LEARN_CAROUSEL_SLIDE_MS) {
  const swiperRef = useRef<SwiperType | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [atBeginning, setAtBeginning] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const wheelLockRef = useRef(false);

  const handleNavSync = useCallback((swiper: SwiperType) => {
    syncNavState(swiper, setAtBeginning, setAtEnd);
  }, []);

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      syncNavState(swiper, setAtBeginning, setAtEnd);
      requestAnimationFrame(() => {
        swiper.update();
        syncNavState(swiper, setAtBeginning, setAtEnd);
      });
    },
    []
  );

  const slideNext = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.isEnd) return;
    swiper.slideNext(slideMs);
  }, [slideMs]);

  const slidePrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.isBeginning) return;
    swiper.slidePrev(slideMs);
  }, [slideMs]);

  const stepOnce = useCallback(
    (direction: 1 | -1) => {
      if (wheelLockRef.current) return;
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (direction > 0 && swiper.isEnd) return;
      if (direction < 0 && swiper.isBeginning) return;

      wheelLockRef.current = true;
      if (direction > 0) swiper.slideNext(slideMs);
      else swiper.slidePrev(slideMs);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, slideMs + 80);
    },
    [slideMs]
  );

  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      if (absX <= absY) return;

      e.preventDefault();
      if (e.deltaX > 0) stepOnce(1);
      else stepOnce(-1);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [stepOnce]);

  return {
    scrollAreaRef,
    atBeginning,
    atEnd,
    handleSwiper,
    handleNavSync,
    slideNext,
    slidePrev,
  };
}
