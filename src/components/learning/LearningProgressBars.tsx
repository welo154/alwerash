"use client";

import { CourseProgressBar } from "@/components/learning/CourseProgressBar";
import { TrackProgressBar } from "@/components/learning/TrackProgressBar";

export type ProgressSummary = {
  progressPercent: number;
  completedCount: number;
  totalCount: number;
};

export type TrackProgressSummary = ProgressSummary & {
  trackTitle: string;
};

type Props = {
  course: ProgressSummary;
  track?: TrackProgressSummary | null;
  className?: string;
};

export function LearningProgressBars({ course, track, className = "" }: Props) {
  const showCourse = course.totalCount > 0 || course.progressPercent > 0;
  const showTrack = track != null && (track.totalCount > 0 || track.progressPercent > 0);

  if (!showCourse && !showTrack) return null;

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {showCourse ? (
        <CourseProgressBar
          progressPercent={course.progressPercent}
          completedCount={course.completedCount}
          totalCount={course.totalCount}
          label="Course progress"
        />
      ) : null}
      {showTrack ? (
        <TrackProgressBar
          progressPercent={track.progressPercent}
          completedCount={track.completedCount}
          totalCount={track.totalCount}
          trackTitle={track.trackTitle}
        />
      ) : null}
    </div>
  );
}
