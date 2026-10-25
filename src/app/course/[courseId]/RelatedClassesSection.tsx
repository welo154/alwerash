"use client";
// @refresh reset

import { useLayoutEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { useCourseCarouselMetrics } from "@/components/learn/useCourseCarouselMetrics";
import { useArabicLayout } from "@/components/providers/LocaleProvider";

type RelatedClassesSectionProps = {
  fontFamily: string;
  cards?: LearnPopularTile[];
};

/** First card sits this far from the visible page edge on desktop. */
const DESKTOP_EDGE_INSET_PX = 117;

/**
 * Full-bleed `100vw` is wider than the layout viewport when a scrollbar is present,
 * so a fixed padding lands a few pixels off the page edge. Measure the first card
 * and correct the start padding until it is exactly `DESKTOP_EDGE_INSET_PX`.
 */
function useDesktopPageEdgeInset(arabic: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const remeasure = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const padProp = arabic ? "paddingRight" : "paddingLeft";

    const apply = () => {
      if (!desktop.matches) {
        el.style.paddingLeft = "";
        el.style.paddingRight = "";
        return;
      }
      el.style[arabic ? "paddingLeft" : "paddingRight"] = "";
      const slide = el.querySelector<HTMLElement>(".swiper-slide");
      if (!slide) return;
      const box = slide.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      const current = arabic ? viewport - box.right : box.left;
      if (Math.abs(current - DESKTOP_EDGE_INSET_PX) <= 1) return;
      const currentPad = parseFloat(getComputedStyle(el)[padProp]) || 0;
      el.style[padProp] = `${Math.round(currentPad + (DESKTOP_EDGE_INSET_PX - current))}px`;
    };

    remeasure.current = apply;
    apply();
    const frame = requestAnimationFrame(apply);
    window.addEventListener("resize", apply);
    desktop.addEventListener("change", apply);
    return () => {
      el.style.paddingLeft = "";
      el.style.paddingRight = "";
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", apply);
      desktop.removeEventListener("change", apply);
    };
  }, [arabic]);

  return { ref, remeasure: () => remeasure.current() };
}

export function RelatedClassesSection({ fontFamily, cards = [] }: RelatedClassesSectionProps) {
  const arabic = useArabicLayout();
  const { ref: edgeRef, remeasure } = useDesktopPageEdgeInset(arabic);
  const { width: slideW, gap: slideGap } = useCourseCarouselMetrics();

  if (cards.length === 0) return null;

  return (
    <section className="mt-[70px] w-full max-lg:mt-[65px]">
      <div
        ref={edgeRef}
        className={`lg:relative lg:left-1/2 lg:w-screen lg:max-w-[100vw] lg:-translate-x-1/2 lg:overflow-x-clip ${
          arabic
            ? "max-[743px]:pr-[30px] min-[744px]:max-lg:mr-[31px] lg:pr-[117px] lg:pl-[60px]"
            : "max-[743px]:pl-[30px] min-[744px]:max-lg:ml-[31px] lg:pr-[60px] lg:pl-[117px]"
        }`}
      >
        <div
          dir="ltr"
          className={arabic ? "flex w-full flex-row-reverse items-center justify-start" : "flex items-center"}
        >
          <h2
            dir={arabic ? "rtl" : "ltr"}
            className="m-0 text-[24px] leading-[120%] text-[var(--Black,#000)] min-[744px]:max-lg:text-[32px] lg:text-[48px]"
            style={{ fontFamily, lineHeight: "120%" }}
          >
            {arabic ? (
              <>
                <span
                  style={{
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 400',
                  }}
                >
                  الفصول ذات
                </span>
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 600,
                    fontVariationSettings: '"wght" 600',
                  }}
                >
                  {"\u00A0"}
                  الصلــة
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 600,
                    fontVariationSettings: '"wght" 600',
                  }}
                >
                  RELATED
                </span>
                <span
                  style={{
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 400',
                  }}
                >
                  {" "}
                  CLASSES
                </span>
              </>
            )}
          </h2>
        </div>

        <div className="relative mt-[35px] min-[744px]:max-lg:mt-[40px] lg:mt-[50px]">
          <Swiper
            key={arabic ? "rtl" : "ltr"}
            dir={arabic ? "rtl" : "ltr"}
            slidesPerView="auto"
            spaceBetween={slideGap}
            slidesPerGroup={1}
            speed={450}
            grabCursor
            allowTouchMove
            simulateTouch
            className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
            onSwiper={() => remeasure()}
            onResize={() => remeasure()}
          >
            {cards.map((card) => (
              <SwiperSlide
                key={card.id}
                className="h-auto! shrink-0 overflow-visible!"
                style={{ width: slideW }}
              >
                <LearnPopularFigmaTile {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
