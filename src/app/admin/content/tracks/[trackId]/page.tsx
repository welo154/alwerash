// file: src/app/admin/content/tracks/[trackId]/page.tsx
import { revalidatePath } from "next/cache";
import Link from "next/link";
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
    include: { courses: { orderBy: { createdAt: "asc" } }, school: true },
  } as { where: { id: string }; include: { courses: { orderBy: { createdAt: "asc" } }; school: true } })) as TrackWithRelations | null;

  if (!track) return <div className="p-6">Track not found</div>;

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("trackId") ?? "");
    if (!id) return;
    await adminUpdateTrack(id, {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    revalidatePath(`/admin/content/tracks/${id}`);
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
    revalidatePath(`/admin/content/tracks/${id}`);
  }

  async function deleteTrack(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = String(formData.get("trackId") ?? "");
    if (!id) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
const t = (await prisma.track.findUnique({ where: { id }, select: { schoolId: true } } as any)) as { schoolId: string } | null;
    await adminDeleteTrack(id);
    if (t?.schoolId) redirect(`/admin/content/schools/${t.schoolId}`);
    else redirect("/admin/content/tracks");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link className="underline" href="/admin/content">← Content Admin</Link>
        {track.school && (
          <>
            <span>·</span>
            <Link className="underline" href={`/admin/content/schools/${track.school.id}`}>
              {track.school.title}
            </Link>
          </>
        )}
      </div>
      <h1 className="text-2xl font-semibold">Track: {track.title}</h1>

      <form action={update} className="rounded border p-4 space-y-2 max-w-xl">
        <input type="hidden" name="trackId" value={trackId} />
        <div className="grid grid-cols-2 gap-2">
          <input name="title" defaultValue={track.title} className="rounded border p-2" required />
          <input name="slug" defaultValue={track.slug} className="rounded border p-2" required />
        </div>
        <textarea name="description" defaultValue={track.description ?? ""} className="w-full rounded border p-2" />
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
            <input name="order" type="number" defaultValue={track.order} min={0} className="w-24 rounded border p-2" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" defaultChecked={track.published} />
            Published
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">Save</button>
        </div>
      </form>

      <form action={deleteTrack} className="mt-2">
        <input type="hidden" name="trackId" value={trackId} />
        <ConfirmDeleteButton
          label="Delete track"
          confirmMessage="Delete this track and all its courses? Courses will be unassigned (not deleted). This cannot be undone."
        />
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Courses</h2>

        <form action={createCourse} className="rounded border p-4 space-y-2 max-w-xl">
          <input type="hidden" name="trackId" value={trackId} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-zinc-500 mb-0.5">Course title</label>
              <input name="title" placeholder="e.g. Geometric Ornamentation" className="w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-0.5">Order (for sorting)</label>
              <input name="order" type="number" defaultValue={0} min={0} className="w-full rounded border p-2" />
            </div>
          </div>
          <textarea name="summary" placeholder="Summary" className="w-full rounded border p-2" />
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" />
            Published
          </label>
          <button className="rounded bg-black px-4 py-2 text-white">Create course</button>
        </form>

        <ul className="space-y-2">
          {track.courses.map((c: { id: string; title: string; published: boolean }) => (
            <li key={c.id} className="rounded border p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm opacity-70">{c.published ? "published" : "draft"}</div>
              </div>
              <Link className="underline" href={`/admin/content/courses/${c.id}`}>Manage</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}