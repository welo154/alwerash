"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HlsPlayer, type HlsPlayerProps } from "@/components/video/HlsPlayer";

type AuthorizedHlsPlayerProps = Omit<HlsPlayerProps, "src"> & {
  lessonId: string;
};

function messageForStatus(status: number): string {
  if (status === 401) return "Sign in to watch this lesson.";
  if (status === 403) return "A subscription is required to watch this lesson.";
  if (status === 404) return "Video is not available for this lesson yet.";
  if (status === 503) return "Video playback is temporarily unavailable.";
  return "Could not load this video.";
}

/**
 * Fetches a short-lived signed Mux URL for a lesson. Does not accept a raw playback ID.
 * Refetches at most once if Mux rejects an expired token.
 */
export function AuthorizedHlsPlayer({ lessonId, ...playerProps }: AuthorizedHlsPlayerProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  const load = useCallback(async () => {
    setError(null);
    setSrc(null);
    const res = await fetch(`/api/video/playback/${encodeURIComponent(lessonId)}`, {
      credentials: "same-origin",
    });
    if (!res.ok) {
      setError(messageForStatus(res.status));
      return;
    }
    const data = (await res.json()) as { playbackUrl?: string };
    if (!data.playbackUrl) {
      setError("Could not load this video.");
      return;
    }
    setSrc(data.playbackUrl);
  }, [lessonId]);

  useEffect(() => {
    retryCountRef.current = 0;
    void load();
  }, [load]);

  const handleFatalError = useCallback(() => {
    if (retryCountRef.current >= 1) {
      setError("Playback expired. Refresh the page to continue.");
      setSrc(null);
      return;
    }
    retryCountRef.current += 1;
    void load();
  }, [load]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black px-6 text-center">
        <p className="m-0 text-sm text-white/80">{error}</p>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black px-6 text-center">
        <p className="m-0 text-sm text-white/70">Loading video…</p>
      </div>
    );
  }

  return <HlsPlayer {...playerProps} src={src} onError={handleFatalError} />;
}
