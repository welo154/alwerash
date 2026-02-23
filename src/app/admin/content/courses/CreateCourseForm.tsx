import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { adminCreateCourse, adminListTracks } from "@/server/content/admin.service";

type TrackItem = Awaited<ReturnType<typeof adminListTracks>>[number];

export async function CreateCourseForm() {
  await requireRole(["ADMIN"]);
  const tracks = await adminListTracks();

  async function create(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const trackId = String(formData.get("trackId") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;
    await adminCreateCourse({
      trackId: trackId || undefined,
      title,
      summary: String(formData.get("summary") ?? "").trim() || undefined,
      coverImage: String(formData.get("coverImage") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    redirect("/admin/content/courses?toast=Course+added");
  }

  return (
    <form action={create} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Track (optional)</label>
        <select
          name="trackId"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">None (no track)</option>
          {tracks.map((t: TrackItem) => (
            <option key={t.id} value={t.id}>
              {t.school?.title ? `${t.school.title} → ${t.title}` : t.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          name="title"
          placeholder="Course title"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Cover image URL</label>
        <input
          name="coverImage"
          type="url"
          placeholder="https://..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Summary</label>
        <textarea
          name="summary"
          placeholder="Brief description"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Order</label>
          <input
            name="order"
            type="number"
            defaultValue={0}
            min={0}
            className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input name="published" type="checkbox" className="rounded border-slate-300" />
          Published
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Link
          href="/admin/content/courses"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Course
        </button>
      </div>
    </form>
  );
}
