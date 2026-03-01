import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { adminCreateSchool } from "@/server/content/admin.service";

export function CreateSchoolForm() {
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
    redirect("/admin/content/schools?toast=School+added");
  }

  return (
    <form action={create} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          name="title"
          placeholder="e.g. Arts"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
        <input
          name="slug"
          placeholder="e.g. arts"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          placeholder="Optional description"
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
            defaultValue={0}
            min={0}
            className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input name="published" type="checkbox" className="rounded border-slate-300" />
          Published
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Link
          href="/admin/content/schools"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          Create School
        </button>
      </div>
    </form>
  );
}
