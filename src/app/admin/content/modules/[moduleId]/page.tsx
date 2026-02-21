// file: src/app/admin/content/modules/[moduleId]/page.tsx
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateLesson,
  adminGetModule,
  adminUpdateModule,
} from "@/server/content/admin.service";

export default async function AdminModuleDetail({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { moduleId } = await params;

  const module = await adminGetModule(moduleId);

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("moduleId") ?? "");
    if (!id) return;
    await adminUpdateModule(id, {
      title: String(formData.get("title") ?? ""),
      order: Number(formData.get("order") ?? 0),
    });
    revalidatePath(`/admin/content/modules/${id}`);
    revalidatePath(`/admin/content/courses/${module.courseId}`);
  }

  async function createLesson(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("moduleId") ?? "");
    if (!id) return;
    await adminCreateLesson({
      moduleId: id,
      title: String(formData.get("title") ?? ""),
      type: (formData.get("type") as "VIDEO" | "ARTICLE" | "RESOURCE") ?? "VIDEO",
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    revalidatePath(`/admin/content/modules/${id}`);
  }

  return (
    <div className="p-6 space-y-6">
      <Link
        className="underline text-sm"
        href={`/admin/content/courses/${module.courseId}`}
      >
        ← Back to Course
      </Link>

      <h1 className="text-2xl font-semibold">Module: {module.title}</h1>

      <form action={update} className="rounded border p-4 space-y-2 max-w-xl">
        <input type="hidden" name="moduleId" value={moduleId} />
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-0.5">Module title</label>
            <input
              name="title"
              defaultValue={module.title}
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
            <input name="order" type="number" defaultValue={module.order} min={0} className="w-24 rounded border p-2" />
          </div>
        </div>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Save Module
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Lessons</h2>

        <form action={createLesson} className="rounded border p-4 space-y-2 max-w-xl">
          <input type="hidden" name="moduleId" value={moduleId} />
          <div className="flex gap-2 flex-wrap items-end">
            <div className="min-w-[200px]">
              <label className="block text-xs text-zinc-500 mb-0.5">Lesson title</label>
              <input name="title" placeholder="e.g. Drawing the lines" className="w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-0.5">Type</label>
              <select name="type" className="rounded border p-2">
                <option value="VIDEO">Video</option>
                <option value="ARTICLE">Article</option>
                <option value="RESOURCE">Resource</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
              <input name="order" type="number" defaultValue={0} min={0} className="w-20 rounded border p-2" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input name="published" type="checkbox" />
              Published
            </label>
          </div>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Add Lesson
          </button>
        </form>

        <ul className="space-y-2">
          {module.lessons.map((l) => (
            <li
              key={l.id}
              className="rounded border p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{l.title}</div>
                <div className="text-sm opacity-70">
                  {l.type} • {l.published ? "published" : "draft"}
                </div>
              </div>
            </li>
          ))}
          {module.lessons.length === 0 && (
            <li className="rounded border p-4 text-sm opacity-60">
              No lessons yet. Add one above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
