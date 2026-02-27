"use client";

import { useEffect, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";

const PUBLIC_HLS_BASE = "https://stream.mux.com";

type Props = {
  lessonId: string;
  lessonTitle: string;
  /** When provided, use public Mux URL directly (no API call). Use this in admin when you already have the playback ID. */
  playbackId?: string | null;
};

export function AdminVideoPreview({ lessonId, lessonTitle, playbackId: playbackIdProp }: Props) {
  const [playback, setPlayback] = useState<{ playbackUrl: string; watermarkText?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playbackIdProp) return; // use public URL, no fetch
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
  }, [lessonId, playbackIdProp]);

  // When we have a playback ID from the server (e.g. admin module page), use public Mux URL so preview works without signed playback keys.
  const playbackUrl = playbackIdProp
    ? `${PUBLIC_HLS_BASE}/${playbackIdProp}.m3u8`
    : playback?.playbackUrl;

  if (error && !playbackIdProp) {
    return (
      <p className="mt-2 text-xs text-amber-600" title={error}>
        Preview unavailable ({error})
      </p>
    );
  }
  if (!playbackUrl) {
    return <p className="mt-2 text-xs text-slate-500">Loading preview…</p>;
  }

  return (
    <div className="mt-2 max-w-lg">
      <p className="mb-1 text-xs font-medium text-slate-600">Preview: {lessonTitle}</p>
      <HlsPlayer
        src={playbackUrl}
        className="rounded border border-slate-200 bg-black"
        showQualitySelector={false}
      />
    </div>
  );
}
