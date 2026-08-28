"use client";

import { AuthorizedHlsPlayer } from "@/components/video/AuthorizedHlsPlayer";

type Props = {
  lessonId: string;
  lessonTitle: string;
};

export function AdminVideoPreview({ lessonId, lessonTitle }: Props) {
  return (
    <div className="mt-2 max-w-lg">
      <p className="mb-1 text-xs font-medium text-slate-600">Preview: {lessonTitle}</p>
      <AuthorizedHlsPlayer
        lessonId={lessonId}
        className="rounded border border-slate-200 bg-black"
        showQualitySelector={false}
      />
    </div>
  );
}
