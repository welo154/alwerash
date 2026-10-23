import type { SubmissionStatus } from "@prisma/client";

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  NEEDS_CHANGES: "Needs changes",
  REVIEWED: "Reviewed",
};

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-sky-100 text-sky-800",
  NEEDS_CHANGES: "bg-amber-100 text-amber-900",
  REVIEWED: "bg-emerald-100 text-emerald-800",
};

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {SUBMISSION_STATUS_LABELS[status]}
    </span>
  );
}
