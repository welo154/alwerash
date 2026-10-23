"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StoryFields = {
  id: string;
  name: string;
  jobTitle: string;
  quote: string;
  projectImage: string | null;
  sortOrder: number;
  published: boolean;
};

export function StudentStoryForm({
  mode,
  story,
}: {
  mode: "create" | "edit";
  story?: StoryFields;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeProject, setRemoveProject] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = event.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      jobTitle: (form.elements.namedItem("jobTitle") as HTMLInputElement).value,
      quote: (form.elements.namedItem("quote") as HTMLTextAreaElement).value,
      sortOrder: (form.elements.namedItem("sortOrder") as HTMLInputElement).value,
      published: (form.elements.namedItem("published") as HTMLInputElement).checked,
    };

    try {
      const endpoint = mode === "create" ? "/api/admin/student-stories" : `/api/admin/student-stories/${story?.id}`;
      const res = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not save this story");
      const storyId = data.story?.id as string | undefined;
      if (!storyId) throw new Error("Invalid response");

      if (projectFile) {
        const formData = new FormData();
        formData.set("project", projectFile);
        const photoRes = await fetch(`/api/admin/student-stories/${storyId}/project`, {
          method: "POST",
          body: formData,
        });
        if (!photoRes.ok) {
          const photoData = await photoRes.json().catch(() => ({}));
          throw new Error(typeof photoData.error === "string" ? photoData.error : "Story saved, but the project photo failed");
        }
      } else if (mode === "edit" && removeProject && story?.projectImage) {
        const photoRes = await fetch(`/api/admin/student-stories/${storyId}/project`, { method: "DELETE" });
        if (!photoRes.ok) throw new Error("Story saved, but the project photo could not be removed");
      }

      router.push("/admin/content/students?toast=Saved");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const preview = previewUrl ?? (removeProject ? null : story?.projectImage);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Student name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          defaultValue={story?.name ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-slate-700">
          Job title
        </label>
        <input
          id="jobTitle"
          name="jobTitle"
          required
          maxLength={80}
          defaultValue={story?.jobTitle ?? ""}
          placeholder="Graphic designer"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="quote" className="mb-1 block text-sm font-medium text-slate-700">
          Review
        </label>
        <textarea
          id="quote"
          name="quote"
          required
          maxLength={800}
          rows={5}
          defaultValue={story?.quote ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="project" className="mb-1 block text-sm font-medium text-slate-700">
          Submitted project photo
        </label>
        <p className="mb-2 text-xs text-slate-500">JPEG, PNG, or WebP, up to 4MB. On the site, clicking this photo opens it larger.</p>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="mb-2 h-40 w-32 rounded-2xl border border-slate-200 object-cover" />
        ) : (
          <div className="mb-2 flex h-40 w-32 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-xs text-slate-400">
            No photo
          </div>
        )}
        <input
          id="project"
          name="project"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setProjectFile(file);
            setRemoveProject(false);
            setPreviewUrl((current) => {
              if (current) URL.revokeObjectURL(current);
              return file ? URL.createObjectURL(file) : null;
            });
          }}
        />
        {mode === "edit" && story?.projectImage ? (
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={removeProject}
              onChange={(event) => {
                setRemoveProject(event.target.checked);
                if (event.target.checked) {
                  setProjectFile(null);
                  setPreviewUrl((current) => {
                    if (current) URL.revokeObjectURL(current);
                    return null;
                  });
                }
              }}
            />
            Remove the current photo
          </label>
        ) : null}
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium text-slate-700">
            Order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            max={999}
            defaultValue={story?.sortOrder ?? 0}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="published" defaultChecked={story?.published ?? true} />
          Show on the site
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {submitting ? "Saving…" : mode === "create" ? "Add student" : "Save changes"}
      </button>
    </form>
  );
}
