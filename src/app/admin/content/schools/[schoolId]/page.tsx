import { revalidatePath } from "next/cache";
import Link from "next/link";
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
    revalidatePath(`/admin/content/schools/${id}`);
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
    revalidatePath(`/admin/content/schools/${id}`);
  }

  return (
    <div className="p-6 space-y-6">
      <Link className="underline text-sm" href="/admin/content/schools">
        ← Back to Schools
      </Link>
      <h1 className="text-2xl font-semibold">School: {school.title}</h1>

      <form action={update} className="rounded border p-4 space-y-2 max-w-xl">
        <input type="hidden" name="schoolId" value={schoolId} />
        <h2 className="font-semibold">Edit School</h2>
        <div className="grid grid-cols-2 gap-2">
          <input name="title" defaultValue={school.title} className="rounded border p-2" required />
          <input name="slug" defaultValue={school.slug} className="rounded border p-2" required />
        </div>
        <textarea name="description" defaultValue={school.description ?? ""} className="w-full rounded border p-2" />
        <div className="flex items-center gap-3">
          <input name="order" type="number" defaultValue={school.order} className="w-24 rounded border p-2" />
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" defaultChecked={school.published} />
            Published
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">Save</button>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Tracks</h2>
        <form action={createTrack} className="rounded border p-4 space-y-2 max-w-xl">
          <input type="hidden" name="schoolId" value={schoolId} />
          <div className="grid grid-cols-2 gap-2">
            <input name="title" placeholder="Track title (e.g. Ornaments)" className="rounded border p-2" required />
            <input name="slug" placeholder="slug" className="rounded border p-2" required />
          </div>
          <textarea name="description" placeholder="Description" className="w-full rounded border p-2" />
          <div className="flex items-center gap-3">
            <input name="order" type="number" defaultValue={0} className="w-24 rounded border p-2" />
            <label className="flex items-center gap-2 text-sm">
              <input name="published" type="checkbox" />
              Published
            </label>
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">Add Track</button>
          </div>
        </form>
        <ul className="space-y-2">
          {school.tracks.map((t) => (
            <li key={t.id} className="rounded border p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm opacity-70">{t.slug} • {t.published ? "published" : "draft"}</div>
              </div>
              <Link className="underline" href={`/admin/content/tracks/${t.id}`}>Manage</Link>
            </li>
          ))}
          {school.tracks.length === 0 && (
            <li className="rounded border p-4 text-sm opacity-60">No tracks in this school yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
