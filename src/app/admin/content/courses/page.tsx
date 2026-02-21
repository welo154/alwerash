// file: src/app/admin/content/courses/page.tsx
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateCourse,
  adminListCourses,
  adminListTracks,
} from "@/server/content/admin.service";

export default async function AdminCoursesPage() {
  await requireRole(["ADMIN"]);
  const [courses, tracks] = await Promise.all([
    adminListCourses(),
    adminListTracks(),
  ]);

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
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    revalidatePath("/admin/content/courses");
  }

  return (
    <div className="p-6 space-y-6">
      <Link className="underline text-sm" href="/admin/content">
        ← Back to Content Admin
      </Link>

      <h1 className="text-2xl font-semibold">Courses</h1>

      <form action={create} className="rounded border p-4 space-y-2 max-w-xl">
        <h2 className="font-semibold">Create Course</h2>
        <div>
          <label className="block text-sm mb-1">Track (optional — group under a track)</label>
          <select name="trackId" className="w-full rounded border p-2">
            <option value="">None (no track)</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.school?.title ? `${t.school.title} → ${t.title}` : t.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            name="title"
            placeholder="Course title"
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Summary</label>
          <textarea
            name="summary"
            placeholder="Brief description"
            className="w-full rounded border p-2"
          />
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
            <input name="order" type="number" defaultValue={0} min={0} className="w-24 rounded border p-2" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" />
            Published
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Create Course
          </button>
        </div>
      </form>

      <div>
        <h2 className="font-semibold mb-2">All Courses</h2>
        <ul className="space-y-2">
          {courses.map((c) => (
            <li
              key={c.id}
              className="rounded border p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm opacity-70">
                  Track: {c.track ? `${c.track.title}` : "None"} • {c.published ? "published" : "draft"}
                </div>
              </div>
              <Link
                className="underline"
                href={`/admin/content/courses/${c.id}`}
              >
                Edit
              </Link>
            </li>
          ))}
          {courses.length === 0 && (
            <li className="rounded border p-4 text-sm opacity-60">
              No courses yet. Create one above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
