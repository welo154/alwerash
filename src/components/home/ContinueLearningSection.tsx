"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const DESKTOP_CARD_WIDTH_PX = 321;
const MOBILE_CARD_WIDTH_PX = 315;
const MOBILE_SWIPER_GAP_PX = 20;
const MOBILE_SECTION_INSET_PX = 30;
const TABLET_CARD_WIDTH_PX = 345;
const TABLET_SWIPER_GAP_PX = 33;
const TABLET_SECTION_INSET_PX = 61;
/** Overlap so the bottom card (260px) keeps 64px unintersected below the top card. */
const COURSE_CARD_STACK_OVERLAP_PX = 260 - 64;

const courseCardMetaMuted: CSSProperties = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  opacity: 0.6,
  fontVariationSettings: '"wght" 400',
};

const courseCardTopicTitle: CSSProperties = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  fontVariationSettings: '"wght" 400',
};

function ContinueCourseChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 43 43"
      fill="none"
      width={36}
      height={36}
      className="block h-[36px] w-[36px] shrink-0 overflow-visible"
      aria-hidden
    >
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="var(--White, #FFF)"
      />
      <path
        d="M21.25 29.45L29.45 21.25L21.25 13.05"
        fill="var(--White, #FFF)"
      />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke="var(--Black, #000)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CourseStackCard({
  titleInstructorLine,
  lectureLine,
  topicTitle,
  continueHref,
  widthPx = DESKTOP_CARD_WIDTH_PX,
}: ContinueLearningCardDto & { widthPx?: number }) {
  const scale = widthPx / DESKTOP_CARD_WIDTH_PX;
  const topHeightPx = Math.round(350 * scale);
  const bottomHeightPx = Math.round(260 * scale);
  const overlapPx = Math.round(COURSE_CARD_STACK_OVERLAP_PX * scale);

  const cardBase =
    "box-border w-full rounded-[50px] border border-[var(--Black,#000)]";

  return (
    <div className="relative shrink-0" style={{ width: widthPx }}>
      <div
        className={`relative z-1 ${cardBase}`}
        style={{
          height: topHeightPx,
          background: "var(--Grey, #E9E9E9)",
        }}
      >        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "48px", width: "78px", height: "78px" }}
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            fill="none"
            className="h-full w-full"
            style={{ color: "var(--White, #FFF)" }}
          >
            <path
              d="M40 79C61.5391 79 79 61.5391 79 40C79 18.4609 61.5391 1 40 1C18.4609 1 1 18.4609 1 40C1 61.5391 18.4609 79 40 79Z"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32.2 24.4L55.6 40L32.2 55.6V24.4Z"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div
        className={`relative z-2 flex w-full flex-col overflow-hidden ${cardBase}`}
        style={{
          height: bottomHeightPx,
          marginTop: `-${overlapPx}px`,
          background: "var(--White, #FFF)",
        }}
      >        <div className="flex min-h-0 flex-1 flex-col pt-[35px] pr-[35px] pl-[35px]">
          <p className="m-0 whitespace-pre-line" style={courseCardMetaMuted}>
            {titleInstructorLine}
          </p>
          <p className="m-0 mt-[61px]" style={courseCardMetaMuted}>
            {lectureLine}
          </p>
          <p className="m-0 mt-[9px]" style={courseCardTopicTitle}>
            {topicTitle}
          </p>
          <Link
            href={continueHref}
            className="relative mt-[9px] inline-flex shrink-0 pr-[18px] transition-opacity hover:opacity-90"
          >
            <span
              className="relative flex h-[37px] w-[127px] shrink-0 items-center justify-start border-[0.3px] border-[var(--White,#FFF)] pl-4 pr-4"
              style={{
                borderRadius: "var(--Radius-MD, 8px)",
                background: "var(--Dark-Green, #004B3C)",
              }}
            >
              <span
                className="leading-none"
                style={{
                  color: "var(--White, #FFF)",
                  fontFamily: pangeaFont,
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "19.6px",
                  fontVariationSettings: '"wght" 700',
                }}
              >
                CONTINUE
              </span>
              <span
                className="pointer-events-none absolute top-1/2 right-0 z-1 -translate-y-1/2 translate-x-[calc(50%-4px)]"
                aria-hidden
              >
                <ContinueCourseChevronIcon />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ContinueLearningSection({  courses,
  /** When false, skip the full-bleed rule above the heading (profile already has section rules). */
  showTopRule = true,
  className = "",
}: {
  courses: ContinueLearningCardDto[];
  showTopRule?: boolean;
  className?: string;
}) {
  if (courses.length === 0 && showTopRule) return null;

  return (
    <div className={className}>
      {showTopRule ? (
        <div
          className="relative left-1/2 mt-[31px] hidden h-px w-screen max-w-[100vw] -translate-x-1/2 bg-black lg:block"
          aria-hidden
        />
      ) : null}

      <div className="max-[743px]:pl-[30px] max-[743px]:pr-0 min-[744px]:max-lg:pl-[61px] min-[744px]:max-lg:pr-0 lg:pl-[120px] lg:pr-[69px]">
        <h2
          className={`${showTopRule ? "max-lg:mt-0 lg:mt-[40px]" : ""} m-0 w-full uppercase min-[744px]:hidden`}
        >
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            CONTINUE{" "}
          </span>
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
            }}
          >
            LEARNING
          </span>
        </h2>

        <h2
          className={`${showTopRule ? "max-lg:mt-0" : ""} m-0 hidden w-full uppercase min-[744px]:block lg:hidden`}
        >
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 32,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            CONTINUE{" "}
          </span>
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 32,
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
            }}
          >
            LEARNING
          </span>
        </h2>

        <h2
          className={`${showTopRule ? "mt-[40px]" : ""} hidden w-full uppercase lg:block`}
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          CONTINUE{" "}
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "36px",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
              fontVariationSettings: '"wght" 700',
            }}
          >
            LEARNING
          </span>
        </h2>
      </div>

      <div className="relative left-1/2 mt-[31px] w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip min-[744px]:hidden">
        <Swiper
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
          {courses.map((course) => (
            <SwiperSlide key={course.continueHref} className="w-[315px]!">
              <CourseStackCard {...course} widthPx={MOBILE_CARD_WIDTH_PX} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="relative left-1/2 mt-[48px] hidden w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip min-[744px]:block lg:hidden">
        <Swiper
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
          {courses.map((course) => (
            <SwiperSlide key={`tablet-${course.continueHref}`} className="w-[345px]!">
              <CourseStackCard {...course} widthPx={TABLET_CARD_WIDTH_PX} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="lg:pl-[120px] lg:pr-[69px]">
        <div className="mt-[34px] hidden flex-wrap gap-[30px] lg:flex">
          {courses.map((course) => (
            <CourseStackCard key={course.continueHref} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}