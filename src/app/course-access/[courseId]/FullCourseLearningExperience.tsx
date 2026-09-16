"use client";
// @refresh reset

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AuthorizedHlsPlayer } from "@/components/video/AuthorizedHlsPlayer";
import { ProgressTracker } from "@/components/video/ProgressTracker";
import { CourseBreadcrumb } from "@/app/course/[courseId]/CourseBreadcrumb";
import { ActivityProgressMobileCard } from "@/components/home/ActivityProgressMobileCard";
import { completeLessonAndGetProgress } from "./actions";

export type FullAccessLesson = {
  id: string;
  title: string;
  type: string;
  moduleId: string;
  moduleTitle: string;
  hasVideo: boolean;
  posterUrl: string | null;
  articleBody: string | null;
  description: string | null;
};

export type FullAccessModule = {
  id: string;
  title: string;
  lessons: FullAccessLesson[];
};

type FullCourseLearningExperienceProps = {
  courseId: string;
  courseTitle: string;
  coverImage: string | null;
  modules: FullAccessModule[];
  fontFamily: string;
  progressPercent: number;
  instructorName: string | null;
  instructorProfession: string | null;
  completedLessonIds: string[];
};

const LESSON_ROW_WIDTH = 432;
const VIDEO_WIDTH = 675;
const VIDEO_HEIGHT = 410;
/** Space after any horizontal rule before the next lesson title/content. */
const SPACE_BELOW_HR_PX = 24;
/** Space after lesson content before the next horizontal rule. */
const SPACE_ABOVE_HR_PX = 48;

function PlayOverlayButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center transition-opacity hover:opacity-80"
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 122 122"
        fill="none"
        aria-hidden
        className="h-[63px] w-[63px] min-[744px]:max-lg:h-[82px] min-[744px]:max-lg:w-[82px] lg:h-[120px] lg:w-[120px]"
      >
        <circle
          cx="61"
          cy="61"
          r="60"
          fill="#89F496"
          stroke="var(--Black, #000)"
          strokeWidth="2"
        />
        <path d="M49 37L85 61L49 85V37Z" fill="var(--Black, #000)" />
      </svg>
    </button>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        opacity="0.6"
        d="M9 3.9V9L12.4 10.7M17.5 9C17.5 13.6944 13.6944 17.5 9 17.5C4.30558 17.5 0.5 13.6944 0.5 9C0.5 4.30558 4.30558 0.5 9 0.5C13.6944 0.5 17.5 4.30558 17.5 9Z"
        stroke="var(--Black, #000)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDurationLabel(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  const minLabel = mins === 1 ? "minute" : "minutes";
  const secLabel = secs === 1 ? "second" : "seconds";
  return `${mins} ${minLabel}, ${secs} ${secLabel}`;
}

function isVideoLesson(lesson: FullAccessLesson): boolean {
  return lesson.type.toUpperCase() === "VIDEO";
}

function isIntroLesson(lesson: FullAccessLesson): boolean {
  return lesson.type.toUpperCase() === "INTRO";
}

function isArticleLesson(lesson: FullAccessLesson): boolean {
  const type = lesson.type.toUpperCase();
  return type === "ARTICLE" || type === "READING" || type === "RESOURCE";
}

function isDemoLessonId(lessonId: string): boolean {
  return lessonId.startsWith("demo-");
}

function isPlayableVideo(lesson: FullAccessLesson): boolean {
  return isVideoLesson(lesson) && lesson.hasVideo;
}

function findFirstPlayableVideo(modules: FullAccessModule[]): FullAccessLesson | null {
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (isPlayableVideo(lesson)) return lesson;
    }
  }
  return null;
}

function findNextPlayableVideo(
  orderedLessons: FullAccessLesson[],
  currentLessonId: string
): FullAccessLesson | null {
  const index = orderedLessons.findIndex((lesson) => lesson.id === currentLessonId);
  if (index < 0) return null;
  for (let i = index + 1; i < orderedLessons.length; i += 1) {
    const lesson = orderedLessons[i];
    if (lesson && isPlayableVideo(lesson)) return lesson;
  }
  return null;
}

function LessonCompleteCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
    >
      <circle cx="14" cy="14" r="13.5" stroke="black" />
      <path
        d="M20.9998 9.7998L10.8936 19.5998L6.2998 15.1453"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LessonDivider({ afterVideo }: { afterVideo?: boolean }) {
  return (
    <div
      className={`fcl-lesson-rule flex justify-center max-[743px]:-ml-[30px] max-[743px]:w-[calc(100%+30px)] min-[744px]:max-lg:-ml-[61px] min-[744px]:max-lg:w-[calc(100%+61px)] lg:block lg:justify-start ${
        afterVideo ? "fcl-lesson-rule-after-video" : ""
      }`}
    >
      <hr className="m-0 h-0 w-[359px] border-0 border-t border-black bg-black opacity-60 min-[744px]:max-lg:w-[676px] lg:w-[775px] lg:max-w-full" />
    </div>
  );
}

function UnitCompleteCheckIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 41 41"
      fill="none"
      aria-hidden
      className="fcl-unit-check block shrink-0"
    >
      <circle
        cx="20.5"
        cy="20.5"
        r="19.5"
        fill={filled ? "#FF8CFF" : "none"}
        stroke="#FF8CFF"
        strokeWidth="2"
      />
      <path
        d="M30.7496 14.3496L15.9512 28.6996L9.22461 22.1769"
        stroke={filled ? "#000" : "#FF8CFF"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextUnitArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden
      style={{ width: 22, height: 22, display: "block", flexShrink: 0 }}
    >
      <path
        d="M11.5 22.5C17.5751 22.5 22.5 17.5751 22.5 11.5C22.5 5.42487 17.5751 0.5 11.5 0.5C5.42487 0.5 0.5 5.42487 0.5 11.5C0.5 17.5751 5.42487 22.5 11.5 22.5Z"
        fill="var(--White, #FFF)"
      />
      <path d="M11.5 15.9L15.9 11.5L11.5 7.1" fill="var(--White, #FFF)" />
      <path
        d="M11.5 7.1L15.9 11.5L11.5 15.9M15.9 11.5L7.1 11.5M22.5 11.5C22.5 17.5751 17.5751 22.5 11.5 22.5C5.42487 22.5 0.5 17.5751 0.5 11.5C0.5 5.42487 5.42487 0.5 11.5 0.5C17.5751 0.5 22.5 5.42487 22.5 11.5Z"
        stroke="var(--Purple, #EA83F0)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionHeader({
  courseTitle,
  instructorName,
  instructorProfession,
  fontFamily,
}: {
  courseTitle: string;
  instructorName: string | null;
  instructorProfession: string | null;
  fontFamily: string;
}) {
  const bylineParts = [
    instructorName?.trim() || "Instructor",
    instructorProfession?.trim() || null,
  ].filter(Boolean);

  return (
    <header className="max-[743px]:pl-[30px]">
      <h1
        className="m-0 w-[334px] max-w-full text-[18px] font-medium min-[744px]:max-lg:w-auto min-[744px]:max-lg:text-[24px] lg:w-[755px] lg:text-[32px]"
        style={{
          color: "var(--Black, #000)",
          fontFamily,
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
        }}
      >
        {courseTitle}
      </h1>
      <p
        className="m-0 mt-[3px] text-[14px] leading-[127%] min-[744px]:max-lg:text-[18px] lg:mt-[7px] lg:text-[18px]"
        style={{
          color: "var(--Black, #000)",
          fontFamily,
          fontStyle: "normal",
          fontWeight: 400,
          opacity: 0.6,
        }}
      >
        A course by {bylineParts.join(" , ")}
      </p>
      <div className="fcl-title-rule mt-[28px] flex justify-center max-[743px]:-ml-[30px] max-[743px]:w-[calc(100%+30px)] min-[744px]:max-lg:-ml-[61px] min-[744px]:max-lg:w-[calc(100%+61px)] lg:mt-[22px] lg:block lg:justify-start">
        <hr className="m-0 h-0 w-[359px] border-0 border-t border-black bg-black opacity-60 min-[744px]:max-lg:w-[676px] lg:w-[775px] lg:max-w-full" />
      </div>
    </header>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="24"
      viewBox="0 0 28 26"
      fill="none"
      aria-hidden
    >
      <path
        d="M24.9952 3.12177C24.3599 2.44911 23.6056 1.9155 22.7754 1.55144C21.9451 1.18738 21.0553 1 20.1566 1C19.258 1 18.3681 1.18738 17.5379 1.55144C16.7077 1.9155 15.9534 2.44911 15.3181 3.12177L13.9997 4.51714L12.6812 3.12177C11.398 1.76368 9.65749 1.0007 7.84269 1.0007C6.0279 1.0007 4.28743 1.76368 3.00418 3.12177C1.72092 4.47987 1 6.32185 1 8.24249C1 10.1631 1.72092 12.0051 3.00418 13.3632L13.9997 25L24.9952 13.3632C25.6308 12.6909 26.1349 11.8926 26.4789 11.0139C26.8229 10.1353 27 9.19356 27 8.24249C27 7.29142 26.8229 6.34967 26.4789 5.47104C26.1349 4.59241 25.6308 3.79412 24.9952 3.12177Z"
        fill="#FFF"
        stroke="var(--Black, #000)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 29 29"
      fill="none"
      aria-hidden
      className="course-article-download-icon"
    >
      <path
        d="M28 19V25C28 25.7956 27.6839 26.5587 27.1213 27.1213C26.5587 27.6839 25.7956 28 25 28H4C3.20435 28 2.44129 27.6839 1.87868 27.1213C1.31607 26.5587 1 25.7956 1 25V19M22 11.5L14.5 19L7 11.5M14.5 19V1"
        stroke="var(--Black, #000)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TextContentLessonBlock({
  lesson,
  fontFamily,
  isLast,
  variant,
}: {
  lesson: FullAccessLesson;
  fontFamily: string;
  isLast: boolean;
  variant: "intro" | "article";
}) {
  const [expanded, setExpanded] = useState(false);
  const body =
    lesson.articleBody?.trim() ||
    "Content for this lesson is coming soon.";

  const textStyle: CSSProperties = {
    color: "var(--Black, #000)",
    fontFamily,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    whiteSpace: "pre-wrap",
  };

  return (
    <article id={`lesson-${lesson.id}`}>
      {variant === "article" ? (
        <div className="hidden max-[743px]:block" style={{ height: 35 }} aria-hidden />
      ) : null}
      <h2
        className={`m-0 text-[18px] min-[744px]:max-lg:text-[24px] lg:text-[24px] ${
          variant === "article" ? "fcl-text-title-article" : "fcl-text-title-intro"
        }`}
        style={{
          color: "var(--Black, #000)",
          fontFamily,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {lesson.title}
      </h2>

      <div className="lg:mt-[22px]">
        {variant === "article" && !expanded ? (
          <p className={`m-0 line-clamp-4 w-[334px] max-w-full text-[16px] min-[744px]:max-lg:text-[18px] lg:w-[673px] lg:text-[18px] ${variant === "article" ? "min-[744px]:max-lg:w-[619px]" : "min-[744px]:max-lg:w-[620px]"}`} style={textStyle}>
            {body}
          </p>
        ) : (
          <p className={`m-0 w-[334px] max-w-full text-[16px] min-[744px]:max-lg:text-[18px] lg:w-[673px] lg:text-[18px] ${variant === "article" ? "min-[744px]:max-lg:w-[619px]" : "min-[744px]:max-lg:w-[620px]"}`} style={textStyle}>
            {body}
          </p>
        )}
      </div>

      {variant === "article" ? (
        <>
          <div className="hidden max-[743px]:block" style={{ height: 38 }} aria-hidden />
          <div className="hidden lg:block" style={{ height: 39 }} aria-hidden />
          <div className="flex items-center min-[744px]:max-lg:mt-[42px]">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="box-border inline-flex items-center justify-center"
              style={{
                display: "flex",
                width: "112px",
                height: "42px",
                padding: "0 16px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                border: "1px solid var(--Black, #000)",
                background: "var(--Purple, #FF8CFF)",
              }}
              aria-expanded={expanded}
            >
              <span
                style={{
                  color: "var(--Black, #000)",
                  textAlign: "center",
                  fontFamily,
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "19.6px",
                }}
              >
                {expanded ? "LESS" : "VIEW"}
              </span>
            </button>
            <span className="inline-flex items-center" style={{ marginLeft: 18 }}>
              <HeartIcon />
            </span>
            <span className="inline-flex items-center" style={{ marginLeft: 12 }}>
              <DownloadIcon />
            </span>
          </div>
        </>
      ) : null}

      {!isLast ? (
        <>
          <div className="hidden lg:block" style={{ height: SPACE_ABOVE_HR_PX }} aria-hidden />
          <LessonDivider />
          <div className="hidden lg:block" style={{ height: SPACE_BELOW_HR_PX }} aria-hidden />
        </>
      ) : null}
    </article>
  );
}

function VideoLessonBlock({
  lesson,
  coverImage,
  fontFamily,
  isLast,
  playingLessonId,
  onPlay,
  onVideoProgress,
  onEnded,
  durationSeconds,
  onDuration,
}: {
  lesson: FullAccessLesson;
  coverImage: string | null;
  fontFamily: string;
  isLast: boolean;
  playingLessonId: string | null;
  onPlay: (lessonId: string) => void;
  onVideoProgress: (lessonId: string, currentTime: number, duration: number) => void;
  onEnded: (lessonId: string) => void;
  durationSeconds: number | null;
  onDuration: (lessonId: string, duration: number) => void;
}) {
  const isPlaying = playingLessonId === lesson.id;
  const posterSrc = lesson.posterUrl || coverImage || null;
  const hasStream = lesson.hasVideo;

  return (
    <article id={`lesson-${lesson.id}`} className="fcl-video-block">
      <div className="mb-[18px] flex w-full max-w-full items-center justify-between gap-[16px] max-[743px]:pr-[29px] min-[744px]:max-lg:mb-[28px] min-[744px]:max-lg:pr-[61px] lg:mb-[20px] lg:w-[675px]">
        <h2
          className="m-0 min-w-0 truncate text-[18px] min-[744px]:max-lg:text-[24px] lg:text-[24px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {lesson.title}
        </h2>
        {durationSeconds != null && durationSeconds > 0 ? (
          <div className="inline-flex shrink-0 items-center">
            <ClockIcon />
            <span
              className="ml-[6px] text-[14px] min-[744px]:max-lg:text-[16px] min-[744px]:max-lg:opacity-60 lg:text-[16px] lg:opacity-60"
              style={{
                color: "var(--Black, #000)",
                fontFamily,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {formatDurationLabel(durationSeconds)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="max-[743px]:-ml-[30px] max-[743px]:flex max-[743px]:w-[calc(100%+30px)] max-[743px]:justify-center">
      <div
        className="relative h-[202px] w-[334px] overflow-hidden rounded-[30px] border-[0.2px] border-[var(--Black,#000)] bg-[var(--Grey,#E9E9E9)] min-[744px]:max-lg:h-[420px] min-[744px]:max-lg:w-[622px] min-[744px]:max-lg:rounded-[50px] min-[744px]:max-lg:border-[0.3px] lg:h-[410px] lg:w-[675px] lg:rounded-[50px] lg:border-[0.3px]"
      >
        {isPlaying && hasStream ? (
          <div className="h-full w-full">
            <ProgressTracker
              lessonId={lesson.id}
              onProgress={(currentTime, duration) => {
                if (Number.isFinite(duration) && duration > 0) {
                  onDuration(lesson.id, duration);
                }
                onVideoProgress(lesson.id, currentTime, duration);
              }}
            >
              <AuthorizedHlsPlayer
                key={lesson.id}
                lessonId={lesson.id}
                poster={lesson.posterUrl ?? undefined}
                autoPlay
                fill
                showQualitySelector
                className="h-full w-full rounded-none bg-black"
                onEnded={() => onEnded(lesson.id)}
              />
            </ProgressTracker>
          </div>
        ) : !hasStream ? (
          <div className="flex h-full w-full items-center justify-center px-10 text-center">
            <p className="m-0 text-[20px] text-black/60" style={{ fontFamily }}>
              Video is not available for this lesson yet.
            </p>
          </div>
        ) : (
          <>
            {posterSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterSrc}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 38%" }}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayOverlayButton
                onClick={() => onPlay(lesson.id)}
                label={`Play ${lesson.title}`}
              />
            </div>
          </>
        )}
      </div>
      </div>

      {lesson.description ? (
        <p
          className="m-0 mt-[20px] w-[334px] max-w-full text-[16px] min-[744px]:max-lg:mt-[42px] min-[744px]:max-lg:w-[620px] min-[744px]:max-lg:text-[18px] lg:mt-[46px] lg:w-[673px] lg:text-[18px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {lesson.description}
        </p>
      ) : null}

      {!isLast ? (
        <>
          <div className="hidden lg:block" style={{ height: SPACE_ABOVE_HR_PX }} aria-hidden />
          <LessonDivider afterVideo />
          <div className="hidden lg:block" style={{ height: SPACE_BELOW_HR_PX }} aria-hidden />
        </>
      ) : null}
    </article>
  );
}

export function FullCourseLearningExperience({
  courseId,
  courseTitle,
  coverImage,
  modules,
  fontFamily,
  progressPercent: initialProgressPercent,
  instructorName,
  instructorProfession,
  completedLessonIds: initialCompletedLessonIds,
}: FullCourseLearningExperienceProps) {
  const firstModule = modules[0] ?? null;
  const firstPlayableVideo = useMemo(() => findFirstPlayableVideo(modules), [modules]);
  const orderedLessons = useMemo(
    () => modules.flatMap((module) => module.lessons),
    [modules]
  );

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    firstPlayableVideo?.moduleId ?? firstModule?.id ?? null
  );
  const [playingLessonId, setPlayingLessonId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    firstPlayableVideo?.id ?? firstModule?.lessons[0]?.id ?? null
  );
  const [progressPercent, setProgressPercent] = useState(initialProgressPercent);
  const [completedIds, setCompletedIds] = useState(
    () => new Set(initialCompletedLessonIds)
  );
  const [unitSaving, setUnitSaving] = useState(false);
  const [durationByLessonId, setDurationByLessonId] = useState<Record<string, number>>(
    {}
  );
  const refreshInFlight = useRef(false);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const openModuleId = firstPlayableVideo?.moduleId ?? firstModule?.id ?? null;
    modules.forEach((module) => {
      initial[module.id] = module.id === openModuleId;
    });
    return initial;
  });

  const selectedModule =
    modules.find((module) => module.id === selectedModuleId) ?? firstModule;
  const selectedModuleIndex = selectedModule
    ? modules.findIndex((module) => module.id === selectedModule.id)
    : -1;
  const nextModule =
    selectedModuleIndex >= 0 ? modules[selectedModuleIndex + 1] ?? null : null;
  const currentUnitLessonIds = selectedModule?.lessons.map((lesson) => lesson.id) ?? [];
  const persistableUnitLessonIds = currentUnitLessonIds.filter(
    (id) => !isDemoLessonId(id)
  );
  const isCurrentUnitComplete =
    persistableUnitLessonIds.length > 0 &&
    persistableUnitLessonIds.every((id) => completedIds.has(id));

  const displayPercent = Math.round(Math.min(100, Math.max(0, progressPercent)));
  const encouragement =
    displayPercent >= 100
      ? "Course complete — nice work!"
      : displayPercent >= 70
        ? "Almost there — keep it up!"
        : "Keep going - You're on track!";

  const refreshCourseProgress = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    try {
      const res = await fetch(
        `/api/learning/progress/course/${encodeURIComponent(courseId)}`,
        { credentials: "include" }
      );
      if (!res.ok) return;
      const data = (await res.json()) as { progressPercent?: number };
      if (typeof data.progressPercent === "number") {
        setProgressPercent(data.progressPercent);
      }
    } catch {
      // keep last known value
    } finally {
      refreshInFlight.current = false;
    }
  }, [courseId]);

  const markArticleComplete = useCallback(
    async (lessonId: string) => {
      let skipped = false;
      setCompletedIds((prev) => {
        if (prev.has(lessonId)) {
          skipped = true;
          return prev;
        }
        const next = new Set(prev);
        next.add(lessonId);
        return next;
      });
      if (skipped) return;

      const result = await completeLessonAndGetProgress(lessonId, courseId);
      if (!result) {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(lessonId);
          return next;
        });
        return;
      }
      setProgressPercent(result.progressPercent);
    },
    [courseId]
  );

  useEffect(() => {
    if (!selectedModule) return;
    selectedModule.lessons.forEach((lesson) => {
      if (!isArticleLesson(lesson) && !isIntroLesson(lesson)) return;
      if (lesson.id.startsWith("demo-")) return;
      void markArticleComplete(lesson.id);
    });
  }, [selectedModule, markArticleComplete]);

  const handleDuration = useCallback((lessonId: string, duration: number) => {
    if (!Number.isFinite(duration) || duration <= 0) return;
    setDurationByLessonId((prev) =>
      prev[lessonId] === duration ? prev : { ...prev, [lessonId]: duration }
    );
  }, []);

  // Durations are filled from the player after play starts (signed URLs are not prefetched).

  const handleVideoProgress = useCallback(
    (lessonId: string, currentTime: number, duration: number) => {
      if (!Number.isFinite(duration) || duration <= 0) return;
      handleDuration(lessonId, duration);
      const nearEnd =
        currentTime >= duration * 0.9 || currentTime >= Math.max(0, duration - 30);
      if (!nearEnd) return;

      let skipped = false;
      setCompletedIds((prev) => {
        if (prev.has(lessonId)) {
          skipped = true;
          return prev;
        }
        const next = new Set(prev);
        next.add(lessonId);
        return next;
      });
      if (skipped) return;

      void fetch(`/api/learning/progress/lesson/${encodeURIComponent(lessonId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          positionSeconds: Math.round(currentTime),
          durationSeconds: Math.round(duration),
          watchedSecondsTotal: Math.round(currentTime),
        }),
      }).then((res) => {
        if (res.ok) void refreshCourseProgress();
        else {
          setCompletedIds((prev) => {
            const next = new Set(prev);
            next.delete(lessonId);
            return next;
          });
        }
      });
    },
    [handleDuration, refreshCourseProgress]
  );

  const selectModule = useCallback((moduleId: string) => {
    setSelectedModuleId(moduleId);
    setOpenMap((prev) => ({ ...prev, [moduleId]: true }));
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setOpenMap((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  }, []);

  const selectLesson = useCallback(
    (lesson: FullAccessLesson) => {
      selectModule(lesson.moduleId);
      setActiveLessonId(lesson.id);
      if (isPlayableVideo(lesson)) {
        setPlayingLessonId(lesson.id);
      } else {
        setPlayingLessonId(null);
      }
      requestAnimationFrame(() => {
        document
          .getElementById(`lesson-${lesson.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [selectModule]
  );

  const handleVideoEnded = useCallback(
    (lessonId: string) => {
      const nextVideo = findNextPlayableVideo(orderedLessons, lessonId);
      if (nextVideo) {
        selectLesson(nextVideo);
      }
    },
    [orderedLessons, selectLesson]
  );

  const markCurrentUnitComplete = useCallback(async () => {
    if (!selectedModule || unitSaving || isCurrentUnitComplete) return;
    const previousIds = new Set(completedIds);
    const previousPercent = progressPercent;
    setUnitSaving(true);
    setCompletedIds((prev) => {
      const next = new Set(prev);
      for (const id of currentUnitLessonIds) next.add(id);
      return next;
    });
    try {
      let latestPercent = progressPercent;
      for (const lessonId of persistableUnitLessonIds) {
        const result = await completeLessonAndGetProgress(lessonId, courseId);
        if (result) latestPercent = result.progressPercent;
      }
      setProgressPercent(latestPercent);
      await refreshCourseProgress();
    } catch {
      setCompletedIds(previousIds);
      setProgressPercent(previousPercent);
    } finally {
      setUnitSaving(false);
    }
  }, [
    selectedModule,
    unitSaving,
    isCurrentUnitComplete,
    completedIds,
    currentUnitLessonIds,
    persistableUnitLessonIds,
    progressPercent,
    courseId,
    refreshCourseProgress,
  ]);

  const goToNextUnit = useCallback(() => {
    if (!nextModule) return;
    selectModule(nextModule.id);
    setOpenMap((prev) => ({ ...prev, [nextModule.id]: true }));
    const firstLesson = nextModule.lessons[0];
    if (firstLesson) selectLesson(firstLesson);
  }, [nextModule, selectModule, selectLesson]);

  return (
    <div className="fcl-page mx-auto max-w-[1600px] max-lg:overflow-x-clip max-lg:pt-[12px] lg:pl-[120px] lg:pr-[117px] lg:pt-[28px]">
      <div className="max-[743px]:pl-[30px] min-[744px]:max-lg:pl-[61px]">
        <CourseBreadcrumb courseTitle={courseTitle} fontFamily={fontFamily} />
      </div>

      <hr className="mt-[7px] block h-0 w-[393px] max-w-full border-0 border-t border-black bg-black opacity-30 min-[744px]:max-lg:mt-[13px] min-[744px]:max-lg:w-[1440px] min-[744px]:max-lg:max-w-none min-[744px]:max-lg:opacity-60 lg:mt-[13px] lg:w-full lg:opacity-60" />

      <div className="mt-[27px] flex justify-center min-[744px]:hidden">
        <ActivityProgressMobileCard progressPercent={progressPercent} showTrackTicks />
      </div>

      <div className="mt-[60px] hidden justify-center min-[744px]:flex lg:hidden">
        <ActivityProgressMobileCard
          progressPercent={progressPercent}
          showTrackTicks
          variant="tabletWide"
        />
      </div>

      <section className="mt-[41px] max-lg:hidden" aria-label="Course progress">
        <div
          className="flex items-baseline justify-between gap-[24px]"
          style={{ width: "1201px", maxWidth: "100%" }}
        >
          <p className="m-0 flex items-baseline gap-[8px]">
            <span
              style={{
                color: "var(--Black, #000)",
                fontFamily,
                fontSize: "40px",
                fontStyle: "italic",
                fontWeight: 500,
                lineHeight: "normal",
              }}
            >
              {displayPercent}%
            </span>
            <span
              style={{
                color: "var(--Black, #000)",
                fontFamily,
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              PROGRESS
            </span>
          </p>
          <p
            className="m-0 shrink-0 text-right"
            style={{
              color: "rgba(0,0,0,0.45)",
              fontFamily,
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {encouragement}
          </p>
        </div>

        <div
          className="relative mt-[18px] box-border overflow-hidden"
          style={{
            width: "1201px",
            maxWidth: "100%",
            height: "74px",
            borderRadius: "24px",
            border: "0.3px solid #000",
            background: "#fff",
          }}
        >
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              borderRadius: "24px",
              background:
                "linear-gradient(90deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {Array.from({ length: 9 }, (_, index) => (
              <div
                key={index}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((index + 1) / 10) * 100}%`,
                  width: "0.3px",
                  height: "25px",
                  background: "#000",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mt-[48px] flex flex-col max-[743px]:gap-[66px] min-[744px]:max-lg:mt-[50px] min-[744px]:max-lg:gap-[60px] lg:flex-row lg:items-start lg:gap-[94px]">
        <div className="min-w-0 max-lg:order-2 max-lg:flex-none min-[744px]:max-lg:w-full min-[744px]:max-lg:pl-[61px] lg:order-1 lg:flex-1" aria-label="Section content">
          {selectedModule ? (
            <div className="flex flex-col">
              <SectionHeader
                courseTitle={courseTitle}
                instructorName={instructorName}
                instructorProfession={instructorProfession}
                fontFamily={fontFamily}
              />
              <div className="max-[743px]:pl-[30px] lg:pt-[24px]">
              {selectedModule.lessons.map((lesson, index) => {
                const isLast = index === selectedModule.lessons.length - 1;

                if (isVideoLesson(lesson)) {
                  return (
                    <VideoLessonBlock
                      key={lesson.id}
                      lesson={lesson}
                      coverImage={coverImage}
                      fontFamily={fontFamily}
                      isLast={isLast}
                      playingLessonId={playingLessonId}
                      onPlay={(lessonId) => {
                        setActiveLessonId(lessonId);
                        setPlayingLessonId(lessonId);
                      }}
                      onVideoProgress={handleVideoProgress}
                      onEnded={handleVideoEnded}
                      durationSeconds={durationByLessonId[lesson.id] ?? null}
                      onDuration={handleDuration}
                    />
                  );
                }

                if (isIntroLesson(lesson) || isArticleLesson(lesson)) {
                  return (
                    <TextContentLessonBlock
                      key={lesson.id}
                      lesson={lesson}
                      fontFamily={fontFamily}
                      isLast={isLast}
                      variant={isIntroLesson(lesson) ? "intro" : "article"}
                    />
                  );
                }

                return (
                  <TextContentLessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    fontFamily={fontFamily}
                    isLast={isLast}
                    variant="article"
                  />
                );
              })}
              </div>
            </div>
          ) : (
            <p className="m-0 text-[18px] text-black/60" style={{ fontFamily }}>
              Select a section to view its lessons.
            </p>
          )}
        </div>

        <aside
          className="flex w-full shrink-0 flex-col gap-[16px] max-lg:order-1 max-lg:items-center min-[744px]:max-lg:mx-auto min-[744px]:max-lg:w-[622px] min-[744px]:max-lg:gap-[17px] lg:order-2 lg:sticky lg:top-[28px] lg:w-[432px]"
          aria-label="Course sections"
        >
          {modules.map((module) => {
            const isOpen = !!openMap[module.id];
            const isSelected = selectedModuleId === module.id;
            return (
              <div
                key={module.id}
                className={`w-[315px] overflow-hidden rounded-[30px] border border-black min-[744px]:max-lg:w-[622px] lg:w-[432px] ${
                  isOpen
                    ? "h-auto"
                    : "h-[60px] min-[744px]:max-lg:h-[74px] lg:h-[60px]"
                } ${isOpen || isSelected ? "bg-[#89F496]" : "bg-white"}`}
                style={{
                  transition: "height 320ms ease-in-out, background-color 300ms ease-in-out",
                }}
              >
                <div
                  className={`flex h-[60px] w-full items-center px-[20px] min-[744px]:max-lg:h-[74px] min-[744px]:max-lg:pl-[31px] ${
                    isOpen || isSelected ? "bg-[#89F496]" : "bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleModule(module.id);
                    }}
                    className="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-black/[0.06] active:bg-black/[0.12] min-[744px]:max-lg:h-auto min-[744px]:max-lg:w-auto min-[744px]:max-lg:rounded-none"
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen ? `Collapse ${module.title}` : `Expand ${module.title}`
                    }
                  >
                    <svg
                      className="h-[8px] w-[14px] transition-transform duration-300 ease-in-out min-[744px]:max-lg:h-[9px] min-[744px]:max-lg:w-[19px]"
                      style={{
                        transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="9"
                      viewBox="0 0 21 11"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M20 10L10.5 1L1 10"
                        stroke="var(--Black, #000)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      selectModule(module.id);
                      setOpenMap((prev) => ({ ...prev, [module.id]: true }));
                    }}
                    className="ml-[12px] inline-flex min-w-0 flex-1 items-center bg-transparent p-0 text-left transition-opacity hover:opacity-80 min-[744px]:max-lg:ml-[20px]"
                  >
                    <span
                      className="truncate text-[18px] font-medium min-[744px]:max-lg:text-[24px]"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily,
                        fontWeight: 500,
                      }}
                    >
                      {module.title}
                    </span>
                  </button>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isActive = activeLessonId === lesson.id;
                    const isComplete = completedIds.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => selectLesson(lesson)}
                        className={`flex h-[60px] w-full items-center justify-between border-t border-black pl-[20px] pr-[16px] text-left transition-colors duration-200 min-[744px]:max-lg:h-[74px] min-[744px]:max-lg:pl-[24px] ${
                          isActive
                            ? "bg-[#64E1FF]"
                            : "bg-white hover:bg-[#64E1FF]"
                        } ${lessonIndex === 0 ? "rounded-t-[30px]" : ""}`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <p
                          className="m-0 truncate text-[18px] min-[744px]:max-lg:text-[24px]"
                          style={{
                            color: "var(--Black, #000)",
                            fontFamily,
                            fontWeight: 400,
                          }}
                        >
                          {lessonIndex + 1}. {lesson.title}
                        </p>
                        <span
                          className="inline-flex h-[28px] w-[28px] shrink-0 items-center justify-center"
                          aria-hidden={!isComplete}
                          aria-label={isComplete ? "Completed" : undefined}
                        >
                          {isComplete ? <LessonCompleteCheckIcon /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>
      </div>

      <div className="fcl-unit-complete-wrap">
        <div
          className="mt-[40px] hidden h-0 bg-black opacity-60 lg:block"
          style={{
            width: 1440,
            maxWidth: "none",
            marginLeft: -120,
            borderTop: "1px solid #000",
          }}
          aria-hidden
        />
        <div
          className="flex w-full justify-center max-[743px]:pt-[35px] min-[744px]:max-lg:pt-[73px] lg:hidden"
          aria-hidden
        >
          <hr className="m-0 h-0 w-[359px] border-0 border-t border-black bg-black opacity-60 min-[744px]:max-lg:w-[676px]" />
        </div>
        <div className="fcl-unit-complete-row flex items-center justify-between lg:mt-[45px]">
          <button
            type="button"
            onClick={() => void markCurrentUnitComplete()}
            disabled={unitSaving || isCurrentUnitComplete || persistableUnitLessonIds.length === 0}
            aria-pressed={isCurrentUnitComplete}
            className="inline-flex items-center bg-transparent p-0 text-left disabled:cursor-default"
          >
            <UnitCompleteCheckIcon filled={isCurrentUnitComplete} />
            <span className="fcl-unit-check-gap">
              <span
                className="fcl-unit-label"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily,
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                MARK THIS UNIT AS{" "}
              </span>
              <span
                className="fcl-unit-label"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily,
                  fontStyle: "italic",
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                COMPLETED
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={goToNextUnit}
            disabled={!nextModule}
            className="fcl-next-unit items-center bg-transparent p-0 disabled:opacity-40 lg:inline-flex"
          >
            <span
              style={{
                color: "var(--Purple, #FF8CFF)",
                fontFamily,
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              NEXT UNIT
            </span>
            <span
              className="inline-flex items-center justify-center"
              style={{ marginLeft: 6, width: 22, height: 22 }}
            >
              <NextUnitArrowIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
