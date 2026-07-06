"use client";

import { useState, useCallback } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { ProgressTracker } from "@/components/video/ProgressTracker";
import {
  LearningProgressBars,
  type ProgressSummary,
  type TrackProgressSummary,
} from "@/components/learning/LearningProgressBars";
import { MarkCompleteButton } from "./MarkCompleteButton";
import Link from "next/link";

const LAST_SECONDS_TO_SHOW_BUTTON = 5;

type Props = {
  courseId: string;
  lessonId: string;
  streamUrl: string;
  posterUrl?: string;
  completeLesson: (lessonId: string, courseId: string) => Promise<void>;
  courseProgress: ProgressSummary;
  trackProgress?: TrackProgressSummary | null;
  initialLastPositionSeconds?: number;
  initialWatchSeconds?: number;
};

export function LessonPlayerWithActions({
  courseId,
  lessonId,
  streamUrl,
  posterUrl,
  completeLesson,
  courseProgress,
  trackProgress,
  initialLastPositionSeconds,
  initialWatchSeconds,
}: Props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onProgress = useCallback((t: number, d: number) => {
    setCurrentTime(t);
    setDuration(d);
  }, []);

  const inLastFiveSeconds =
    duration > 0 && currentTime >= Math.max(0, duration - LAST_SECONDS_TO_SHOW_BUTTON);

  return (
    <div className="space-y-4">
      <LearningProgressBars course={courseProgress} track={trackProgress} />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60">
        <ProgressTracker
          lessonId={lessonId}
          initialLastPositionSeconds={initialLastPositionSeconds}
          initialWatchSeconds={initialWatchSeconds}
          onProgress={onProgress}
        >
          <HlsPlayer
            src={streamUrl}
            poster={posterUrl}
            className="rounded-2xl"
            showQualitySelector
          />
        </ProgressTracker>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {inLastFiveSeconds && (
          <MarkCompleteButton
            lessonId={lessonId}
            courseId={courseId}
            completeLesson={completeLesson}
          />
        )}
        <Link
          href={`/learn/${courseId}`}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow"
        >
          ← Back to course
        </Link>
      </div>
    </div>
  );
}
