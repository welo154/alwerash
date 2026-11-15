"use client";
// @refresh reset

import { useCallback, useMemo, useState } from "react";
import { AuthorizedHlsPlayer } from "@/components/video/AuthorizedHlsPlayer";
import { localizedText } from "@/components/i18n/LocalizedText";
import { useT } from "@/components/i18n/Tr";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import {
  CourseContentAccordion,
  type CourseAccordionModule,
} from "./CourseContentAccordion";
import type { CourseViewerAccess } from "@/lib/course-access";

export type CourseTrialLesson = {
  lessonId: string;
  title: string;
  titleAr?: string | null;
  type: string;
  hasVideo: boolean;
  posterUrl: string | null;
  articleBody: string | null;
};

type CoursePreviewExperienceProps = {
  coverImage: string | null;
  trials: CourseTrialLesson[];
  courseId: string;
  fontFamily: string;
  modules: CourseAccordionModule[];
  totalDurationMinutes?: number | null;
  freeLessonIds: string[];
  viewerAccess: CourseViewerAccess;
};

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
      <PlayGlyph />
    </button>
  );
}

/** Phone preview: outlined 81×81 play mark, centered in the grey video frame. */
function MobilePlayGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="81"
      height="81"
      viewBox="0 0 82 82"
      fill="none"
      aria-hidden
      className="h-[81px] w-[81px] shrink-0"
    >
      <path
        d="M81.5 41C81.5 63.3675 63.3675 81.5 41 81.5C18.6325 81.5 0.5 63.3675 0.5 41C0.5 18.6325 18.6325 0.5 41 0.5C63.3675 0.5 81.5 18.6325 81.5 41ZM32.9 24.8L57.2 41L32.9 57.2V24.8Z"
        stroke="var(--Black, #000)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tablet / desktop preview: filled green play control. */
function PlayGlyph() {
  return (
    <>
      <span className="min-[744px]:hidden">
        <MobilePlayGlyph />
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 122 122"
        fill="none"
        aria-hidden
        className="hidden h-[82px] w-[82px] min-[744px]:max-lg:block lg:hidden"
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 122 122"
        fill="none"
        aria-hidden
        className="hidden h-[120px] w-[120px] lg:block"
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
    </>
  );
}

function isVideoLesson(lesson: CourseTrialLesson): boolean {
  return lesson.type.toUpperCase() === "VIDEO" && lesson.hasVideo;
}

function isArticleLesson(lesson: CourseTrialLesson): boolean {
  const type = lesson.type.toUpperCase();
  return type === "ARTICLE" || type === "READING" || type === "RESOURCE";
}

