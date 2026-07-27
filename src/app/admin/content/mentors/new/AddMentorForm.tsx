"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AddMentorForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const certificateName =
      (form.elements.namedItem("certificateName") as HTMLInputElement).value.trim() || undefined;
    const aboutMe = (form.elements.namedItem("aboutMe") as HTMLTextAreaElement).value.trim();

    if (!name || !email || !password || !aboutMe) {
      setError("Name, login email, password, and description are required");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, certificateName, aboutMe }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : typeof data.message === "string"
              ? data.message
              : "Failed to create mentor"
        );
      }
      const mentorId = data.mentor?.id;
      if (!mentorId) {
        throw new Error("Invalid response");
      }

      if (photoFile) {
        const formData = new FormData();
        formData.set("photo", photoFile);
        const photoRes = await fetch(`/api/admin/mentors/${mentorId}/photo`, {
          method: "POST",
          body: formData,
        });
        if (!photoRes.ok) {
          const photoData = await photoRes.json().catch(() => ({}));
          throw new Error(photoData.error ?? "Mentor created but photo upload failed");
        }
      }

      router.push("/admin/content/mentors?toast=Mentor+added");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          name="name"
          placeholder="Mentor full name"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Login email <span className="text-red-600">*</span>
        </label>
        <input
          name="email"
          type="email"
          placeholder="mentor@example.com"
          required
          autoComplete="off"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        <p className="mt-1 text-xs text-slate-500">Used to sign in to the mentor portal.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Password <span className="text-red-600">*</span>
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        <p className="mt-1 text-xs text-slate-500">
          At least 10 characters, with uppercase, lowercase, and a number.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Photo</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP. Max 4MB. Optional.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Certificate name</label>
        <input
          name="certificateName"
          placeholder="e.g. Certified Design Mentor"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          name="aboutMe"
          placeholder="Short bio or description"
          rows={4}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Link
          href="/admin/content/mentors"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Add Mentor"}
        </button>
      </div>
    </form>
  );
}
