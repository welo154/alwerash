import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { adminCreateSchool, adminListSchools } from "@/server/content/admin.service";

export default async function AdminSchoolsPage() {
  await requireRole(["ADMIN"]);
  const schools = await adminListSchools();

  async function create(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    await adminCreateSchool({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    });
    revalidatePath("/admin/content/schools");
  }

  return (
    <div className="p-6 space-y-6">
      <Link className="underline text-sm" href="/admin/content">
        ← Back to Content Admin
      </Link>
      <h1 className="text-2xl font-semibold">Schools</h1>

      <form action={create} className="rounded border p-4 space-y-2 max-w-xl">
        <h2 className="font-semibold">Create School</h2>
        <div className="grid grid-cols-2 gap-2">
          <input name="title" placeholder="Title (e.g. Arts)" className="rounded border p-2" required />
          <input name="slug" placeholder="slug (e.g. arts)" className="rounded border p-2" required />
        </div>
        <textarea name="description" placeholder="Description" className="w-full rounded border p-2" />
        <div className="flex items-center gap-3">
          <input name="order" type="number" defaultValue={0} className="w-24 rounded border p-2" />
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" />
            Published
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Create School
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {schools.map((s) => (
          <li key={s.id} className="rounded border p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm opacity-70">{s.slug} • {s.published ? "published" : "draft"}</div>
            </div>
            <Link className="underline" href={`/admin/content/schools/${s.id}`}>
              Manage
            </Link>
          </li>
        ))}
        {schools.length === 0 && (
          <li className="rounded border p-4 text-sm opacity-60">No schools yet.</li>
        )}
      </ul>
    </div>
  );
}
