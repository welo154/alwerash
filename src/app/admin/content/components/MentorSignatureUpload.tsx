"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mentorId: string;
  signatureImage: string | null | undefined;
};

export function MentorSignatureUpload({ mentorId, signatureImage }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy("upload");
    try {
      const formData = new FormData();
      formData.set("signature", file);
      const res = await fetch(`/api/admin/mentors/${mentorId}/signature`, {
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
      setBusy(null);
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    setError(null);
    setBusy("remove");
    try {
      const res = await fetch(`/api/admin/mentors/${mentorId}/signature`, { method: "DELETE" });
      if (!res.ok) throw new Error("Remove failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">Certificate signature</label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-56 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white">
          {signatureImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={signatureImage} alt="Mentor signature" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">No signature</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            {busy === "upload" ? "Uploading…" : "Choose file"}
            <input
              type="file"
              accept="image/png,image/webp,image/jpeg"
              className="sr-only"
              onChange={handleFileChange}
              disabled={busy !== null}
            />
          </label>
          {signatureImage && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy !== null}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {busy === "remove" ? "Removing…" : "Remove signature"}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-slate-500">
        Transparent PNG works best. Max 2MB. Printed above the mentor name on certificates issued from now on.
      </p>
    </div>
  );
}
