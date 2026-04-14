import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const PURPLE = "#FF8CFF";

/** Overlap between stacked course cards: grey (378px) and white (281px) per spec (281 − 69). */
const COURSE_CARD_STACK_OVERLAP_PX = 281 - 69;

const courseCardMetaMuted: CSSProperties = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  opacity: 0.6,
  fontVariationSettings: '"wght" 400',
};

const courseCardTopicTitle: CSSProperties = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  fontVariationSettings: '"wght" 400',
};

type CourseStackCardProps = {
  /** Use `\n` for a line break before the instructor name. */
  titleInstructorLine: string;
  lectureLine: string;
  topicTitle: string;
  continueHref: string;
};

function ContinueCourseChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 43 43"
      fill="none"
      width={41}
      height={41}
      className="shrink-0"
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
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ViewAllCoursesLink() {
  return (
    <Link
      href="/learn"
      className="ml-[23px] flex shrink-0 items-center gap-[24px] transition-opacity hover:opacity-80"
    >
      <span
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
        VIEW ALL
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 62 62"
        fill="none"
        className="shrink-0"
        width={60}
        height={60}
        aria-hidden
      >
        <path
          d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z"
          fill="var(--White, #FFF)"
        />
        <path d="M31 43L43 31L31 19" fill="var(--White, #FFF)" />
        <path
          d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
          stroke="var(--Black, #000)"
          strokeWidth={2}
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
}: CourseStackCardProps) {
  const cardBase =
    "box-border w-full max-w-[347px] rounded-[50px] border border-[var(--Black,#000)]";

  return (
    <div className="relative w-[347px] max-w-full shrink-0">
      <div
        className={`relative z-1 ${cardBase}`}
        style={{
          height: "378px",
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
            style={{ color: "var(--Black, #000)" }}
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
        className={`relative z-2 flex min-h-[281px] flex-col overflow-hidden ${cardBase}`}
        style={{
          marginTop: `-${COURSE_CARD_STACK_OVERLAP_PX}px`,
          background: "var(--White, #FFF)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col py-[23px] pl-[37px]">
          <p className="m-0 whitespace-pre-line" style={courseCardMetaMuted}>
            {titleInstructorLine}
          </p>
          <p className="m-0 mt-[70px]" style={courseCardMetaMuted}>
            {lectureLine}
          </p>
          <p className="m-0 mt-[6px]" style={courseCardTopicTitle}>
            {topicTitle}
          </p>
          <Link
            href={continueHref}
            className="relative mt-[17px] inline-flex shrink-0 pr-[calc(41px/2)] transition-opacity hover:opacity-90"
          >
            <span
              className="flex h-[43px] w-[145px] shrink-0 items-center justify-center border border-[var(--White,#FFF)] px-4"
              style={{
                borderRadius: "var(--Radius-MD, 8px)",
                background: "var(--Dark-Green, #004B3C)",
              }}
            >
              <span
                style={{
                  color: "var(--White, #FFF)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                  fontVariationSettings: '"wght" 700',
                }}
              >
                CONTINUE
              </span>
            </span>
            <span
              className="absolute left-[145px] top-1/2 z-1 -translate-x-1/2 -translate-y-1/2"
              aria-hidden
            >
              <ContinueCourseChevronIcon />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export type LoggedInHomeProps = {
  userName: string;
  userImage: string | null;
  /** Profession (preferred) or country — shown immediately left of Edit with 11px gap */
  subtitleLeftOfEdit: string | null;
  /** In-progress courses with a next lesson; empty hides the Continue learning block. */
  continueLearningCourses: ContinueLearningCardDto[];
};

export function LoggedInHome({
  userName,
  userImage,
  subtitleLeftOfEdit,
  continueLearningCourses,
}: LoggedInHomeProps) {
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-white font-sans">
      <section
        className="bg-white px-6 sm:px-10 md:px-[80px]"
        style={{ paddingTop: "58px", fontFamily: pangeaFont }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-[17px]">
          <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-full border-2 border-black">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center bg-white text-[27px] font-bold text-black"
                style={{ fontVariationSettings: '"wght" 700' }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="uppercase">
              <span
                style={{
                  color: "#000",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                  fontVariationSettings: '"wght" 400',
                }}
              >
                WELCOME BACK,{" "}
              </span>
              <span
                style={{
                  color: "#000",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                  fontVariationSettings: '"wght" 600',
                }}
              >
                {firstName.toUpperCase()}!
              </span>
            </h1>

            <p
              className="mt-[3px] flex flex-wrap items-baseline"
              style={{ gap: subtitleLeftOfEdit ? "11px" : 0 }}
            >
              {subtitleLeftOfEdit ? (
                <span
                  style={{
                    color: "#000",
                    fontFamily: pangeaFont,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                    opacity: 0.6,
                    fontVariationSettings: '"wght" 400',
                  }}
                >
                  {subtitleLeftOfEdit}
                </span>
              ) : null}
              <Link
                href="/profile"
                className="transition-opacity hover:opacity-80"
                style={{
                  color: PURPLE,
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                  fontVariationSettings: '"wght" 400',
                }}
              >
                Edit
              </Link>
            </p>
          </div>
        </div>

        {continueLearningCourses.length > 0 ? (
          <>
            <div
              className="mx-auto mt-[31px] max-w-full"
              style={{
                width: "1339px",
                maxWidth: "100%",
                height: "1px",
                background: "#000",
              }}
              aria-hidden
            />

            <h2
              className="mx-auto mt-[40px] w-full max-w-[1339px] uppercase"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: "48px",
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
                  fontSize: "48px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "120%",
                  fontVariationSettings: '"wght" 700',
                }}
              >
                LEARNING
              </span>
            </h2>

            <div className="mx-auto mt-[40px] flex w-full max-w-[1339px] flex-wrap items-center justify-start gap-y-6">
              <div className="flex flex-wrap gap-[30px]">
                {continueLearningCourses.map((course) => (
                  <CourseStackCard
                    key={course.continueHref}
                    {...course}
                  />
                ))}
              </div>
              <ViewAllCoursesLink />
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
