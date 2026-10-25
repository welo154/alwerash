"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import {
  ActivityScheduleCard,
  ActivityScheduleMobileCard,
} from "@/components/home/ActivityScheduleCard";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import { useT } from "@/components/i18n/Tr";
import { ActivityProgressMobileCard } from "@/components/home/ActivityProgressMobileCard";
import { WeeklyActivityBarCard } from "@/components/home/WeeklyActivityBarCard";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const MOBILE_SWIPER_GAP_PX = 20;
const MOBILE_SECTION_INSET_PX = 30;
const TABLET_SWIPER_GAP_PX = 33;
const TABLET_SECTION_INSET_PX = 61;
const DESKTOP_SWIPER_GAP_PX = 30;
const DESKTOP_SECTION_INSET_PX = 120;

export function TrackActivitySection({
  weeklyActivity,
  activityHighlightDayIndex,
  learningProgressPercent,
  className = "",
}: {
  weeklyActivity: WeeklyActivitySummary;
  activityHighlightDayIndex: number;
  learningProgressPercent: number;
  className?: string;
}) {
  const arabic = useArabicLayout();
  const t = useT();
  return (
    <section
      className={`w-full max-lg:px-0 ${arabic ? "lg:pr-[120px] lg:pl-6" : "lg:pl-[120px] lg:pr-6"} ${className}`.trim()}
      aria-label="Activity tracking"
    >
      <div className={arabic ? "text-right max-[743px]:pr-[30px] min-[744px]:max-lg:pr-[61px] max-lg:pl-0" : "max-[743px]:pl-[30px] min-[744px]:max-lg:pl-[61px] max-lg:pr-0"}>
        <h2
          className="m-0 uppercase min-[744px]:hidden"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          {arabic ? "تتبع نشاطك" : t("TRACK YOUR ACTIVITY")}
        </h2>

        <h2
          className="m-0 hidden uppercase min-[744px]:block lg:hidden"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 32,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            textAlign: arabic ? "right" : undefined,
          }}
        >
          {arabic ? "تتبع نشاطك" : t("TRACK YOUR ACTIVITY")}
        </h2>

        <h2
          className="m-0 hidden uppercase lg:block"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: arabic ? 40 : "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
            textAlign: arabic ? "right" : undefined,
          }}
        >
          {arabic ? "تتبع نشاطك" : t("TRACK YOUR ACTIVITY")}
        </h2>
      </div>

      <div className="relative left-1/2 mt-[28px] w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip min-[744px]:hidden">
        <Swiper
          key={arabic ? "rtl" : "ltr"}
          dir={arabic ? "rtl" : "ltr"}
          slidesPerView="auto"
          spaceBetween={MOBILE_SWIPER_GAP_PX}
          slidesPerGroup={1}
          slidesOffsetBefore={MOBILE_SECTION_INSET_PX}
          speed={400}
          grabCursor
          allowTouchMove
          simulateTouch
          className="overflow-visible!"
        >
          <SwiperSlide className="w-[315px]!">
            <ActivityProgressMobileCard
              progressPercent={learningProgressPercent}
              showTrackTicks
            />
          </SwiperSlide>
          <SwiperSlide className="w-[315px]!">
            <WeeklyActivityBarCard
              summary={weeklyActivity}
              highlightDayIndex={activityHighlightDayIndex}
              variant="mobile"
            />
          </SwiperSlide>
          <SwiperSlide className="w-[315px]!">
            <ActivityScheduleMobileCard />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="relative left-1/2 mt-[45px] hidden w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip min-[744px]:block lg:hidden">
        <Swiper
          key={arabic ? "rtl-tablet" : "ltr-tablet"}
          dir={arabic ? "rtl" : "ltr"}
          slidesPerView="auto"
          spaceBetween={TABLET_SWIPER_GAP_PX}
          slidesPerGroup={1}
          slidesOffsetBefore={TABLET_SECTION_INSET_PX}
          speed={400}
          grabCursor
          allowTouchMove
          simulateTouch
          className="overflow-visible!"
        >
          <SwiperSlide className="w-[445px]!">
            <ActivityProgressMobileCard
              progressPercent={learningProgressPercent}
              showTrackTicks
              variant="tablet"
            />
          </SwiperSlide>
          <SwiperSlide className="w-[445px]!">
            <WeeklyActivityBarCard
              summary={weeklyActivity}
              highlightDayIndex={activityHighlightDayIndex}
              variant="tablet"
            />
          </SwiperSlide>
          <SwiperSlide className="w-[445px]!">
            <ActivityScheduleMobileCard variant="tablet" />
          </SwiperSlide>
        </Swiper>
      </div>

      <div
        className="relative mt-[43px] hidden overflow-x-clip lg:block"
        data-lenis-prevent-horizontal
        style={{
          marginLeft: arabic ? -24 : -DESKTOP_SECTION_INSET_PX,
          width: `calc(100% + ${DESKTOP_SECTION_INSET_PX + 24}px)`,
        }}
      >
        <Swiper
          key={arabic ? "rtl-desktop" : "ltr-desktop"}
          dir={arabic ? "rtl" : "ltr"}
          modules={[Mousewheel]}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 1,
            thresholdDelta: 4,
            thresholdTime: 400,
          }}
          slidesPerView="auto"
          spaceBetween={DESKTOP_SWIPER_GAP_PX}
          slidesPerGroup={1}
          slidesOffsetBefore={DESKTOP_SECTION_INSET_PX}
          slidesOffsetAfter={DESKTOP_SECTION_INSET_PX}
          speed={400}
          grabCursor
          allowTouchMove
          simulateTouch
          threshold={10}
          touchReleaseOnEdges
          touchStartPreventDefault={false}
          className="learn-popular-swiper overflow-hidden!"
        >
          <SwiperSlide className="w-[445px]!">
            <ActivityProgressMobileCard
              progressPercent={learningProgressPercent}
              showTrackTicks
              variant="desktop"
            />
          </SwiperSlide>
          <SwiperSlide className="w-[445px]!">
            <WeeklyActivityBarCard
              summary={weeklyActivity}
              highlightDayIndex={activityHighlightDayIndex}
            />
          </SwiperSlide>
          <SwiperSlide className="w-[727px]!">
            <ActivityScheduleCard />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
