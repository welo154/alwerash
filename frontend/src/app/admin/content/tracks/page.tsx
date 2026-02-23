// file: src/app/admin/content/tracks/page.tsx
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { adminCreateTrack, adminListSchools, adminListTracks } from "@/server/content/admin.service";

type SchoolItem = Awaited<ReturnType<typeof adminListSchools>>[number];
type TrackItem = Awaited<ReturnType<typeof adminListTracks>>[number] & {
  school?: { title: string } | null;
  schoolId?: string;
};

export default async function AdminTracksPage() {
  await requireRole(["ADMIN"]);
  const [tracks, schools] = await Promise.all([
    adminListTracks(),
    adminListSchools(),
  ]);

  async function create(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const schoolId = String(formData.get("schoolId") ?? "");
    if (!schoolId) return;
    await adminCreateTrack({
      schoolId,
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      description: String(formData.get("description") ?? "") || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    revalidatePath("/admin/content/tracks");
  }

  return (
    <div className="p-6 space-y-6">
      <Link className="underline text-sm" href="/admin/content">← Back to Content Admin</Link>
      <h1 className="text-2xl font-semibold">Tracks</h1>

      <form action={create} className="rounded border p-4 space-y-2 max-w-xl">
        <h2 className="font-semibold">Create Track</h2>
        <div>
          <label className="block text-sm mb-1">School</label>
          <select name="schoolId" required className="w-full rounded border p-2">
            <option value="">Select school…</option>
            {schools.map((s: SchoolItem) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input name="title" placeholder="Title (e.g. Ornaments)" className="rounded border p-2" required />
          <input name="slug" placeholder="slug (e.g. ornaments)" className="rounded border p-2" required />
        </div>
        <textarea name="description" placeholder="Description" className="w-full rounded border p-2" />
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
            <input name="order" type="number" defaultValue={0} min={0} className="w-24 rounded border p-2" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" />
            Published
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white" disabled={schools.length === 0}>
            Create Track
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {tracks.map((t: TrackItem) => (
          <li key={t.id} className="rounded border p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm opacity-70">
                {t.school?.title ?? t.schoolId} • {t.slug} • {t.published ? "published" : "draft"}
              </div>
            </div>
            <Link className="underline" href={`/admin/content/tracks/${t.id}`}>Manage</Link>
          </li>
        ))}
        {tracks.length === 0 && (
          <li className="rounded border p-4 text-sm opacity-60">No tracks yet.</li>
        )}
      </ul>
    </div>
  );
}