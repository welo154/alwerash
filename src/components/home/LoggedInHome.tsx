import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { HomeTrackExplorerSection } from "@/components/home/HomeTrackExplorerSection";
import { LandingCurrentMostsSection } from "@/components/landing";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import type { WeeklyActivitySummary } from "@/server/home/learning-activity.service";
import type { HomeTrackExplorerBundle } from "@/types/home-track-explorer";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { WeeklyActivityBarCard } from "@/components/home/WeeklyActivityBarCard";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const PURPLE = "#FF8CFF";

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
}: CourseStackCardProps) {
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

export type LoggedInHomeProps = {
  userName: string;
  userImage: string | null;
  /** Profession (preferred) or country — shown immediately left of Edit with 11px gap */
  subtitleLeftOfEdit: string | null;
  /** In-progress courses with a next lesson; empty hides the Continue learning block. */
  continueLearningCourses: ContinueLearningCardDto[];
  /** Admin mentors for “THE CURRENT MOSTS” strip (same as guest landing). */
  landingMostsMentors: LandingMostsMentorCardDto[];
  /** Home track explorer (meta filters + track pills + tall cards). */
  trackExplorer: HomeTrackExplorerBundle;
  weeklyActivity: WeeklyActivitySummary;
  /** 0 = Sunday … 6 = Saturday (UTC). */
  activityHighlightDayIndex: number;
};

export function LoggedInHome({
  userName,
  userImage,
  subtitleLeftOfEdit,
  continueLearningCourses,
  landingMostsMentors,
  trackExplorer,
  weeklyActivity,
  activityHighlightDayIndex,
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
        className="bg-white"
        style={{ paddingTop: "58px", fontFamily: pangeaFont }}
      >
        <div className="flex items-center gap-[17px] pl-[71px] pr-6">
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
                className="underline underline-offset-2 transition-opacity hover:opacity-80"
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
              className="relative left-1/2 mt-[31px] h-px w-screen max-w-[100vw] -translate-x-1/2 bg-black"
              aria-hidden
            />

            <div className="pl-[120px] pr-[69px]">
              <h2
                className="mt-[40px] w-full uppercase"
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
                  {continueLearningCourses.map((course) => (
                    <CourseStackCard
                      key={course.continueHref}
                      {...course}
                    />
                  ))}
                </div>
                <ViewAllCoursesLink />
              </div>
            </div>
          </>
        ) : null}

        <section
          className={`w-full pl-[120px] pr-6 ${
            continueLearningCourses.length > 0 ? "mt-[101px]" : "mt-[48px]"
          }`}
          aria-label="Activity tracking"
        >
          <h2
            className="uppercase"
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
            TRACK YOUR ACTIVITY
          </h2>

          <div className="mt-[43px] flex w-full flex-wrap gap-[30px]">
            <WeeklyActivityBarCard
              summary={weeklyActivity}
              highlightDayIndex={activityHighlightDayIndex}
            />
            <div
              className="relative h-[401px] w-[727px] max-w-full shrink-0 overflow-hidden rounded-[50px] border border-[var(--Black,#000)]"
              style={{ background: "var(--White, #FFF)" }}
              aria-label="Activity details card"
            >
              <div className="absolute left-[34px] top-[33px] flex h-[36px] w-[68px] items-center justify-center rounded-[8px] border border-[var(--Black,#000)] bg-white px-[16px]">
                <span
                  style={{
                    color: "#000",
                    fontFamily: pangeaFont,
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "19.6px",
                    fontVariationSettings: '"wght" 400',
                  }}
                >
                  MAY
                </span>
              </div>

              <h3
                className="absolute left-[277px] top-[26px] m-0"
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
                JUNE 2026
              </h3>

              <div className="absolute left-[626px] top-[33px] flex h-[36px] w-[73px] items-center justify-center rounded-[8px] border border-[var(--Black,#000)] bg-white px-[16px]">
                <span
                  style={{
                    color: "#000",
                    fontFamily: pangeaFont,
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "19.6px",
                    fontVariationSettings: '"wght" 400',
                  }}
                >
                  JULY
                </span>
              </div>

              <div className="absolute left-[124px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  SUN
                </p>
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  15
                </p>
              </div>
              <div className="absolute left-[203px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  MON
                </p>
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  16
                </p>
              </div>
              <div className="absolute left-[287px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  TUE
                </p>
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  17
                </p>
              </div>
              <div className="absolute left-[363px] top-[93px] text-center text-[18px] leading-normal text-black">
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  WED
                </p>
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  18
                </p>
              </div>
              <div className="absolute left-[447px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  THU
                </p>
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  19
                </p>
              </div>
              <div className="absolute left-[525px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  FRI
                </p>
                <p className="m-0" style={{ fontFamily: pangeaFont }}>
                  20
                </p>
              </div>

              <p
                className="absolute left-[28px] top-[185px] m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  fontVariationSettings: '"wght" 400',
                }}
              >
                8:00 am
              </p>
              <p
                className="absolute left-[28px] top-[235px] m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  fontVariationSettings: '"wght" 400',
                }}
              >
                9:00 am
              </p>
              <p
                className="absolute left-[29px] top-[285px] m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  fontVariationSettings: '"wght" 400',
                }}
              >
                10:00 am
              </p>
              <p
                className="absolute left-[28px] top-[335px] m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  fontVariationSettings: '"wght" 400',
                }}
              >
                11:00 am
              </p>

              <div
                className="absolute left-[132px] top-[237px] inline-flex h-[74px] w-fit flex-col items-start justify-center rounded-[24px] border border-[var(--Black,#000)] px-[16px]"
                style={{ background: "var(--Purple, #FF8CFF)" }}
              >
                <div className="flex items-center justify-start gap-[8px]">
                  <p
                    className="m-0"
                    style={{
                      color: "#000",
                      fontFamily: pangeaFont,
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "23px",
                      fontVariationSettings: '"wght" 500',
                    }}
                  >
                    {"WHAT'S FIGMA?"}
                  </p>
                  <p
                    className="m-0"
                    style={{
                      color: "#000",
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "23px",
                      opacity: 0.6,
                      fontVariationSettings: '"wght" 400',
                    }}
                  >
                    40mins
                  </p>
                </div>
                <p
                  className="m-0 text-left"
                  style={{
                    color: "#000",
                    fontFamily: pangeaFont,
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "23px",
                    opacity: 0.6,
                    fontVariationSettings: '"wght" 400',
                  }}
                >
                  UI/UX Design Class with Mohamed Tarek Mostafa
                </p>
              </div>
            </div>
          </div>
        </section>

        <h2
          className="mt-[67px] pl-[120px] pr-6 uppercase"
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
          TOPICS RECOMMENDED FOR{" "}
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "120%",
              fontVariationSettings: '"wght" 600',
            }}
          >
            YOU
          </span>
        </h2>

        <HomeTrackExplorerSection
          trackPillRow1={trackExplorer.trackPillRow1}
          trackPillRow2={trackExplorer.trackPillRow2}
          slidesByFilter={trackExplorer.slidesByFilter}
          trackPillSelectsCourses
          courseTilesByTrackSlug={trackExplorer.courseTilesByTrackSlug}
          maxVisibleCourses={3}
          showDiscoverCta={false}
          sectionClassName="mt-[24px]"
          contentLeftPx={120}
          pillGapPx={15}
          maxPills={8}
          showWhatToLearnNextHeading
        />
        {landingMostsMentors.length > 0 ? (
          <div className="pl-[120px] pr-6">
            <LandingCurrentMostsSection
              mentors={landingMostsMentors}
              mentorCardWidthPx={383}
              mentorCardHeightPx={357}
              contained
              alignCardsLeft
              headingSizePx={36}
              cardsTopGapPx={58}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
