"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";

type Props = {
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  trackTitle: string;
  className?: string;
};

export function TrackProgressBar({
  progressPercent,
  completedCount,
  totalCount,
  trackTitle,
  className = "",
}: Props) {
  const percent = Math.min(100, Math.max(0, progressPercent));
  const label = `${trackTitle} track · ${percent.toFixed(0)}%`;

  return (
    <ProgressBar
      className={className}
      percent={percent}
      label={label}
      barClassName="bg-emerald-600"
      statusText={
        totalCount > 0
          ? `${completedCount} / ${totalCount} lessons`
          : undefined
      }
      aria-label={`Track progress: ${percent}%`}
    />
  );
}
