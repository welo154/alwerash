// file: src/app/admin/content/courses/[courseId]/page.tsx
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { ConfirmDeleteButton } from "@/app/admin/content/components/ConfirmDeleteButton";
import {
  adminCreateModule,
  adminDeleteCourse,
  adminGetCourse,
  adminListTracks,
  adminUpdateCourse,
} from "@/server/content/admin.service";

export default async function AdminCourseDetail({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { courseId } = await params;

  const [course, tracks] = await Promise.all([
    adminGetCourse(courseId),
    adminListTracks(),
  ]);

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("courseId") ?? "");
    if (!id) return;
    await adminUpdateCourse(id, {
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? "").trim() || undefined,
      trackId: String(formData.get("trackId") ?? "").trim(),
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    revalidatePath(`/admin/content/courses/${id}`);
    revalidatePath("/admin/content/courses");
    revalidatePath("/admin/content/tracks");
  }

  async function createModule(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("courseId") ?? "");
    if (!id) return;
    await adminCreateModule({
      courseId: id,
      title: String(formData.get("title") ?? ""),
      order: Number(formData.get("order") ?? 0),
    });
    revalidatePath(`/admin/content/courses/${id}`);
  }

  async function deleteCourse(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("courseId") ?? "");
    if (!id) return;
    await adminDeleteCourse(id);
    redirect("/admin/content/courses");
  }

  return (
    <div className="p-6 space-y-6">
      <Link className="underline text-sm" href="/admin/content/courses">
        ← Back to Courses
      </Link>

      <h1 className="text-2xl font-semibold">Course: {course.title}</h1>

      <form action={update} className="rounded border p-4 space-y-2 max-w-xl">
        <h2 className="font-semibold">Edit Course</h2>
        <input type="hidden" name="courseId" value={courseId} />
        <div>
          <label className="block text-sm mb-1">Track (optional)</label>
          <select
            name="trackId"
            defaultValue={course.trackId ?? ""}
            className="w-full rounded border p-2"
          >
            <option value="">None (no track)</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.school ? `${t.school.title} → ${t.title}` : t.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            name="title"
            defaultValue={course.title}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Summary</label>
          <textarea
            name="summary"
            defaultValue={course.summary ?? ""}
            className="w-full rounded border p-2"
          />
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
            <input
              name="order"
              type="number"
              defaultValue={(course as { order?: number }).order ?? 0}
              className="w-24 rounded border p-2"
              min={0}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="published"
              type="checkbox"
              defaultChecked={course.published}
            />
            Published
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Save Course
          </button>
        </div>
      </form>

      <form action={deleteCourse} className="mt-2">
        <input type="hidden" name="courseId" value={courseId} />
        <ConfirmDeleteButton
          label="Delete course"
          confirmMessage="Delete this course and all its modules and lessons? This cannot be undone."
        />
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Modules</h2>

        <form action={createModule} className="rounded border p-4 space-y-2 max-w-xl">
          <input type="hidden" name="courseId" value={courseId} />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs text-zinc-500 mb-0.5">Module title</label>
              <input
                name="title"
                placeholder="e.g. Course brief, What is geometric ornamentation"
                className="w-full rounded border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-0.5">Order</label>
              <input name="order" type="number" defaultValue={0} min={0} className="w-24 rounded border p-2" />
            </div>
          </div>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Add Module
          </button>
        </form>

        <ul className="space-y-2">
          {course.modules.map((m) => (
            <li
              key={m.id}
              className="rounded border p-3 flex items-center justify-between"
            >
              <div className="font-semibold">{m.title}</div>
              <Link
                className="underline text-sm"
                href={`/admin/content/modules/${m.id}`}
              >
                Manage (lessons)
              </Link>
            </li>
          ))}
          {course.modules.length === 0 && (
            <li className="rounded border p-4 text-sm opacity-60">
              No modules yet. Add one above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
