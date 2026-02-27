"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";

type Props = {
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  label?: string;
  className?: string;
};

export function CourseProgressBar({
  progressPercent,
  completedCount,
  totalCount,
  label,
  className = "",
}: Props) {
  const percent = Math.min(100, Math.max(0, progressPercent));

  return (
    <ProgressBar
      className={className}
      percent={percent}
      label={label ?? "Course progress"}
      statusText={
        totalCount > 0
          ? `${completedCount} / ${totalCount} lessons · ${percent.toFixed(0)}%`
          : `${percent.toFixed(0)}%`
      }
      aria-label={`Course progress: ${percent}%`}
    />
  );
}
