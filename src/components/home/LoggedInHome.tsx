import Image from "next/image";
import Link from "next/link";

import { HomeTrackExplorerSection } from "@/components/home/HomeTrackExplorerSection";
import { ContinueLearningSection } from "@/components/home/ContinueLearningSection";
import { TrackActivitySection } from "@/components/home/TrackActivitySection";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import type { HomeTrackExplorerBundle } from "@/types/home-track-explorer";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const PURPLE = "#FF8CFF";
/** Mobile nav: 37px top padding + 47px bar — user info sits at 100px from page top. */
const MOBILE_HEADER_HEIGHT_PX = 84;
const MOBILE_USER_INFO_TOP_PX = 100;
const MOBILE_USER_INFO_HR_TOP_PX = 167;

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
  /** Aggregate completed-lesson progress across started courses (0–100). */
  learningProgressPercent: number;
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
  learningProgressPercent,
}: LoggedInHomeProps) {
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="relative bg-white lg:pt-[58px]" style={{ fontFamily: pangeaFont }}>
        <div
          className="flex items-center gap-[10px] pl-[30px] lg:hidden"
          style={{ paddingTop: MOBILE_USER_INFO_TOP_PX - MOBILE_HEADER_HEIGHT_PX }}
        >
          <div className="relative h-[45px] w-[45px] shrink-0 overflow-hidden rounded-full border-2 border-black">
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
                className="flex h-full w-full items-center justify-center bg-white text-[16px] font-bold text-black"
                style={{ fontVariationSettings: '"wght" 700' }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="m-0 uppercase">
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                WELCOME BACK,{" "}
              </span>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                }}
              >
                {firstName.toUpperCase()}!
              </span>
            </h1>

            <p className="m-0 flex flex-wrap items-baseline gap-x-[8px]">
              {subtitleLeftOfEdit ? (
                <span
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                    opacity: 0.6,
                  }}
                >
                  {subtitleLeftOfEdit}
                </span>
              ) : null}
              <Link
                href="/profile"
                className="transition-opacity hover:opacity-80"
                style={{
                  color: "var(--Purple, #FF8CFF)",
                  fontFamily: pangeaFont,
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                  textDecorationLine: "underline",
                  textDecorationStyle: "solid",
                  textDecorationSkipInk: "auto",
                }}
              >
                Edit
              </Link>
            </p>
          </div>
        </div>

        <hr
          className="absolute left-1/2 border-0 bg-black lg:hidden"
          style={{
            top: MOBILE_USER_INFO_HR_TOP_PX - MOBILE_HEADER_HEIGHT_PX,
            width: "100vw",
            maxWidth: "100vw",
            height: "0.3px",
            transform: "translateX(-50%)",
          }}
          aria-hidden
        />

        <div className="hidden items-center gap-[17px] pl-[71px] pr-6 lg:flex">
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

        <ContinueLearningSection
          courses={continueLearningCourses}
          className="max-lg:mt-[62px]"
        />

        <TrackActivitySection
          weeklyActivity={weeklyActivity}
          activityHighlightDayIndex={activityHighlightDayIndex}
          learningProgressPercent={learningProgressPercent}
          className={
            continueLearningCourses.length > 0
              ? "max-lg:mt-[60px] lg:mt-[101px]"
              : "mt-[48px]"
          }
        />

        <h2 className="m-0 max-lg:mt-[60px] max-lg:pl-[30px] uppercase lg:hidden">
          <span
            className="block"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            TOPICS RECOMMENDED
          </span>
          <span
            className="block"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
            }}
          >
            FOR YOU
          </span>
        </h2>

        <h2
          className="mt-[67px] hidden pl-[120px] pr-6 uppercase lg:block"
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
          showDiscoverCta={false}
          sectionClassName="max-lg:mt-[18px] lg:mt-[24px]"
          contentLeftPx={120}
          pillGapPx={15}
          maxPills={8}
          showWhatToLearnNextHeading
          landingMostsMentors={landingMostsMentors}
        />
      </section>
    </div>
  );
}
