"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  courseId: string;
  instructorImage: string | null | undefined;
};

export function InstructorPhotoUpload({ courseId, instructorImage }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("photo", file);
      const res = await fetch(`/api/admin/courses/${courseId}/instructor-photo`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    setError(null);
    setRemoving(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/instructor-photo`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Remove failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setRemoving(false);
    }
  };

  const disabled = uploading || removing;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Instructor photo
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {instructorImage ? (
            <Image
              src={instructorImage}
              alt="Instructor"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-slate-400">
              ?
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50">
            {uploading ? "Uploading…" : "Choose file"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
          {instructorImage && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {removing ? "Removing…" : "Remove photo"}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-xs text-slate-500">
        JPEG, PNG, or WebP. Max 4MB. Upload from your computer.
      </p>
    </div>
  );
}
