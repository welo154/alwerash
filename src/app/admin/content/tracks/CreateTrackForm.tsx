import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { adminCreateTrack, adminListSchools } from "@/server/content/admin.service";

type SchoolItem = Awaited<ReturnType<typeof adminListSchools>>[number];

export async function CreateTrackForm() {
  await requireRole(["ADMIN"]);
  const schools = await adminListSchools();

  async function create(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const schoolId = String(formData.get("schoolId") ?? "").trim();
    if (!schoolId) return;
    await adminCreateTrack({
      schoolId,
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      coverImage: String(formData.get("coverImage") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    redirect("/admin/content/tracks?toast=Track+added");
  }

  return (
    <form action={create} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">School</label>
        <select
          name="schoolId"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select school…</option>
          {schools.map((s: SchoolItem) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            placeholder="e.g. Ornaments"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
          <input
            name="slug"
            placeholder="e.g. ornaments"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
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
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          placeholder="Optional description"
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
          href="/admin/content/tracks"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={schools.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Create Track
        </button>
      </div>
    </form>
  );
}
