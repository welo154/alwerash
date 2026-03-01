import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateTrack,
  adminGetSchool,
  adminUpdateSchool,
} from "@/server/content/admin.service";

export default async function AdminSchoolDetail({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { schoolId } = await params;
  const school = await adminGetSchool(schoolId);

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("schoolId") ?? "");
    if (!id) return;
    await adminUpdateSchool(id, {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    redirect(`/admin/content/schools/${id}?toast=School+updated`);
  }

  async function createTrack(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("schoolId") ?? "");
    if (!id) return;
    await adminCreateTrack({
      schoolId: id,
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    redirect(`/admin/content/schools/${id}?toast=Track+added`);
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600">
        <Link
          href="/admin/content/schools"
          className="rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ← Schools
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">{school.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{school.slug}</p>
        <span
          className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            school.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {school.published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Edit School Card */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit School</h2>
        <form action={update} className="space-y-4">
          <input type="hidden" name="schoolId" value={schoolId} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                name="title"
                defaultValue={school.title}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
              <input
                name="slug"
                defaultValue={school.slug}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              defaultValue={school.description ?? ""}
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
                defaultValue={school.order}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                name="published"
                type="checkbox"
                defaultChecked={school.published}
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
      </section>

      {/* Tracks Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Tracks</h2>

        {/* Add Track Form */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-slate-700">Add Track</h3>
          <form action={createTrack} className="space-y-4">
            <input type="hidden" name="schoolId" value={schoolId} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  name="title"
                  placeholder="e.g. Ornaments"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
                <input
                  name="slug"
                  placeholder="e.g. ornaments"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                placeholder="Optional description"
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Order</label>
                <input
                  name="order"
                  type="number"
                  defaultValue={0}
                  className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
                Add Track
              </button>
            </div>
          </form>
        </div>

        {/* Tracks List */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {school.tracks.map((t) => (
            <Link
              key={t.id}
              href={`/admin/content/tracks/${t.id}`}
              className="group card-hover flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-[var(--color-primary)]">{t.title}</div>
                <div className="text-sm text-slate-500">{t.slug}</div>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t.published ? "Published" : "Draft"}
                </span>
              </div>
              <span className="text-sm text-[var(--color-primary)] group-hover:underline">Manage →</span>
            </Link>
          ))}
          {school.tracks.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
              No tracks in this school yet. Add one above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
