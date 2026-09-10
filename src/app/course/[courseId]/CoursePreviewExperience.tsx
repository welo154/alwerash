"use client";

import { useCallback, useMemo, useState } from "react";
import { AuthorizedHlsPlayer } from "@/components/video/AuthorizedHlsPlayer";
import {
  CourseContentAccordion,
  type CourseAccordionModule,
} from "./CourseContentAccordion";
import type { CourseViewerAccess } from "@/lib/course-access";

export type CourseTrialLesson = {
  lessonId: string;
  title: string;
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

function PlayGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 122 122"
      fill="none"
      aria-hidden
      className="h-[63px] w-[63px] lg:h-[120px] lg:w-[120px]"
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
      <div className="max-lg:order-2 max-lg:-ml-[30px] max-lg:flex max-lg:w-[calc(100%+30px)] max-lg:justify-center">
      <div
        className="relative mt-[15px] h-[202px] w-[334px] overflow-hidden rounded-[30px] border-[0.2px] border-[var(--Black,#000)] bg-[var(--Grey,#E9E9E9)] lg:mt-[39px] lg:h-[557px] lg:w-[843px] lg:rounded-[50px] lg:border-2"
        aria-label="Course preview"
      >
        {showingArticle ? (
          <div className="h-full w-full overflow-y-auto bg-white px-10 py-8">
            <h2
              className="m-0 mb-4 text-[28px] font-medium text-black"
              style={{ fontFamily }}
            >
              {activeLesson?.title}
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
                This reading has no content yet.
              </p>
            )}
          </div>
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
                  label={`Play free preview: ${activeLesson?.title ?? "lesson"}`}
                />
              ) : (
                <PlayGlyph />
              )}
            </div>
          </>
        )}
      </div>
      </div>

      <div className="max-lg:order-6">
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
