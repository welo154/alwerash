import Image from "next/image";
import Link from "next/link";

import { HomeTrackExplorerSection } from "@/components/home/HomeTrackExplorerSection";
import { ContinueLearningSection } from "@/components/home/ContinueLearningSection";
import { TrackActivitySection } from "@/components/home/TrackActivitySection";
import { LandingCurrentMostsSection } from "@/components/landing";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import type { HomeTrackExplorerBundle } from "@/types/home-track-explorer";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const PURPLE = "#FF8CFF";

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

        <ContinueLearningSection courses={continueLearningCourses} />

        <TrackActivitySection
          weeklyActivity={weeklyActivity}
          activityHighlightDayIndex={activityHighlightDayIndex}
          className={
            continueLearningCourses.length > 0 ? "mt-[101px]" : "mt-[48px]"
          }
        />

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
