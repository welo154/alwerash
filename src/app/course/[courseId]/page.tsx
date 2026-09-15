import localFont from "next/font/local";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CoursePreviewExperience } from "./CoursePreviewExperience";
import { RelatedClassesSection } from "./RelatedClassesSection";
import {
  formatCourseDurationLabel,
  formatCourseRatingLabel,
  formatUpdatedMonthYear,
  initialsFromName,
} from "./course-page-helpers";
import {
  getFreeLessonIds,
  getLockedLessonRedirect,
  privateCoursePath,
  publicCoursePath,
} from "@/lib/course-access";
import {
  publicGetCourseById,
  publicGetFreePreviewVideos,
  publicGetSimilarCourses,
  publicListFeaturedCourses,
} from "@/server/content/public.service";
import { hasActiveSubscription } from "@/server/subscription/access.service";
import { AppError } from "@/server/lib/errors";
import { CourseBreadcrumb } from "./CourseBreadcrumb";
import { LandingEverythingInOneSection } from "@/components/landing/LandingEverythingInOneSection";
import { StudentsRatingWorkSection } from "@/components/students/StudentsRatingWorkSection";

const pangeaVar = localFont({
  src: "../../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

export default async function PublicCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const session = await auth();
  const userId = session?.user?.id;
  const isLoggedIn = Boolean(userId);
  const roles = (session?.user as { roles?: string[] } | undefined)?.roles ?? [];
  const hasSubscription =
    isLoggedIn && (roles.includes("ADMIN") || (await hasActiveSubscription(userId!)));
  const viewerAccess = { isLoggedIn, hasSubscription };

  let course;
  try {
    course = await publicGetCourseById(courseId);
  } catch (error) {
    if (error instanceof AppError && error.code === "NOT_FOUND") notFound();
    throw error;
  }

  const lessonCount = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const instructorName = course.instructorName?.trim() || "Instructor";
  const instructorRole = course.track?.title?.trim() || "Course instructor";
  const instructorInitials = initialsFromName(instructorName);
  const instructorImage = course.instructorImage?.trim() || null;
  const durationLabel = formatCourseDurationLabel(course.totalDurationMinutes, lessonCount);
  const durationMinsLabel = durationLabel.replace(/(\d+)m\b/g, "$1mins");
  const ratingLabel = formatCourseRatingLabel(course.rating);
  const aboutText =
    course.summary?.trim() ||
    `Learn ${course.title} with step-by-step lessons designed to build practical skills from the ground up.`;

  const relatedCourses =
    course.track?.slug != null
      ? await publicGetSimilarCourses(course.id, course.track.slug, 8)
      : (await publicListFeaturedCourses(9)).filter((item) => item.id !== course.id).slice(0, 8);

  const relatedCards = relatedCourses.map((related) => ({
    titleInstructorLine: `${related.title} -\n${related.instructorName?.trim() || "Instructor"}`,
    lectureLine: `LECTURE - ${formatCourseDurationLabel(related.totalDurationMinutes, related.lessonCount)}`,
    topicTitle: (related.track?.title ?? "Course").toUpperCase(),
    continueHref: publicCoursePath(related.id),
  }));

  const freeLessonIds = getFreeLessonIds(course.modules);
  const trialVideos = await publicGetFreePreviewVideos(course.id);
  const subscribeHref = getLockedLessonRedirect(course.id, viewerAccess);
  const fullCourseHref = privateCoursePath(course.id);

  return (
    <main className="mx-auto max-w-[1600px] pb-[80px] max-[743px]:pt-[12px] max-lg:overflow-x-clip max-lg:pb-0 min-[744px]:max-lg:pt-0 lg:pl-[55px] lg:pr-[60px] lg:pt-[28px]">
      <div className="max-[743px]:pl-[30px] min-[744px]:max-lg:pl-[34px] min-[744px]:max-lg:pt-[100px] min-[744px]:max-lg:-mt-[75.6px]">
        <CourseBreadcrumb
          courseTitle={course.title}
          fontFamily={pangeaVar.style.fontFamily}
        />
      </div>

      <hr className="mt-[7px] block h-0 w-[393px] max-w-full border-0 border-t border-black bg-black opacity-30 min-[744px]:max-lg:mt-[13px] min-[744px]:max-lg:w-[1440px] min-[744px]:max-lg:opacity-60 lg:mt-[13px] lg:w-[1440px] lg:opacity-60" />

      <div className="max-lg:flex max-lg:flex-col max-lg:pl-[30px]">
      <div className="mt-[15px] flex items-start gap-[62px] max-lg:contents lg:mt-[20px]">
        <section className="w-[843px] max-w-full shrink-0 max-lg:contents">
          <h1
            className="m-0 w-[334px] max-w-full text-[18px] font-medium max-[743px]:mt-[15px] max-lg:order-1 min-[744px]:max-lg:mt-[41px] min-[744px]:max-lg:ml-[31px] min-[744px]:max-lg:w-auto min-[744px]:max-lg:text-[24px] lg:w-[842px] lg:text-[36px]"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaVar.style.fontFamily,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            {course.title}
          </h1>

          <CoursePreviewExperience
            coverImage={course.coverImage}
            trials={trialVideos}
            courseId={course.id}
            fontFamily={pangeaVar.style.fontFamily}
            modules={course.modules}
            totalDurationMinutes={course.totalDurationMinutes}
            freeLessonIds={freeLessonIds}
            viewerAccess={viewerAccess}
          />

          {hasSubscription ? (
            <div className="mt-[40px] max-lg:order-6">
              <Link
                href={fullCourseHref}
                className="inline-flex h-[56px] items-center justify-center rounded-[8px] border border-black bg-[#004B3C] px-8 text-[24px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ fontFamily: pangeaVar.style.fontFamily }}
              >
                Go to full course
              </Link>
              <div
                className="mt-[35px] flex max-lg:-ml-[30px] max-lg:w-[calc(100%+30px)] max-lg:justify-center lg:hidden"
                aria-hidden
              >
                <div className="h-0 w-[359px] border-0 border-t border-black bg-black opacity-60" />
              </div>
            </div>
          ) : (
            <div className="mt-[40px] max-lg:order-6">
              <Link
                href={subscribeHref}
                className="inline-flex h-[56px] items-center justify-center rounded-[8px] border border-black bg-[#EA83F0] px-8 text-[24px] font-bold text-black transition-opacity hover:opacity-90"
                style={{ fontFamily: pangeaVar.style.fontFamily }}
              >
                Subscribe to unlock all lessons
              </Link>
              <div
                className="mt-[35px] flex max-lg:-ml-[30px] max-lg:w-[calc(100%+30px)] max-lg:justify-center lg:hidden"
                aria-hidden
              >
                <div className="h-0 w-[359px] border-0 border-t border-black bg-black opacity-60" />
              </div>
            </div>
          )}
        </section>

        <div className="w-[413px] shrink-0 max-lg:contents">
          <div className="max-lg:order-3 max-[743px]:mt-[31px] max-[743px]:-ml-[30px] max-[743px]:flex max-[743px]:w-[calc(100%+30px)] max-[743px]:justify-center min-[744px]:max-lg:ml-[31px] min-[744px]:max-lg:mt-[57px]">
          <aside
            className="overflow-hidden rounded-none border bg-transparent max-[743px]:box-border max-[743px]:flex max-[743px]:h-[306px] max-[743px]:w-[334px] max-[743px]:flex-col min-[744px]:max-lg:box-border min-[744px]:max-lg:flex min-[744px]:max-lg:h-[426.892px] min-[744px]:max-lg:w-[621.999px] min-[744px]:max-lg:flex-col"
            style={{ borderColor: "rgba(0, 0, 0, 0.6)" }}
            aria-label="Course details right section"
          >
            <div className="box-border flex h-[66px] items-center border-b border-black/60 pl-[12px] min-[744px]:max-lg:h-[121px] min-[744px]:max-lg:items-start min-[744px]:max-lg:px-[22px] min-[744px]:max-lg:pt-[30px] lg:h-auto lg:px-[30px] lg:pb-[27px] lg:pt-[35px]">
              <div
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-white text-[12px] font-semibold min-[744px]:max-lg:h-[63px] min-[744px]:max-lg:w-[63px] min-[744px]:max-lg:text-[24px] lg:h-[63px] lg:w-[63px] lg:text-[24px]"
                aria-hidden
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaVar.style.fontFamily,
                }}
              >
                {instructorInitials}
              </div>
              <div className="ml-[9px] min-w-0 min-[744px]:max-lg:ml-[16px] lg:ml-[16px]">
                <p
                  className="m-0 text-[18px] font-semibold min-[744px]:max-lg:text-[24px] lg:text-[24px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  {instructorName.toUpperCase()}
                </p>
                <p
                  className="m-0 text-[16px] min-[744px]:max-lg:text-[24px] lg:text-[24px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                    opacity: 0.6,
                  }}
                >
                  {instructorRole}
                </p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 max-lg:divide-x max-lg:divide-black/60 lg:block">
            <div className="border-black/60 max-lg:w-1/2 min-[744px]:max-lg:box-border min-[744px]:max-lg:flex min-[744px]:max-lg:flex-col min-[744px]:max-lg:pl-[24px] min-[744px]:max-lg:pr-[27px] min-[744px]:max-lg:pt-[30px] lg:border-b lg:px-[30px] lg:pb-[30px] lg:pt-[20px]">
              <h4
                className="m-0 ml-[12px] mt-[15px] text-[16px] font-medium min-[744px]:max-lg:ml-0 min-[744px]:max-lg:mt-0 min-[744px]:max-lg:text-[20px] lg:ml-0 lg:mt-0 lg:text-[24px]"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaVar.style.fontFamily,
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                Class details
              </h4>

              <div className="mt-[21px] ml-[12px] mr-[11px] flex flex-col gap-[11px] min-[744px]:max-lg:ml-0 min-[744px]:max-lg:mr-0 min-[744px]:max-lg:mt-[25px] min-[744px]:max-lg:gap-[16px] lg:hidden">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-normal min-[744px]:max-lg:text-[20px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      lineHeight: "normal",
                    }}
                  >
                    Level
                  </span>
                  <span
                    className="text-[16px] font-medium min-[744px]:max-lg:text-[20px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      lineHeight: "normal",
                    }}
                  >
                    Beginner
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-normal min-[744px]:max-lg:text-[20px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      lineHeight: "normal",
                    }}
                  >
                    Rating
                  </span>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 29 26" fill="none" aria-hidden className="h-[14px] w-[16px] min-[744px]:max-lg:h-[17px] min-[744px]:max-lg:w-[19px]">
                      <path
                        d="M8.1048 11.8499L13.3886 1.5C14.4397 1.5 15.4476 1.86348 16.1908 2.51048C16.934 3.15747 17.3515 4.03499 17.3515 4.94998V9.54995H24.8282C25.2111 9.54617 25.5904 9.61493 25.9398 9.75145C26.2893 9.88797 26.6004 10.089 26.8517 10.3406C27.103 10.5922 27.2885 10.8883 27.3952 11.2085C27.502 11.5287 27.5276 11.8653 27.4701 12.1949L25.6472 22.5449C25.5516 23.0933 25.2316 23.5932 24.7461 23.9525C24.2606 24.3117 23.6424 24.5061 23.0052 24.4999H8.1048M8.1048 11.8499V24.4999M8.1048 11.8499H4.14192C3.44124 11.8499 2.76926 12.0923 2.2738 12.5236C1.77834 12.9549 1.5 13.5399 1.5 14.1499V22.1999C1.5 22.8099 1.77834 23.3949 2.2738 23.8262C2.76926 24.2575 3.44124 24.4999 4.14192 24.4999H8.1048"
                        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className="ml-[6px] text-[16px] font-medium min-[744px]:max-lg:text-[20px]"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily: pangeaVar.style.fontFamily,
                        fontStyle: "normal",
                        lineHeight: "normal",
                      }}
                    >
                      {ratingLabel}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-normal min-[744px]:max-lg:text-[20px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      lineHeight: "normal",
                    }}
                  >
                    Duration
                  </span>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 28 28" fill="none" aria-hidden className="h-[16px] w-[16px] min-[744px]:max-lg:h-[20px] min-[744px]:max-lg:w-[20px]">
                      <path
                        d="M14 6.5V14L19 16.5M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z"
                        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className="ml-[6px] text-[16px] font-medium min-[744px]:max-lg:text-[20px]"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily: pangeaVar.style.fontFamily,
                        fontStyle: "normal",
                        lineHeight: "normal",
                      }}
                    >
                      {durationMinsLabel}
                    </span>
                  </span>
                </div>
              </div>

              <div className="ml-[12px] mt-[24px] hidden max-[743px]:block">
                <div className="relative h-[28.732px] w-[45.67px]">
                  {(
                    [
                      { initials: "AM", fill: "#FFFFFF", left: 0 },
                      { initials: "RK", fill: "#89F496", left: 8.47 },
                      { initials: "YT", fill: "#66E0F2", left: 16.94 },
                    ] as const
                  ).map((avatar) => (
                    <svg
                      key={avatar.initials}
                      xmlns="http://www.w3.org/2000/svg"
                      width={28.732}
                      height={28.732}
                      viewBox="0 0 41 41"
                      fill="none"
                      className="absolute top-0"
                      style={{ left: avatar.left }}
                      aria-hidden
                    >
                      <path
                        d="M20.5 40.5C31.5457 40.5 40.5 31.5457 40.5 20.5C40.5 9.4543 31.5457 0.5 20.5 0.5C9.4543 0.5 0.5 9.4543 0.5 20.5C0.5 31.5457 9.4543 40.5 20.5 40.5Z"
                        fill={avatar.fill}
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <text
                        x="20.5"
                        y="21"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#000"
                        style={{
                          fontFamily: pangeaVar.style.fontFamily,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {avatar.initials}
                      </text>
                    </svg>
                  ))}
                </div>
                <p
                  className="mb-0 mt-[6.27px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Join <span style={{ fontStyle: "italic" }}>+24</span> Learners
                </p>
              </div>
              <div className="mt-auto hidden items-center justify-between pb-[20px] min-[744px]:max-lg:flex">
                <div className="relative h-[54.258px] w-[86px] shrink-0">
                  {(
                    [
                      { initials: "AM", fill: "#FFFFFF", left: 0 },
                      { initials: "RK", fill: "#89F496", left: 16 },
                      { initials: "YT", fill: "#66E0F2", left: 32 },
                    ] as const
                  ).map((avatar) => (
                    <svg
                      key={`tablet-${avatar.initials}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={54.258}
                      height={54.258}
                      viewBox="0 0 41 41"
                      fill="none"
                      className="absolute top-0"
                      style={{ left: avatar.left }}
                      aria-hidden
                    >
                      <path
                        d="M20.5 40.5C31.5457 40.5 40.5 31.5457 40.5 20.5C40.5 9.4543 31.5457 0.5 20.5 0.5C9.4543 0.5 0.5 9.4543 0.5 20.5C0.5 31.5457 9.4543 40.5 20.5 40.5Z"
                        fill={avatar.fill}
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <text
                        x="20.5"
                        y="21"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#000"
                        style={{
                          fontFamily: pangeaVar.style.fontFamily,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {avatar.initials}
                      </text>
                    </svg>
                  ))}
                </div>
                <p
                  className="mb-0 mt-0 text-right"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Join{" "}
                  <span style={{ fontStyle: "italic", fontWeight: 400 }}>+24</span>{" "}
                  Learners
                </p>
              </div>
              <div className="hidden lg:block">
              <div className="mt-[20px] flex items-center justify-between">
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px" }}>Level</span>
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>Beginner</span>
              </div>
              <div className="mt-[24px] flex items-center justify-between">
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px" }}>Rating</span>
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 29 26" fill="none" aria-hidden>
                    <path
                      d="M8.1048 11.8499L13.3886 1.5C14.4397 1.5 15.4476 1.86348 16.1908 2.51048C16.934 3.15747 17.3515 4.03499 17.3515 4.94998V9.54995H24.8282C25.2111 9.54617 25.5904 9.61493 25.9398 9.75145C26.2893 9.88797 26.6004 10.089 26.8517 10.3406C27.103 10.5922 27.2885 10.8883 27.3952 11.2085C27.502 11.5287 27.5276 11.8653 27.4701 12.1949L25.6472 22.5449C25.5516 23.0933 25.2316 23.5932 24.7461 23.9525C24.2606 24.3117 23.6424 24.5061 23.0052 24.4999H8.1048M8.1048 11.8499V24.4999M8.1048 11.8499H4.14192C3.44124 11.8499 2.76926 12.0923 2.2738 12.5236C1.77834 12.9549 1.5 13.5399 1.5 14.1499V22.1999C1.5 22.8099 1.77834 23.3949 2.2738 23.8262C2.76926 24.2575 3.44124 24.4999 4.14192 24.4999H8.1048"
                      stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-[6px]" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                    {ratingLabel}
                  </span>
                </span>
              </div>
              <div className="mt-[24px] flex items-center justify-between">
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px" }}>Duration</span>
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28 28" fill="none" aria-hidden>
                    <path
                      d="M14 6.5V14L19 16.5M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z"
                      stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-[6px]" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                    {durationMinsLabel}
                  </span>
                </span>
              </div>

              <div className="mt-[30px] flex items-center">
                <div className="relative h-[54.258px] w-[86px]">
                  {(
                    [
                      { initials: "AM", fill: "#FFFFFF", left: 0 },
                      { initials: "RK", fill: "#89F496", left: 16 },
                      { initials: "YT", fill: "#66E0F2", left: 32 },
                    ] as const
                  ).map((avatar) => (
                    <svg
                      key={avatar.initials}
                      xmlns="http://www.w3.org/2000/svg"
                      width={54.258}
                      height={54.258}
                      viewBox="0 0 41 41"
                      fill="none"
                      className="absolute top-0"
                      style={{ left: avatar.left }}
                      aria-hidden
                    >
                      <path
                        d="M20.5 40.5C31.5457 40.5 40.5 31.5457 40.5 20.5C40.5 9.4543 31.5457 0.5 20.5 0.5C9.4543 0.5 0.5 9.4543 0.5 20.5C0.5 31.5457 9.4543 40.5 20.5 40.5Z"
                        fill={avatar.fill}
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <text
                        x="20.5"
                        y="21"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#000"
                        style={{
                          fontFamily: pangeaVar.style.fontFamily,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {avatar.initials}
                      </text>
                    </svg>
                  ))}
                </div>
                <p className="mb-0 ml-[20px] mt-0" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 400 }}>
                  Join <span style={{ fontStyle: "italic" }}>+24</span> Learners
                </p>
              </div>
              </div>
            </div>

            <div className="max-lg:flex max-lg:w-1/2 max-lg:flex-col lg:px-[30px] lg:pb-[30px] lg:pt-[20px]">
              <div className="flex min-h-0 flex-1 flex-col lg:hidden min-[744px]:max-lg:box-border min-[744px]:max-lg:pl-[20px] min-[744px]:max-lg:pt-[30px]">
                <h4
                  className="m-0 ml-[11px] mt-[15px] text-[16px] font-medium min-[744px]:max-lg:ml-0 min-[744px]:max-lg:mt-0 min-[744px]:max-lg:text-[20px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "normal",
                  }}
                >
                  Skills you’ll learn
                </h4>
                {course.track?.title ? (
                  <div className="ml-[11px] mt-[13px] flex w-fit flex-col gap-[9px] min-[744px]:max-lg:ml-0 min-[744px]:max-lg:mt-[28px] min-[744px]:max-lg:w-full min-[744px]:max-lg:flex-row min-[744px]:max-lg:flex-wrap">
                    <span
                      className="box-border inline-flex h-[29px] w-fit items-center justify-center overflow-hidden rounded-[8px] border-[0.3px] border-[var(--Black,#000)] bg-[var(--White,#FFF)] px-4 text-center text-[12px] font-bold uppercase leading-[19.6px] min-[744px]:max-lg:h-[45px] min-[744px]:max-lg:text-[18px] min-[744px]:max-lg:font-bold"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily: pangeaVar.style.fontFamily,
                        fontWeight: 700,
                        lineHeight: "19.6px",
                      }}
                    >
                      {course.track.title}
                    </span>
                  </div>
                ) : null}
                <p
                  className="mb-[20px] ml-[11px] mt-auto text-[10px] min-[744px]:max-lg:ml-0 min-[744px]:max-lg:text-[14px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                    opacity: 0.6,
                  }}
                >
                  {formatUpdatedMonthYear(course.updatedAt)}
                </p>
              </div>
              <div className="hidden lg:block">
              <h4 className="m-0" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                Skills you’ll learn
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {course.track?.title ? (
                  <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold uppercase">
                    {course.track.title}
                  </span>
                ) : null}
              </div>
              <p
                className="mb-0 mt-[20px]"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaVar.style.fontFamily,
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  opacity: 0.6,
                }}
              >
                {formatUpdatedMonthYear(course.updatedAt)}
              </p>
              </div>
            </div>
            </div>
          </aside>
          </div>

          <section className="mt-[30px] max-lg:order-4 max-lg:mt-[35px]">
            <div className="flex items-center gap-[16px]">
              <h3
                className="m-0 text-[16px] lg:text-[24px]"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaVar.style.fontFamily,
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  opacity: 0.6,
                }}
              >
                About this class
              </h3>
            </div>
            <p
              className="m-0 mt-[15px] w-[334px] max-w-full whitespace-pre-line text-[16px] lg:mt-[19px] lg:text-[24px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {aboutText}
            </p>
          </section>

          <section className="max-lg:order-5 max-lg:mt-[15px]">
            <h3
              className="m-0 mt-[30px] text-[16px] max-lg:mt-0 lg:text-[24px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              Requirements
            </h3>
            <ul
              className="m-0 mt-[13px] list-disc pl-[28px] text-[16px] lg:text-[24px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              <li>Drawing Tablet or iPad</li>
              <li>Digital Painting Software</li>
            </ul>
            <div className="mt-[35px] flex w-[359px] max-lg:-ml-[30px] max-lg:w-[calc(100%+30px)] max-lg:justify-center lg:mt-[57px] lg:block lg:w-[413px]" aria-hidden>
              <div className="h-0 w-[359px] border-0 border-t border-black bg-black opacity-60 lg:h-px lg:w-[413px] lg:max-w-full lg:border-0" />
            </div>
          </section>

          <section className="mt-[30px] max-lg:order-7 max-lg:mt-[35px]">
            <h3
              className="m-0 text-[16px] lg:text-[24px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              About your instructor
            </h3>

            <div className="mt-[23px] flex items-start lg:mt-[43px]">
              <div className="relative h-[135px] w-[135px] shrink-0 overflow-hidden rounded-full border border-black bg-[#E9E9E9] lg:h-[174px] lg:w-[174px]">
                {instructorImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={instructorImage}
                    alt={instructorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="174" height="174" viewBox="0 0 175 175" fill="none" className="h-full w-full" aria-hidden>
                    <path
                      d="M87.5 174.5C135.549 174.5 174.5 135.549 174.5 87.5C174.5 39.4512 135.549 0.5 87.5 0.5C39.4512 0.5 0.5 39.4512 0.5 87.5C0.5 135.549 39.4512 174.5 87.5 174.5Z"
                      fill="#E9E9E9"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <div className="ml-[21px] min-w-0 lg:ml-[30px]">
                <p
                  className="m-0 text-[16px] lg:text-[24px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  {instructorName.toUpperCase()}
                </p>
                <p
                  className="m-0 text-[14px] opacity-60 lg:text-[24px]"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  {instructorRole}
                </p>

                <div className="mt-[20px] flex items-center lg:mt-[16px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 23 22" fill="none" className="h-[18px] w-[19px] shrink-0 lg:h-[20px] lg:w-[21px]" aria-hidden>
                    <path
                      d="M11.5 1L14.7445 7.58254L22 8.64458L16.75 13.7655L17.989 21L11.5 17.5825L5.011 21L6.25 13.7655L1 8.64458L8.2555 7.58254L11.5 1Z"
                      stroke="var(--Black, #000)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[14px] text-[14px] lg:ml-[18px] lg:text-[18px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    4.8 Instructor Rating
                  </span>
                </div>

                <div className="mt-[13px] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 23 20" fill="none" className="h-[18px] w-[19px] shrink-0 lg:h-[18px] lg:w-[21px]" aria-hidden>
                    <path
                      d="M16.2727 19V17C16.2727 15.9391 15.8705 14.9217 15.1544 14.1716C14.4384 13.4214 13.4672 13 12.4545 13H4.81818C3.80554 13 2.83437 13.4214 2.11832 14.1716C1.40227 14.9217 1 15.9391 1 17V19M22 19V17C21.9994 16.1137 21.7178 15.2528 21.1995 14.5523C20.6812 13.8519 19.9555 13.3516 19.1364 13.13M15.3182 1.13C16.1395 1.3503 16.8674 1.8507 17.3873 2.55231C17.9071 3.25392 18.1893 4.11683 18.1893 5.005C18.1893 5.89317 17.9071 6.75608 17.3873 7.45769C16.8674 8.1593 16.1395 8.6597 15.3182 8.88M12.4545 5C12.4545 7.20914 10.7451 9 8.63636 9C6.52764 9 4.81818 7.20914 4.81818 5C4.81818 2.79086 6.52764 1 8.63636 1C10.7451 1 12.4545 2.79086 12.4545 5Z"
                      stroke="var(--Black, #000)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[14px] text-[14px] lg:ml-[18px] lg:text-[18px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    231 Students
                  </span>
                </div>

                <div className="mt-[13px] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 23 22" fill="none" className="h-[18px] w-[19px] shrink-0 lg:h-[20px] lg:w-[21px]" aria-hidden>
                    <path
                      d="M11.5 5.44444C11.5 4.2657 11.0575 3.13524 10.2698 2.30175C9.4822 1.46825 8.41391 1 7.3 1H1V17.6667H8.35C9.18543 17.6667 9.98665 18.0179 10.5774 18.643C11.1681 19.2681 11.5 20.1159 11.5 21M11.5 5.44444V21M11.5 5.44444C11.5 4.2657 11.9425 3.13524 12.7302 2.30175C13.5178 1.46825 14.5861 1 15.7 1H22V17.6667H14.65C13.8146 17.6667 13.0134 18.0179 12.4226 18.643C11.8319 19.2681 11.5 20.1159 11.5 21"
                      stroke="var(--Black, #000)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[14px] text-[14px] lg:ml-[18px] lg:text-[18px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    4 courses
                  </span>
                </div>
              </div>
            </div>

            <p
              className="m-0 mt-[23px] w-[334px] max-w-full text-[16px] lg:mt-[35px] lg:text-[24px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              <span className="lg:hidden">“</span>
              {aboutText}
              <span className="lg:hidden">”</span>
            </p>
            <div className="mt-[35px] flex max-lg:-ml-[30px] max-lg:w-[calc(100%+30px)] max-lg:justify-center lg:hidden" aria-hidden>
              <div className="h-0 w-[359px] border-0 border-t border-black bg-black opacity-60" />
            </div>
          </section>
        </div>
      </div>

      <div className="mt-[35px] max-lg:order-8 max-lg:-ml-[30px] max-lg:w-[calc(100%+30px)] lg:hidden">
        <LandingEverythingInOneSection
          variant="mobile"
          hideChecks
          mobileHeading="What you’ll get"
          mobileRowLayout="course"
        />
      </div>

      <div className="max-lg:order-9 max-lg:-ml-[30px] max-lg:flex max-lg:w-[calc(100%+30px)] max-lg:justify-center lg:hidden">
        <StudentsRatingWorkSection variant="mobile" />
      </div>

      <div className="mt-[66px] w-full max-w-full max-lg:hidden">
        <StudentsRatingWorkSection sectionClassName="py-0" />
      </div>

      <div className="max-lg:order-10 max-lg:-ml-[30px] max-lg:mb-[65px] max-lg:w-[calc(100%+30px)]">
        <RelatedClassesSection fontFamily={pangeaVar.style.fontFamily} cards={relatedCards} />
      </div>
      </div>
    </main>
  );
}
