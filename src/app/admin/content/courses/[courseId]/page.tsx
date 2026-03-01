// file: src/app/admin/content/courses/[courseId]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { ConfirmDeleteButton } from "@/app/admin/content/components/ConfirmDeleteButton";
import { CourseIntroUploadButton } from "@/app/admin/content/components/CourseIntroUploadButton";
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
    const trackIdVal = String(formData.get("trackId") ?? "").trim();
    const featuredNew = formData.get("featuredNewOrder");
    const featuredMostPlayed = formData.get("featuredMostPlayedOrder");
    const totalDur = formData.get("totalDurationMinutes");
    const ratingVal = formData.get("rating");
    await adminUpdateCourse(id, {
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? "").trim() || undefined,
      coverImage: String(formData.get("coverImage") ?? "").trim() || undefined,
      instructorName: String(formData.get("instructorName") ?? "").trim() || undefined,
      instructorImage: String(formData.get("instructorImage") ?? "").trim() || undefined,
      trackId: trackIdVal || "",
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
      featuredNewOrder:
        featuredNew === "" || featuredNew == null
          ? null
          : Number(featuredNew),
      featuredMostPlayedOrder:
        featuredMostPlayed === "" || featuredMostPlayed == null
          ? null
          : Number(featuredMostPlayed),
      totalDurationMinutes:
        totalDur === "" || totalDur == null ? null : Number(totalDur),
      rating: ratingVal === "" || ratingVal == null ? null : Number(ratingVal),
    });
    redirect(`/admin/content/courses/${id}?toast=Course+updated`);
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
    redirect(`/admin/content/courses/${id}?toast=Module+added`);
  }

  async function deleteCourse(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("courseId") ?? "");
    if (!id) return;
    await adminDeleteCourse(id);
    redirect("/admin/content/courses?toast=Course+deleted");
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link
          href="/admin/content/courses"
          className="rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ← Courses
        </Link>
        {course.track && (
          <>
            <span className="text-slate-400">/</span>
            <Link
              href={`/admin/content/tracks/${course.track.id}`}
              className="rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {course.track.title}
            </Link>
          </>
        )}
      </nav>

      {/* Header with cover */}
      <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {course.coverImage && (
          <div className="relative aspect-[3/1] w-full bg-slate-100">
            <Image
              src={course.coverImage}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-slate-900">{course.title}</h1>
          {course.summary && (
            <p className="mt-2 text-sm text-slate-600">{course.summary}</p>
          )}
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              course.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {course.published ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Edit Course Card */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit Course</h2>
        <form action={update} className="space-y-4">
          <input type="hidden" name="courseId" value={courseId} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Track (optional)</label>
            <select
              name="trackId"
              defaultValue={course.trackId ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              name="title"
              defaultValue={course.title}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cover image URL</label>
            <input
              name="coverImage"
              type="url"
              defaultValue={course.coverImage ?? ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Instructor name</label>
            <input
              name="instructorName"
              defaultValue={course.instructorName ?? ""}
              placeholder="e.g. Ahmed Radwan"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Instructor photo URL</label>
            <input
              name="instructorImage"
              type="url"
              defaultValue={course.instructorImage ?? ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Summary</label>
            <textarea
              name="summary"
              defaultValue={course.summary ?? ""}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Homepage sections & card stats</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Featured in &quot;New&quot; (order)
                </label>
                <input
                  name="featuredNewOrder"
                  type="number"
                  min={0}
                  placeholder="Leave empty to hide"
                  defaultValue={(course as { featuredNewOrder?: number | null }).featuredNewOrder ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="mt-0.5 text-xs text-slate-500">Set 1, 2, 3… to show in New section (lower = first).</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Featured in &quot;Most Played&quot; (order)
                </label>
                <input
                  name="featuredMostPlayedOrder"
                  type="number"
                  min={0}
                  placeholder="Leave empty to hide"
                  defaultValue={(course as { featuredMostPlayedOrder?: number | null }).featuredMostPlayedOrder ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="mt-0.5 text-xs text-slate-500">Set 1, 2, 3… to show in Most Played (lower = first).</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Total duration (minutes)</label>
                <input
                  name="totalDurationMinutes"
                  type="number"
                  min={0}
                  placeholder="e.g. 458"
                  defaultValue={(course as { totalDurationMinutes?: number | null }).totalDurationMinutes ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="mt-0.5 text-xs text-slate-500">Shown on cards (e.g. 7h 38m). Empty = from lesson count.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Rating (0–5)</label>
                <input
                  name="rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="e.g. 4.5"
                  defaultValue={(course as { rating?: number | null }).rating ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="mt-0.5 text-xs text-slate-500">Display rating on cards. Empty = 4.5.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Order</label>
              <input
                name="order"
                type="number"
                defaultValue={course.order ?? 0}
                min={0}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                name="published"
                type="checkbox"
                defaultChecked={course.published}
                className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              Published
            </label>
            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Save
            </button>
          </div>
        </form>

        <form action={deleteCourse} className="mt-6 border-t border-slate-200 pt-6">
          <input type="hidden" name="courseId" value={courseId} />
          <ConfirmDeleteButton
            label="Delete course"
            confirmMessage="Delete this course and all its modules and lessons? This cannot be undone."
          />
        </form>
      </section>

      {/* Intro Video Section */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Intro video</h2>
        <p className="mb-4 text-sm text-slate-600">
          This video appears on the course page for everyone (no login required). It acts as a preview or intro to the course.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <CourseIntroUploadButton courseId={courseId} courseTitle={course.title} />
          {(course as { introVideoMuxPlaybackId?: string | null }).introVideoMuxPlaybackId && (
            <p className="text-sm text-green-600">Intro video is set. View it on the course page. Upload again to replace.</p>
          )}
        </div>
      </section>

      {/* Modules Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Modules</h2>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-slate-700">Add Module</h3>
          <form action={createModule} className="flex flex-wrap gap-4">
            <input type="hidden" name="courseId" value={courseId} />
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Module title</label>
              <input
                name="title"
                placeholder="e.g. Course brief, What is geometric ornamentation"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
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
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Add Module
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {course.modules.map((m) => (
            <Link
              key={m.id}
              href={`/admin/content/modules/${m.id}`}
              className="group card-hover flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div className="font-semibold text-slate-900 group-hover:text-[var(--color-primary)]">{m.title}</div>
              <span className="text-sm text-[var(--color-primary)] group-hover:underline">Manage lessons →</span>
            </Link>
          ))}
          {course.modules.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
              No modules yet. Add one above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