export function CoursePreviewExperience({
  coverImage,
  trials,
  courseId,
  fontFamily,
  modules,
  totalDurationMinutes,
  freeLessonIds,
  viewerAccess,
}: CoursePreviewExperienceProps) {
  const arabic = useArabicLayout();
  const t = useT();
  const videoTrials = useMemo(() => trials.filter(isVideoLesson), [trials]);
  const firstVideo = videoTrials[0] ?? null;
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    firstVideo?.lessonId ?? trials[0]?.lessonId ?? null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const activeLesson =
    trials.find((trial) => trial.lessonId === activeLessonId) ?? firstVideo ?? trials[0] ?? null;

  const posterSrc = activeLesson?.posterUrl || coverImage || null;
  const showingArticle = activeLesson ? isArticleLesson(activeLesson) : false;
  const showingVideo = activeLesson ? isVideoLesson(activeLesson) : false;

  const selectFreeLesson = useCallback(
    (lessonId: string) => {
      const lesson = trials.find((item) => item.lessonId === lessonId);
      if (!lesson) return;
      setActiveLessonId(lessonId);
      // Auto-start when a stream is ready; otherwise show poster / article / empty state.
      setIsPlaying(isVideoLesson(lesson));
    },
    [trials]
  );

  const handlePlayClick = () => {
    if (!activeLesson || !isVideoLesson(activeLesson)) return;
    setIsPlaying(true);
  };

  const handleVideoEnded = useCallback(() => {
    if (!activeLessonId) return;
    const index = videoTrials.findIndex((trial) => trial.lessonId === activeLessonId);
    const next = index >= 0 ? videoTrials[index + 1] : null;
    if (!next) return;
    setActiveLessonId(next.lessonId);
    setIsPlaying(true);
  }, [activeLessonId, videoTrials]);

  return (
    <>
      <div className="max-lg:order-2 max-[743px]:-ml-[30px] max-[743px]:ar:ml-0 max-[743px]:ar:-mr-[30px] max-[743px]:flex max-[743px]:w-[calc(100%+30px)] max-[743px]:justify-center min-[744px]:max-lg:ms-[31px]">
      <div
        className="relative mt-[15px] box-border h-[202px] w-[334px] overflow-hidden rounded-[30px] border-[0.2px] border-solid border-[var(--Black,#000)] bg-[var(--Grey,#E9E9E9)] min-[744px]:max-lg:mt-[41px] min-[744px]:max-lg:h-[420px] min-[744px]:max-lg:w-[622px] min-[744px]:max-lg:rounded-[50px] min-[744px]:max-lg:border-[0.3px] lg:mt-[39px] lg:h-[460px] lg:w-[758px] lg:rounded-[50px] lg:border-[0.3px] lg:border-black/35"
        aria-label="Course preview"
      >
        {showingArticle ? (
          <>
            {/* Phone: keep the grey video frame. Tablet+ can open the reading pane. */}
            <div className="hidden h-full w-full overflow-y-auto bg-white px-10 py-8 min-[744px]:block">
              <h2
                className="m-0 mb-4 text-[28px] font-medium text-black"
                style={{ fontFamily }}
              >
                {activeLesson ? localizedText(arabic, activeLesson.title, activeLesson.titleAr) : null}
              </h2>
              {activeLesson?.articleBody ? (
                <div
                  className="whitespace-pre-wrap text-[18px] leading-relaxed text-black/80"
                  style={{ fontFamily }}
                >
                  {activeLesson.articleBody}
                </div>
              ) : (
                <p className="m-0 text-[18px] text-black/60" style={{ fontFamily }}>
                  {t("This reading has no content yet.")}
                </p>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center min-[744px]:hidden">
              {posterSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={posterSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center 38%" }}
                />
              ) : null}
              <PlayGlyph />
            </div>
          </>
        ) : isPlaying && showingVideo && activeLesson?.hasVideo ? (
          <div className="h-full w-full">
            <AuthorizedHlsPlayer
              key={activeLesson.lessonId}
              lessonId={activeLesson.lessonId}
              poster={activeLesson.posterUrl ?? undefined}
              autoPlay
              fill
              showQualitySelector
              className="h-full w-full rounded-none bg-black"
              onEnded={handleVideoEnded}
            />
          </div>
        ) : activeLesson && activeLesson.type.toUpperCase() === "VIDEO" && !activeLesson.hasVideo ? (
          <div className="flex h-full w-full items-center justify-center bg-[#E9E9E9] px-10 text-center">
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
              {showingVideo ? (
                <PlayOverlayButton
                  onClick={handlePlayClick}
                  label={`${t("Play free preview")}: ${activeLesson ? localizedText(arabic, activeLesson.title, activeLesson.titleAr) : t("lesson")}`}
                />
              ) : (
                <PlayGlyph />
              )}
            </div>
          </>
        )}
      </div>
      </div>

      <div className="max-lg:order-6 min-[744px]:max-lg:ms-[31px]">
      <CourseContentAccordion
        courseId={courseId}
        fontFamily={fontFamily}
        modules={modules}
        totalDurationMinutes={totalDurationMinutes}
        freeLessonIds={freeLessonIds}
        viewerAccess={viewerAccess}
        activeFreeLessonId={activeLessonId}
        onSelectFreeLesson={selectFreeLesson}
      />
      </div>
    </>
  );
}
