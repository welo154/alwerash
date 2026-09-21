"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HlsPlayer, type HlsPlayerProps } from "@/components/video/HlsPlayer";

type AuthorizedHlsPlayerProps = Omit<HlsPlayerProps, "src" | "resolveUrl"> & {
  lessonId: string;
};

type PlaybackResponse = {
  playbackUrl?: string;
  token?: string;
  expiresAt?: number;
  watermarkText?: string | null;
};

/** Reload attempts allowed when the browser gives us no request hook. */
const MAX_RELOADS = 5;
const MIN_RELOAD_INTERVAL_MS = 3_000;
/** Refresh once this share of the token lifetime has elapsed. */
const REFRESH_AT_FRACTION = 0.6;
const MIN_REFRESH_DELAY_MS = 10_000;

function messageForStatus(status: number): string {
  if (status === 401) return "Sign in to watch this lesson.";
  if (status === 403) return "A subscription is required to watch this lesson.";
  if (status === 404) return "Video is not available for this lesson yet.";
  if (status === 503) return "Video playback is temporarily unavailable.";
  return "Could not load this video.";
}

/**
 * Fetches a short-lived signed Mux URL for a lesson. Never accepts a raw playback ID.
 *
 * Mux validates only the token's signature, expiry, and playback id — it cannot tell
 * who is asking. Short token lifetimes are therefore the control that limits how long
 * a copied URL keeps working, and this component rolls the token during playback so a
 * short lifetime does not interrupt the lesson. Every roll re-runs server-side
 * authorization, so revoked access stops playback at the next refresh.
 */
export function AuthorizedHlsPlayer({ lessonId, ...playerProps }: AuthorizedHlsPlayerProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tokenRef = useRef<string | null>(null);
  const reloadCountRef = useRef(0);
  const lastReloadAtRef = useRef(0);
  const positionRef = useRef(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const fetchPlayback = useCallback(async (): Promise<PlaybackResponse | number> => {
    const res = await fetch(`/api/video/playback/${encodeURIComponent(lessonId)}`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!res.ok) return res.status;
    return (await res.json()) as PlaybackResponse;
  }, [lessonId]);

  /**
   * Mint a fresh token without touching `src`, so hls.js keeps its buffer and the
   * learner sees no interruption.
   */
  const scheduleRefresh = useCallback(
    (expiresAt: number | undefined) => {
      clearRefreshTimer();
      if (!expiresAt) return;

      const lifetime = expiresAt - Date.now();
      if (lifetime <= 0) return;
      const delay = Math.max(lifetime * REFRESH_AT_FRACTION, MIN_REFRESH_DELAY_MS);

      refreshTimerRef.current = setTimeout(async () => {
        if (cancelledRef.current) return;
        const result = await fetchPlayback();
        if (cancelledRef.current) return;

        if (typeof result === "number") {
          // Access was revoked mid-playback, or the network failed. Retry once
          // near expiry rather than tearing down a working stream immediately.
          if (result === 401 || result === 403) {
            setError(messageForStatus(result));
            setSrc(null);
            return;
          }
          scheduleRefresh(Date.now() + MIN_REFRESH_DELAY_MS * 2);
          return;
        }

        if (result.token) tokenRef.current = result.token;
        scheduleRefresh(result.expiresAt);
      }, delay);
    },
    [clearRefreshTimer, fetchPlayback]
  );

  const load = useCallback(async () => {
    clearRefreshTimer();
    setError(null);
    setSrc(null);

    const result = await fetchPlayback();
    if (cancelledRef.current) return;

    if (typeof result === "number") {
      setError(messageForStatus(result));
      return;
    }
    if (!result.playbackUrl) {
      setError("Could not load this video.");
      return;
    }

    tokenRef.current = result.token ?? null;
    setSrc(result.playbackUrl);
    scheduleRefresh(result.expiresAt);
  }, [clearRefreshTimer, fetchPlayback, scheduleRefresh]);

  useEffect(() => {
    cancelledRef.current = false;
    reloadCountRef.current = 0;
    positionRef.current = 0;
    void load();

    return () => {
      cancelledRef.current = true;
      clearRefreshTimer();
    };
  }, [load, clearRefreshTimer]);

  /** Swap the stale token for the current one on every Mux request. */
  const resolveUrl = useCallback((url: string) => {
    const token = tokenRef.current;
    if (!token) return url;
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.endsWith("mux.com")) return url;
      if (!parsed.searchParams.has("token")) return url;
      parsed.searchParams.set("token", token);
      return parsed.toString();
    } catch {
      return url;
    }
  }, []);

  // Kept in a ref so the handler identity is stable: HlsPlayer rebinds its media
  // listeners whenever onProgress changes, and this fires on every timeupdate.
  const onProgressRef = useRef(playerProps.onProgress);
  onProgressRef.current = playerProps.onProgress;

  const handleProgress = useCallback((currentTime: number, duration: number) => {
    positionRef.current = currentTime;
    onProgressRef.current?.(currentTime, duration);
  }, []);

  /**
   * Native HLS (Safari, iOS) exposes no request hook, so an expired token surfaces
   * as a fatal error. Reload with a fresh token and resume where the learner was.
   */
  const handleFatalError = useCallback(() => {
    const now = Date.now();
    if (
      reloadCountRef.current >= MAX_RELOADS ||
      now - lastReloadAtRef.current < MIN_RELOAD_INTERVAL_MS
    ) {
      setError("Playback stopped. Refresh the page to continue.");
      setSrc(null);
      clearRefreshTimer();
      return;
    }
    reloadCountRef.current += 1;
    lastReloadAtRef.current = now;
    void load();
  }, [load, clearRefreshTimer]);

  const initialTime = useMemo(() => {
    // After a token-expiry reload, resume from the observed position rather than
    // the caller's saved progress, which may be well behind.
    if (positionRef.current > 0) return positionRef.current;
    return playerProps.initialTime;
  }, [playerProps.initialTime, src]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <HlsPlayer
      {...playerProps}
      src={src}
      initialTime={initialTime}
      onProgress={handleProgress}
      onError={handleFatalError}
      resolveUrl={resolveUrl}
    />
  );
}
