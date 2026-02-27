// file: src/app/admin/content/modules/[moduleId]/page.tsx
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateLesson,
  adminGetModule,
  adminUpdateModule,
  adminUpdateLesson,
} from "@/server/content/admin.service";
import { MuxUploadButton } from "@/app/admin/content/components/MuxUploadButton";
import { AdminVideoPreview } from "@/app/admin/content/components/AdminVideoPreview";
import { isMuxApiConfigured } from "@/server/mux/config";

export default async function AdminModuleDetail({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { moduleId } = await params;

  const courseModule = await adminGetModule(moduleId);
  const muxConfigured = isMuxApiConfigured();

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
    revalidatePath(`/admin/content/courses/${courseModule.courseId}`);
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
    revalidatePath(`/learn/${courseModule.courseId}`);
    revalidatePath(`/courses/${courseModule.courseId}`);
  }

  async function updateLesson(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const lessonId = String(formData.get("lessonId") ?? "");
    const courseId = String(formData.get("courseId") ?? "");
    if (!lessonId) return;
    await adminUpdateLesson(lessonId, {
      published: formData.get("published") === "on",
    });
    revalidatePath(`/admin/content/modules/${moduleId}`);
    if (courseId) {
      revalidatePath(`/learn/${courseId}`);
      revalidatePath(`/courses/${courseId}`);
    }
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link
          href={`/admin/content/courses/${courseModule.courseId}`}
          className="rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ← Back to Course
        </Link>
      </nav>

      {/* Mux not configured — show once so admins know how to fix upload */}
      {!muxConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-medium text-amber-900">Video upload not configured</p>
          <p className="mt-1">
            Add <code className="rounded bg-amber-100 px-1">MUX_TOKEN_ID</code> and{" "}
            <code className="rounded bg-amber-100 px-1">MUX_TOKEN_SECRET</code> to your{" "}
            <code className="rounded bg-amber-100 px-1">.env</code> file (see{" "}
            <code className="rounded bg-amber-100 px-1">.env.example</code>). Get values from the Mux dashboard → Settings → Access Tokens. Then restart the dev server.
          </p>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-slate-900">Module: {courseModule.title}</h1>

      {/* Edit module card */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit module</h2>
        <form action={update} className="space-y-4">
          <input type="hidden" name="moduleId" value={moduleId} />
          <div className="flex flex-wrap gap-4">
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Module title</label>
              <input
                name="title"
                defaultValue={courseModule.title}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Order (for sorting)</label>
              <input
                name="order"
                type="number"
                defaultValue={courseModule.order}
                min={0}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Save module
          </button>
        </form>
      </section>

      {/* Lessons */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Lessons</h2>

        {/* Add lesson card */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-slate-700">Add lesson</h3>
          <form action={createLesson} className="space-y-4">
            <input type="hidden" name="moduleId" value={moduleId} />
            <div className="flex flex-wrap gap-4 items-end">
              <div className="min-w-[200px] flex-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Lesson title</label>
                <input
                  name="title"
                  placeholder="e.g. Drawing the lines"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                <select
                  name="type"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="VIDEO">Video</option>
                  <option value="ARTICLE">Article</option>
                  <option value="RESOURCE">Resource</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Order</label>
                <input
                  name="order"
                  type="number"
                  defaultValue={0}
                  min={0}
                  className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  name="published"
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Published (visible to learners)
              </label>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Add lesson
            </button>
          </form>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Only published lessons appear for learners. Use the checkbox below to publish or unpublish each lesson.
        </p>

        <ul className="space-y-4">
          {courseModule.lessons.map((l) => (
            <li
              key={l.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{l.title}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {l.type} · {l.published ? "Published" : "Draft (hidden from learners)"}
                    {l.type === "VIDEO" && l.video?.muxPlaybackId && (
                      <span className="ml-1 text-emerald-600">· Video ready</span>
                    )}
                    {l.type === "VIDEO" && !l.video?.muxPlaybackId && l.videoUploads?.[0] && (
                      <span className="ml-1 text-amber-600">· Upload {l.videoUploads[0].status.toLowerCase()}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <form action={updateLesson} className="flex items-center gap-2">
                    <input type="hidden" name="lessonId" value={l.id} />
                    <input type="hidden" name="courseId" value={courseModule.courseId} />
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={l.published}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Published
                    </label>
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Update
                    </button>
                  </form>
                  {l.type === "VIDEO" && (
                    <MuxUploadButton
                      lessonId={l.id}
                      lessonTitle={l.title}
                      disabled={Boolean(l.video?.muxPlaybackId)}
                    />
                  )}
                </div>
              </div>
              {l.type === "VIDEO" && l.video?.muxPlaybackId && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <AdminVideoPreview lessonId={l.id} lessonTitle={l.title} />
                </div>
              )}
            </li>
          ))}
          {courseModule.lessons.length === 0 && (
            <li className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No lessons yet. Add one above.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
