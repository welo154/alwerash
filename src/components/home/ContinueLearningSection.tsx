import Link from "next/link";
import type { CSSProperties } from "react";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

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

function ViewAllCoursesLink() {
  return (
    <Link
      href="/course"
      className="ml-auto flex shrink-0 items-center gap-[21px] transition-opacity hover:opacity-80"
    >
      <span
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          fontVariationSettings: '"wght" 400',
        }}
      >
        VIEW ALL
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={45}
        height={45}
        viewBox="0 0 46 46"
        fill="none"
        className="shrink-0"
        aria-hidden
      >
        <path
          d="M23 45.5C35.4264 45.5 45.5 35.4264 45.5 23C45.5 10.5736 35.4264 0.5 23 0.5C10.5736 0.5 0.5 10.5736 0.5 23C0.5 35.4264 10.5736 45.5 23 45.5Z"
          fill="var(--White, #FFF)"
        />
        <path d="M23 32L32 23L23 14" fill="var(--White, #FFF)" />
        <path
          d="M23 14L32 23L23 32M32 23L14 23M45.5 23C45.5 35.4264 35.4264 45.5 23 45.5C10.5736 45.5 0.5 35.4264 0.5 23C0.5 10.5736 10.5736 0.5 23 0.5C35.4264 0.5 45.5 10.5736 45.5 23Z"
          stroke="var(--Black, #000)"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function CourseStackCard({
  titleInstructorLine,
  lectureLine,
  topicTitle,
  continueHref,
}: ContinueLearningCardDto) {
  const cardBase =
    "box-border w-full max-w-[321px] rounded-[50px] border border-[var(--Black,#000)]";

  return (
    <div className="relative w-[321px] max-w-full shrink-0">
      <div
        className={`relative z-1 ${cardBase}`}
        style={{
          height: "350px",
          background: "var(--Grey, #E9E9E9)",
        }}
      >
        <div
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
        className={`relative z-2 flex h-[260px] w-[321px] max-w-full flex-col overflow-hidden ${cardBase}`}
        style={{
          marginTop: `-${COURSE_CARD_STACK_OVERLAP_PX}px`,
          background: "var(--White, #FFF)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col pt-[35px] pr-[35px] pl-[35px]">
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

export function ContinueLearningSection({
  courses,
  /** When false, skip the full-bleed rule above the heading (profile already has section rules). */
  showTopRule = true,
  className = "",
}: {
  courses: ContinueLearningCardDto[];
  showTopRule?: boolean;
  className?: string;
}) {
  if (courses.length === 0) return null;

  return (
    <div className={className}>
      {showTopRule ? (
        <div
          className="relative left-1/2 mt-[31px] h-px w-screen max-w-[100vw] -translate-x-1/2 bg-black"
          aria-hidden
        />
      ) : null}

      <div className="pl-[120px] pr-[69px]">
        <h2
          className={`${showTopRule ? "mt-[40px]" : ""} w-full uppercase`}
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

        <div className="mt-[34px] flex w-full flex-wrap items-center justify-start gap-y-6">
          <div className="flex flex-wrap gap-[30px]">
            {courses.map((course) => (
              <CourseStackCard key={course.continueHref} {...course} />
            ))}
          </div>
          <ViewAllCoursesLink />
        </div>
      </div>
    </div>
  );
}
