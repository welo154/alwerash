// file: src/app/admin/content/tracks/[trackId]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { requireRole } from "@/server/auth/require";
import { adminCreateCourse, adminDeleteTrack, adminUpdateTrack } from "@/server/content/admin.service";
import { ConfirmDeleteButton } from "@/app/admin/content/components/ConfirmDeleteButton";

type TrackWithRelations = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  order: number;
  published: boolean;
  schoolId: string;
  school: { id: string; title: string } | null;
  courses: { id: string; title: string; published: boolean }[];
};

export default async function AdminTrackDetail({ params }: { params: Promise<{ trackId: string }> }) {
  await requireRole(["ADMIN"]);
  const { trackId } = await params;

  const track = (await prisma.track.findUnique({
    where: { id: trackId },
    include: {
      school: true,
      courses: {
        select: { id: true, title: true, published: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })) as TrackWithRelations | null;

  if (!track)
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-800">
          Track not found
        </div>
      </div>
    );

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("trackId") ?? "");
    if (!id) return;
    await adminUpdateTrack(id, {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      coverImage: String(formData.get("coverImage") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    redirect(`/admin/content/tracks/${id}?toast=Track+updated`);
  }

  async function createCourse(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("trackId") ?? "");
    if (!id) return;
    await adminCreateCourse({
      trackId: id,
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? "") || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    redirect(`/admin/content/tracks/${id}?toast=Course+added`);
  }

  async function deleteTrack(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("trackId") ?? "");
    if (!id) return;
    const t = await prisma.track.findUnique({ where: { id }, select: { schoolId: true } });
    await adminDeleteTrack(id);
    if (t?.schoolId) redirect(`/admin/content/schools/${t.schoolId}?toast=Track+deleted`);
    else redirect("/admin/content/tracks?toast=Track+deleted");
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link
          href="/admin/content/tracks"
          className="rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ← Tracks
        </Link>
        {track.school && (
          <>
            <span className="text-slate-400">/</span>
            <Link
              href={`/admin/content/schools/${track.school.id}`}
              className="rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {track.school.title}
            </Link>
          </>
        )}
      </nav>

      {/* Header with cover */}
      <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {track.coverImage && (
          <div className="relative aspect-[3/1] w-full bg-slate-100">
            <Image
              src={track.coverImage}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-slate-900">{track.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{track.slug}</p>
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              track.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {track.published ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Edit Track Card */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit Track</h2>
        <form action={update} className="space-y-4">
          <input type="hidden" name="trackId" value={trackId} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                name="title"
                defaultValue={track.title}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
              <input
                name="slug"
                defaultValue={track.slug}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cover image URL</label>
            <input
              name="coverImage"
              type="url"
              defaultValue={track.coverImage ?? ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              defaultValue={track.description ?? ""}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Order</label>
              <input
                name="order"
                type="number"
                defaultValue={track.order}
                min={0}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                name="published"
                type="checkbox"
                defaultChecked={track.published}
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

        <form action={deleteTrack} className="mt-6 border-t border-slate-200 pt-6">
          <input type="hidden" name="trackId" value={trackId} />
          <ConfirmDeleteButton
            label="Delete track"
            confirmMessage="Delete this track and all its courses? Courses will be unassigned (not deleted). This cannot be undone."
          />
        </form>
      </section>

      {/* Courses Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Courses</h2>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-slate-700">Add Course</h3>
          <form action={createCourse} className="space-y-4">
            <input type="hidden" name="trackId" value={trackId} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Course title</label>
                <input
                  name="title"
                  placeholder="e.g. Geometric Ornamentation"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Summary</label>
              <textarea
                name="summary"
                placeholder="Brief description"
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                name="published"
                type="checkbox"
                className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              Published
            </label>
            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Add Course
            </button>
          </form>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {track.courses.map((c: { id: string; title: string; published: boolean }) => (
            <Link
              key={c.id}
              href={`/admin/content/courses/${c.id}`}
              className="group card-hover flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-[var(--color-primary)]">{c.title}</div>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {c.published ? "Published" : "Draft"}
                </span>
              </div>
              <span className="text-sm text-[var(--color-primary)] group-hover:underline">Manage →</span>
            </Link>
          ))}
          {track.courses.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
              No courses in this track yet. Add one above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
