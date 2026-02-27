"use client";

/**
 * Reusable loading-style progress bar (same look as course progress bar).
 * Used for course progress and for upload progress in admin.
 */
type Props = {
  percent: number;
  label?: string;
  statusText?: string;
  className?: string;
  "aria-label"?: string;
};

export function ProgressBar({
  percent: rawPercent,
  label,
  statusText,
  className = "",
  "aria-label": ariaLabel,
}: Props) {
  const percent = Math.min(100, Math.max(0, rawPercent));

  return (
    <div className={`w-full ${className}`}>
      {(label != null || statusText != null) && (
        <div className="flex items-center justify-between gap-2 text-sm text-slate-600 mb-1.5">
          {label != null && <span className="font-medium text-slate-700">{label}</span>}
          {statusText != null && <span className="tabular-nums">{statusText}</span>}
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? (label ? `${label}: ${percent}%` : `Progress: ${percent}%`)}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
