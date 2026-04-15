"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

const DEBOUNCE_MS = 5000;
const PROGRESS_API = "/api/learning/progress/lesson";

type Props = {
  lessonId: string;
  /** Optional: resume position from server. If not provided, fetched on mount. */
  initialLastPositionSeconds?: number;
  /** Optional: cumulative watch seconds already stored for this lesson (SSR). */
  initialWatchSeconds?: number;
  /** Optional: called on every progress update (e.g. for UI like "Mark complete" in last 5s). */
  onProgress?: (currentTime: number, duration: number) => void;
  children: ReactNode;
};

function getLastPositionSeconds(
  initialLastPositionSeconds: number | undefined,
  fetched: number | null
): number {
  if (typeof initialLastPositionSeconds === "number" && initialLastPositionSeconds > 0) {
    return initialLastPositionSeconds;
  }
  if (typeof fetched === "number" && fetched > 0) {
    return fetched;
  }
  return 0;
}

export function ProgressTracker({
  lessonId,
  initialLastPositionSeconds,
  initialWatchSeconds,
  onProgress: onProgressCallback,
  children,
}: Props) {
  const [fetchedPosition, setFetchedPosition] = useState<number | null>(null);
  const latestRef = useRef<{ position: number; duration: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serverWatchRef = useRef(Math.max(0, Math.round(initialWatchSeconds ?? 0)));
  const peakPlaybackRef = useRef(
    Math.max(
      0,
      Math.round(initialLastPositionSeconds ?? 0),
      Math.round(initialWatchSeconds ?? 0)
    )
  );

  const initialTime = getLastPositionSeconds(initialLastPositionSeconds, fetchedPosition);

  useEffect(() => {
    serverWatchRef.current = Math.max(0, Math.round(initialWatchSeconds ?? 0));
    peakPlaybackRef.current = Math.max(
      Math.round(initialLastPositionSeconds ?? 0),
      serverWatchRef.current
    );
  }, [lessonId, initialLastPositionSeconds, initialWatchSeconds]);

  useEffect(() => {
    setFetchedPosition(null);
  }, [lessonId]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${PROGRESS_API}/${encodeURIComponent(lessonId)}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (data: { lastPositionSeconds?: number; watchSeconds?: number } | null) => {
          if (cancelled || !data) return;
          const sec = data.lastPositionSeconds;
          if (typeof sec === "number" && sec > 0) {
            setFetchedPosition(sec);
          }
          const w = data.watchSeconds;
          if (typeof w === "number" && w >= 0) {
            serverWatchRef.current = Math.max(serverWatchRef.current, w);
            peakPlaybackRef.current = Math.max(peakPlaybackRef.current, w, sec ?? 0);
          }
        }
      )
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const sendProgress = useCallback(
    (positionSeconds: number, durationSeconds: number) => {
      const dur =
        Number.isFinite(durationSeconds) && durationSeconds > 0
          ? Math.round(durationSeconds)
          : undefined;
      const peakCapped =
        dur !== undefined ? Math.min(peakPlaybackRef.current, dur) : peakPlaybackRef.current;
      const watchedSecondsTotal = Math.max(
        serverWatchRef.current,
        Math.round(peakCapped)
      );

      fetch(`${PROGRESS_API}/${encodeURIComponent(lessonId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          positionSeconds: Math.round(positionSeconds),
          durationSeconds: dur,
          watchedSecondsTotal,
        }),
      })
        .then(async (res) => {
          if (!res.ok) return;
          const body = (await res.json()) as { watchSeconds?: number };
          if (typeof body.watchSeconds === "number" && body.watchSeconds >= 0) {
            serverWatchRef.current = Math.max(serverWatchRef.current, body.watchSeconds);
          }
        })
        .catch(() => {});
    },
    [lessonId]
  );

  const debouncedOnProgress = useCallback(
    (currentTime: number, duration: number) => {
      peakPlaybackRef.current = Math.max(peakPlaybackRef.current, currentTime);
      latestRef.current = { position: currentTime, duration };
      onProgressCallback?.(currentTime, duration);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        const latest = latestRef.current;
        if (latest) sendProgress(latest.position, latest.duration);
      }, DEBOUNCE_MS);
    },
    [sendProgress, onProgressCallback]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!children || !isValidElement(children)) {
    return <>{children}</>;
  }

  const child = children as ReactElement<Record<string, unknown>>;
  return cloneElement(child, {
    initialTime: initialTime > 0 ? initialTime : undefined,
    onProgress: debouncedOnProgress,
  });
}
