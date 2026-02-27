"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  courseId: string;
  courseTitle: string;
  disabled?: boolean;
  onUploadComplete?: () => void;
};

export function CourseIntroUploadButton({
  courseId,
  courseTitle,
  disabled,
  onUploadComplete,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "getting-url" | "uploading" | "syncing" | "done" | "done-pending" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const SYNC_POLL_INTERVAL_MS = 3000;
  const SYNC_POLL_MAX_ATTEMPTS = 20;

  async function pollSyncUntilLinked() {
    for (let i = 0; i < SYNC_POLL_MAX_ATTEMPTS; i++) {
      const res = await fetch(`/api/admin/courses/${courseId}/intro-video/sync`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (data?.linked) {
        setStatus("done");
        onUploadComplete?.();
        router.refresh();
        return;
      }
      await new Promise((r) => setTimeout(r, SYNC_POLL_INTERVAL_MS));
    }
    setStatus("done-pending");
    router.refresh();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setStatus("getting-url");

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/intro-video/upload`, {
        method: "POST",
      });
      const text = await res.text();
      let data: { url?: string; error?: string; message?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: res.ok ? "Invalid response" : text || `Request failed (${res.status})` };
      }

      if (!res.ok) {
        setErrorMessage(data?.message ?? data?.error ?? "Failed to get upload URL");
        setStatus("error");
        return;
      }

      const url = data?.url;
      if (!url) {
        setErrorMessage("No upload URL returned");
        setStatus("error");
        return;
      }
      setStatus("uploading");

      const putRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!putRes.ok) {
        setErrorMessage("Upload failed. Try again.");
        setStatus("error");
        return;
      }

      setStatus("syncing");
      await pollSyncUntilLinked();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  if (status === "done") {
    return (
      <span className="text-sm text-green-600">Intro video linked. Refresh to see it.</span>
    );
  }
  if (status === "done-pending") {
    return (
      <span className="text-sm text-amber-600">
        Upload complete. Processing can take 1–2 min. Refresh in a moment.
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFile}
        disabled={disabled || status === "getting-url" || status === "uploading" || status === "syncing"}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || status === "getting-url" || status === "uploading" || status === "syncing"}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        {status === "getting-url"
          ? "Preparing…"
          : status === "uploading"
            ? "Uploading…"
            : status === "syncing"
              ? "Processing…"
              : "Upload intro video"}
      </button>
      {errorMessage && (
        <p className="mt-1.5 max-w-sm rounded-lg bg-red-50 px-2.5 py-2 text-xs text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
