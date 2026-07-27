"use client";

import { useCallback, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import {
  CourseContentAccordion,
  type CourseAccordionModule,
} from "./CourseContentAccordion";
import type { CourseViewerAccess } from "@/lib/course-access";

export type CourseTrialLesson = {
  lessonId: string;
  title: string;
  type: string;
  streamUrl: string | null;
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        viewBox="0 0 122 122"
        fill="none"
        aria-hidden
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

function isVideoLesson(lesson: CourseTrialLesson): boolean {
  return lesson.type.toUpperCase() === "VIDEO" && Boolean(lesson.streamUrl);
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
  const firstVideo = trials.find(isVideoLesson) ?? null;
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

  return (
    <>
      <div
        className="relative mt-[39px] overflow-hidden rounded-[50px] border-2 border-black bg-[#E9E9E9]"
        style={{ width: "843px", height: "557px" }}
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
        ) : isPlaying && showingVideo && activeLesson?.streamUrl ? (
          <div className="h-full w-full">
            <HlsPlayer
              key={activeLesson.lessonId}
              src={activeLesson.streamUrl}
              poster={activeLesson.posterUrl ?? undefined}
              autoPlay
              fill
              showQualitySelector
              className="h-full w-full rounded-none bg-black"
            />
          </div>
        ) : activeLesson && activeLesson.type.toUpperCase() === "VIDEO" && !activeLesson.streamUrl ? (
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="120"
                  viewBox="0 0 122 122"
                  fill="none"
                  aria-hidden
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
              )}
            </div>
          </>
        )}
      </div>

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
    </>
  );
}
