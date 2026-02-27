"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileSizeLabel, setFileSizeLabel] = useState<string | null>(null);
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
    setFileSizeLabel(formatFileSize(file.size));
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
      setUploadProgress(0);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("Upload failed. Try again."));
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed. Try again.")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")));

        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setStatus("syncing");
      setUploadProgress(100);
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
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFile}
        disabled={disabled || status === "getting-url" || status === "uploading" || status === "syncing"}
      />
      {status === "uploading" && (
        <ProgressBar
          percent={uploadProgress}
          label="Uploading video"
          statusText={fileSizeLabel ? `${uploadProgress}% · ${fileSizeLabel}` : `${uploadProgress}%`}
          aria-label={`Upload progress: ${uploadProgress}%`}
        />
      )}
      {status === "syncing" && (
        <ProgressBar
          percent={100}
          label="Processing"
          statusText={fileSizeLabel ? `Linking video… (${fileSizeLabel})` : "Linking video…"}
          aria-label="Processing upload"
        />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || status === "getting-url" || status === "uploading" || status === "syncing"}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        {status === "getting-url"
          ? `Preparing…${fileSizeLabel ? ` (${fileSizeLabel})` : ""}`
          : status === "uploading"
            ? "Uploading…"
            : status === "syncing"
              ? "Processing…"
              : "Upload video"}
      </button>
      {fileSizeLabel && (status === "getting-url" || status === "uploading" || status === "syncing") && (
        <p className="text-xs text-slate-500">File size: {fileSizeLabel}</p>
      )}
      {errorMessage && (
        <p className="mt-1.5 max-w-sm rounded-lg bg-red-50 px-2.5 py-2 text-xs text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
