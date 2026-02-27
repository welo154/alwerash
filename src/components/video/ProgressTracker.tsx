"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

const DEBOUNCE_MS = 5000;
const PROGRESS_API = "/api/learning/progress/lesson";

type Props = {
  lessonId: string;
  /** Optional: resume position from server. If not provided, fetched on mount. */
  initialLastPositionSeconds?: number;
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
  onProgress: onProgressCallback,
  children,
}: Props) {
  const [fetchedPosition, setFetchedPosition] = useState<number | null>(null);
  const latestRef = useRef<{ position: number; duration: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialTime = getLastPositionSeconds(initialLastPositionSeconds, fetchedPosition);

  useEffect(() => {
    if (typeof initialLastPositionSeconds === "number" && initialLastPositionSeconds > 0) {
      return;
    }
    let cancelled = false;
    fetch(`${PROGRESS_API}/${encodeURIComponent(lessonId)}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { lastPositionSeconds?: number } | null) => {
        if (cancelled || !data) return;
        const sec = data.lastPositionSeconds;
        if (typeof sec === "number" && sec > 0) {
          setFetchedPosition(sec);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lessonId, initialLastPositionSeconds]);

  const sendProgress = useCallback(
    (positionSeconds: number, durationSeconds: number) => {
      fetch(`${PROGRESS_API}/${encodeURIComponent(lessonId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          positionSeconds: Math.round(positionSeconds),
          durationSeconds: Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : undefined,
        }),
      }).catch(() => {});
    },
    [lessonId]
  );

  const debouncedOnProgress = useCallback(
    (currentTime: number, duration: number) => {
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
