"use client";

import { useTransition } from "react";

type Props = {
  lessonId: string;
  lessonTitle: string;
  deleteLesson: (formData: FormData) => Promise<void>;
};

export function DeleteLessonButton({
  lessonId,
  lessonTitle,
  deleteLesson,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete lesson "${lessonTitle}"? This cannot be undone.`)) return;
    const formData = new FormData();
    formData.set("lessonId", lessonId);
    startTransition(() => deleteLesson(formData));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete lesson"}
    </button>
  );
}
