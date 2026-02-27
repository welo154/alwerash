"use client";

import { useTransition } from "react";

type Props = {
  lessonId: string;
  courseId: string;
  completeLesson: (lessonId: string, courseId: string) => Promise<void>;
};

export function MarkCompleteButton({ lessonId, courseId, completeLesson }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => completeLesson(lessonId, courseId));
      }}
      disabled={isPending}
      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60"
    >
      {isPending ? "Saving…" : "Mark as complete →"}
    </button>
  );
}
