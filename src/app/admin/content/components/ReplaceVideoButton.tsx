"use client";

import { useTransition } from "react";

type Props = {
  lessonId: string;
  lessonTitle: string;
  removeLessonVideo: (formData: FormData) => Promise<void>;
};

export function ReplaceVideoButton({
  lessonId,
  lessonTitle,
  removeLessonVideo,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `Remove the current video from "${lessonTitle}"? You can then upload a new video.`
      )
    )
      return;
    const formData = new FormData();
    formData.set("lessonId", lessonId);
    startTransition(() => removeLessonVideo(formData));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50"
    >
      {isPending ? "Removing…" : "Replace video"}
    </button>
  );
}
