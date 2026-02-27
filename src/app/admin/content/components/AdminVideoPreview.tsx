"use client";

import { useEffect, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";

type Props = {
  lessonId: string;
  lessonTitle: string;
};

export function AdminVideoPreview({ lessonId, lessonTitle }: Props) {
  const [playback, setPlayback] = useState<{ playbackUrl: string; watermarkText?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/video/playback/${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Video not ready" : "Failed to load playback");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data?.playbackUrl) setPlayback({ playbackUrl: data.playbackUrl, watermarkText: data.watermarkText });
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (error) {
    return (
      <p className="mt-2 text-xs text-amber-600" title={error}>
        Preview unavailable ({error})
      </p>
    );
  }
  if (!playback) {
    return <p className="mt-2 text-xs text-slate-500">Loading preview…</p>;
  }

  return (
    <div className="mt-2 max-w-lg">
      <p className="mb-1 text-xs font-medium text-slate-600">Preview: {lessonTitle}</p>
      <HlsPlayer
        src={playback.playbackUrl}
        className="rounded border border-slate-200 bg-black"
        showQualitySelector={false}
      />
    </div>
  );
}
