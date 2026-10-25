"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnAllCoursesHeading } from "@/components/learn/LearnAllCoursesHeading";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import { useCourseCarouselMetrics } from "@/components/learn/useCourseCarouselMetrics";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type {
  LearnAllCourseItem,
  LearnCourseTypeFilter,
} from "@/components/learn/learn-all-courses-types";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const DEEP_DIVE_MIN_LESSONS = 3;
const DEEP_DIVE_MIN_MINUTES = 45;

function filterByType(courses: LearnAllCourseItem[], type: LearnCourseTypeFilter): LearnAllCourseItem[] {
  if (type === "all") return courses;

  if (type === "topRated") {
    return [...courses].sort((a, b) => {
      const aRating = a.rating ?? -1;
      const bRating = b.rating ?? -1;
      return bRating - aRating;
    });
  }

  return courses.filter(
    (course) =>
      course.lessonCount >= DEEP_DIVE_MIN_LESSONS ||
      (course.totalDurationMinutes ?? 0) >= DEEP_DIVE_MIN_MINUTES
  );
}

export default function LearnAllCoursesSection({
  courses,
  /**
   * `true` — full viewport breakout (centered).
   * `false` — stay inside the parent column.
   * `"right"` — keep the left edge, bleed to the viewport’s right edge (no white gutter).
   */
  fullBleed = "right",
  hideNavOnMobile = false,
}: {
  courses: LearnAllCourseItem[];
  fullBleed?: boolean | "right";
  hideNavOnMobile?: boolean;
}) {
  const arabic = useArabicLayout();
  const { width: slideW, gap: slideGap, inset: slidesOffsetBefore } = useCourseCarouselMetrics();
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useState<LearnCourseTypeFilter>("all");
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

  const filteredCourses = useMemo(
    () => filterByType(courses, typeFilter),
    [courses, typeFilter]
  );

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "all" || typeParam === "topRated" || typeParam === "deepDive") {
      setTypeFilter(typeParam);
    } else if (typeParam == null) {
      setTypeFilter("all");
    }
  }, [searchParams]);

  if (courses.length === 0) return null;

  const trackWrapClass =
    fullBleed === true
      ? "relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2"
      : bleedRight
        ? "relative max-[743px]:-ms-6 max-[743px]:mt-[35px] max-lg:w-screen max-lg:max-w-[100vw] max-lg:overflow-x-visible sm:max-[743px]:-ms-8 min-[744px]:max-lg:-ms-8 min-[744px]:max-lg:mt-[40px] lg:mt-8 lg:max-w-none lg:overflow-x-clip lg:overflow-y-visible"
        : "relative mt-8 w-full min-w-0 max-w-full overflow-x-clip";

  const bleedWrapStyle =
    bleedRight && bleedWidth != null ? { width: bleedWidth } : undefined;

  return (
    <section
      id="all-courses"
      aria-label="All courses"
      className="relative z-0 min-w-0 w-full max-w-full scroll-mt-8"
    >
      <LearnAllCoursesHeading onNext={slideNext} atEnd={atEnd} />

      {filteredCourses.length === 0 ? (
        <p
          className="mt-8 text-center text-[20px] text-black/60"
          style={{ fontFamily: pangeaFont }}
        >
          No courses match these filters.
        </p>
      ) : (
        <div
          ref={bleedWrapRef}
          className={trackWrapClass}
          style={bleedWrapStyle}
        >
          <div
            key={typeFilter}
            ref={scrollAreaRef}
            className="relative w-full min-w-0 shrink-0 overflow-x-clip overflow-y-visible max-lg:overflow-x-visible"
            style={{
              clipPath:
                fullBleed === false
                  ? "inset(-200px 0 -200px 0)"
                  : arabic
                    ? "inset(-200px 0 -200px -100vw)"
                    : "inset(-200px -100vw -200px 0)",
            }}
          >
            <Swiper
              key={arabic ? "rtl" : "ltr"}
              dir={arabic ? "rtl" : "ltr"}
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
              {filteredCourses.map((course) => (
                <SwiperSlide
                  key={course.id}
                  className="h-auto! shrink-0 overflow-visible!"
                  style={{ width: slideW }}
                >
                  <LearnPopularFigmaTile {...course} />
                </SwiperSlide>
              ))}
            </Swiper>

            <LearnCarouselEdgeNav
              atBeginning={atBeginning}
              atEnd={atEnd}
              onPrev={slidePrev}
              onNext={slideNext}
              prevLabel="Previous courses"
              nextLabel="Next courses"
              hideNavOnMobile={hideNavOnMobile}
            />
          </div>
        </div>
      )}
    </section>
  );
}
