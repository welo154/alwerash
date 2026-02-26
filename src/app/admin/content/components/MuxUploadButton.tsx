"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  lessonId: string;
  lessonTitle: string;
  disabled?: boolean;
  onUploadComplete?: () => void;
};

export function MuxUploadButton({
  lessonId,
  lessonTitle,
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
      const res = await fetch(`/api/admin/lessons/${lessonId}/video/sync`);
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
      const res = await fetch(`/api/admin/lessons/${lessonId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: {
          "Content-Type": file.type,
        },
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
      <span className="text-sm text-green-600">Video linked. Refresh the page to see it.</span>
    );
  }
  if (status === "done-pending") {
    return (
      <span className="text-sm text-amber-600">
        Upload complete. Processing can take 1–2 min. Refresh in a moment to link when ready.
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
        className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
      >
        {status === "getting-url"
          ? "Preparing…"
          : status === "uploading"
            ? "Uploading…"
            : status === "syncing"
              ? "Processing…"
              : "Upload video"}
      </button>
      {errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
