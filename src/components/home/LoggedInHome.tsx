"use client";

import Image from "next/image";
import Link from "next/link";
import { useArabicLayout } from "@/components/providers/LocaleProvider";

import { HomeTrackExplorerSection } from "@/components/home/HomeTrackExplorerSection";
import { ContinueLearningSection } from "@/components/home/ContinueLearningSection";
import { TrackActivitySection } from "@/components/home/TrackActivitySection";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import type { HomeTrackExplorerBundle } from "@/types/home-track-explorer";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import type { StudentRatingCard } from "@/components/students/student-rating-types";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import { Tr } from "@/components/i18n/Tr";

const pangeaFont = pangeaFontFamily;

const PURPLE = "#FF8CFF";
/** Mobile nav: 37px top padding + 47px bar — user info sits at 100px from page top. */
const MOBILE_HEADER_HEIGHT_PX = 84;
const MOBILE_USER_INFO_TOP_PX = 100;
const MOBILE_USER_INFO_HR_TOP_PX = 167;
/** iPad header: 7px page padding + 3px logo offset + 65.6px logo. */
const TABLET_HEADER_HEIGHT_PX = 7 + 3 + 41 * 1.6;
const TABLET_USER_INFO_TOP_PX = 117;
const TABLET_USER_INFO_LEFT_PX = 34;
const TABLET_PHOTO = 82;

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
  studentStories?: StudentRatingCard[] | null;
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
  studentStories,
}: LoggedInHomeProps) {
  const arabic = useArabicLayout();
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const firstName = userName.split(" ")[0];
  const arabicFirstName =
    firstName.trim().toLowerCase() === "mazen" ? "مازن" : firstName;
  const arabicProfession =
    subtitleLeftOfEdit?.trim().toLowerCase() === ".net developer"
      ? "مطور دوت نت"
      : subtitleLeftOfEdit;

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="relative bg-white lg:pt-[60px]" style={{ fontFamily: pangeaFont }}>
        <div
          dir={arabic ? "rtl" : "ltr"}
          className={`flex items-center gap-[10px] min-[744px]:hidden ${arabic ? "pr-[30px]" : "pl-[30px]"}`}
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

          <div className={`min-w-0 ${arabic ? "text-right" : ""}`}>
            <h1 className={`m-0 ${arabic ? "" : "uppercase"}`} style={arabic ? { textAlign: "right" } : undefined}>
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
                {arabic ? "مرحبًا بعودتك،" : <Tr>WELCOME BACK,</Tr>}{" "}
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
                {arabic ? arabicFirstName : firstName.toUpperCase()}!
              </span>
            </h1>

            <p className="m-0 flex flex-wrap items-baseline gap-x-[8px]" style={arabic ? { textAlign: "right" } : undefined}>
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
                  {arabic ? arabicProfession : subtitleLeftOfEdit}
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
                <Tr>Edit</Tr>
              </Link>
            </p>
          </div>
        </div>

        <hr
          className="absolute left-1/2 border-0 min-[744px]:hidden"
          style={{
            top: MOBILE_USER_INFO_HR_TOP_PX - MOBILE_HEADER_HEIGHT_PX,
            width: "100vw",
            maxWidth: "100vw",
            height: "0.3px",
            background: "rgba(0, 0, 0, 0.2)",
            transform: "translateX(-50%)",
          }}
          aria-hidden
        />

        <div
          dir={arabic ? "rtl" : "ltr"}
          className="hidden items-center min-[744px]:flex lg:hidden"
          style={{
            paddingTop: TABLET_USER_INFO_TOP_PX - TABLET_HEADER_HEIGHT_PX,
            paddingLeft: arabic ? undefined : TABLET_USER_INFO_LEFT_PX,
            paddingRight: arabic ? TABLET_USER_INFO_LEFT_PX : undefined,
            gap: 16,
          }}
        >
          <div
            className="relative shrink-0 overflow-hidden rounded-full bg-white"
            style={{
              width: TABLET_PHOTO,
              height: TABLET_PHOTO,
              border: "0.3px solid var(--Black, #000)",
              background: "var(--White, #FFF)",
            }}
          >
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

          <div className={`min-w-0 ${arabic ? "text-right" : ""}`}>
            <h1 className={`m-0 ${arabic ? "" : "uppercase"}`} style={arabic ? { textAlign: "right" } : undefined}>
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
                {arabic ? "مرحبًا بعودتك،" : <Tr>WELCOME BACK,</Tr>}{" "}
              </span>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: 32,
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                }}
              >
                {arabic ? arabicFirstName : firstName.toUpperCase()}!
              </span>
            </h1>

            <p
              className="m-0 mt-[3px] flex flex-wrap items-baseline"
              style={{ gap: subtitleLeftOfEdit ? 11 : 0 }}
            >
              {subtitleLeftOfEdit ? (
                <span
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                    opacity: 0.6,
                  }}
                >
                  {arabic ? arabicProfession : subtitleLeftOfEdit}
                </span>
              ) : null}
              <Link
                href="/profile"
                className="transition-opacity hover:opacity-80"
                style={{
                  color: "var(--Purple, #FF8CFF)",
                  fontFamily: pangeaFont,
                  fontSize: 18,
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                <Tr>Edit</Tr>
              </Link>
            </p>
          </div>
        </div>

        <hr
          className="mt-[40px] hidden border-0 min-[744px]:block lg:hidden"
          style={{
            width: "100%",
            height: "0.3px",
            background: "rgba(0, 0, 0, 0.2)",
          }}
          aria-hidden
        />

        <div
          dir={arabic ? "rtl" : "ltr"}
          className={`hidden w-full items-center gap-[17px] lg:flex ${arabic ? "pr-[71px] pl-6" : "pl-[71px] pr-6"}`}
        >
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

          <div className={`flex flex-col ${arabic ? "items-start text-right" : ""}`}>
            <h1 className={arabic ? "m-0" : "uppercase"} style={arabic ? { textAlign: "right" } : undefined}>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                  fontVariationSettings: '"wght" 400',
                  textAlign: arabic ? "right" : undefined,
                }}
              >
                {arabic ? "مرحبًا بعودتك،" : <Tr>WELCOME BACK,</Tr>}{" "}
              </span>
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
                {arabic ? firstName : firstName.toUpperCase()}!
              </span>
            </h1>

            <p
              className="m-0 mt-[3px] flex flex-wrap items-baseline"
              style={{
                gap: subtitleLeftOfEdit ? "11px" : 0,
                textAlign: arabic ? "right" : undefined,
              }}
            >
              {subtitleLeftOfEdit ? (
                <span
                  style={{
                    color: "var(--Black, #000)",
                    textAlign: arabic ? "right" : undefined,
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
                <Tr>Edit</Tr>
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div
            className="relative mt-[31px]"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              height: 0.3,
              background: "#000",
            }}
            aria-hidden
          />
          <h2
            className={`m-0 mt-[40px] uppercase ${arabic ? "text-right" : ""}`}
            style={{
              paddingLeft: arabic ? undefined : 120,
              paddingRight: arabic ? 120 : undefined,
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: arabic ? 40 : undefined,
              fontWeight: arabic ? 400 : undefined,
              fontVariationSettings: arabic ? '"wght" 400' : undefined,
              lineHeight: arabic ? "120%" : undefined,
              textAlign: arabic ? "right" : undefined,
            }}
          >
            {arabic ? (
              "استمر في التعلم"
            ) : (
              <>
                <span
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: "36px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }}
                >
                  <Tr>CONTINUE</Tr>{" "}
                </span>
                <span
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: "36px",
                    fontStyle: "italic",
                    fontWeight: 700,
                    lineHeight: "120%",
                  }}
                >
                  <Tr>LEARNING</Tr>
                </span>
              </>
            )}
          </h2>
        </div>

        <ContinueLearningSection
          courses={continueLearningCourses}
          showDesktopIntro={false}
          className="max-[743px]:mt-[62px] min-[744px]:max-lg:mt-[48px]"
        />

        <TrackActivitySection
          weeklyActivity={weeklyActivity}
          activityHighlightDayIndex={activityHighlightDayIndex}
          learningProgressPercent={learningProgressPercent}
          className={
            continueLearningCourses.length > 0
              ? "max-[743px]:mt-[60px] min-[744px]:max-lg:mt-[73px] lg:mt-[101px]"
              : "mt-[48px]"
          }
        />

        <h2
          className={`m-0 mt-[60px] uppercase max-[743px]:block hidden ${arabic ? "pr-[30px] text-right" : "pl-[30px]"}`}
          style={arabic ? { textAlign: "right" } : undefined}
        >
          {arabic ? (
            <span
              className="block"
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
              الموضوعات الموصى بها لك
            </span>
          ) : (
            <>
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
            </>
          )}
        </h2>

        <h2
          className={`mt-[84px] hidden uppercase min-[744px]:block lg:hidden ${arabic ? "pr-[61px] text-right" : "pl-[61px]"}`}
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 32,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            textAlign: arabic ? "right" : undefined,
            fontVariationSettings: arabic ? '"wght" 400' : undefined,
          }}
        >
          {arabic ? (
            "الموضوعات الموصى بها لك"
          ) : (
            <>
              TOPICS RECOMMENDED FOR{" "}
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: 32,
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                }}
              >
                YOU
              </span>
            </>
          )}
        </h2>

        <h2
          className={`mt-[67px] hidden uppercase lg:block ${arabic ? "pr-[120px] pl-6 text-right" : "pl-[120px] pr-6"}`}
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
          {arabic ? (
            "الموضوعات الموصى بها لك"
          ) : (
            <>
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
            </>
          )}
        </h2>

        <HomeTrackExplorerSection
          trackPillRow1={trackExplorer.trackPillRow1}
          trackPillRow2={trackExplorer.trackPillRow2}
          slidesByFilter={trackExplorer.slidesByFilter}
          trackPillSelectsCourses
          courseTilesByTrackSlug={trackExplorer.courseTilesByTrackSlug}
          showDiscoverCta={false}
          sectionClassName="max-[743px]:mt-[18px] min-[744px]:max-lg:mt-[30px] lg:mt-[24px]"
          contentLeftPx={120}
          pillGapPx={15}
          maxPills={8}
          showWhatToLearnNextHeading
          landingMostsMentors={landingMostsMentors}
          studentStories={studentStories}
        />
      </section>
    </div>
  );
}
