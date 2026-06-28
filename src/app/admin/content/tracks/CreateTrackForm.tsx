import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { adminCreateTrack } from "@/server/content/admin.service";
import { revalidatePublicCatalogPaths } from "@/server/content/revalidate-public-paths";

export async function CreateTrackForm() {
  await requireRole(["ADMIN"]);

  async function create(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const parseOrder = (name: string) => {
      const raw = String(formData.get(name) ?? "").trim();
      return raw === "" ? null : Number(raw);
    };
    await adminCreateTrack({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      coverImage: String(formData.get("coverImage") ?? "").trim() || undefined,
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
      featuredOrder: parseOrder("featuredOrder"),
      topRatedOrder: parseOrder("topRatedOrder"),
      activityOrder: parseOrder("activityOrder"),
    });
    revalidatePublicCatalogPaths();
    redirect("/admin/content/tracks?toast=Track+added");
  }

  return (
    <form action={create} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            placeholder="e.g. Graphic Design"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
          <input
            name="slug"
            placeholder="e.g. graphic-design"
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
          placeholder="https://..."
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
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Home page filters</h3>
        <p className="mb-3 text-xs text-slate-500">
          Set order numbers to show this track under FEATURED, TOP RATED, or ACTIVITY on the home page. Leave empty to hide from that filter.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Featured order</label>
            <input name="featuredOrder" type="number" min={0} placeholder="e.g. 1" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Top rated order</label>
            <input name="topRatedOrder" type="number" min={0} placeholder="e.g. 1" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Activity order</label>
            <input name="activityOrder" type="number" min={0} placeholder="e.g. 1" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Order</label>
          <input name="order" type="number" defaultValue={0} min={0} className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <label className="flex flex-col gap-1 text-sm text-slate-700 sm:flex-row sm:items-center sm:gap-2">
          <span className="inline-flex items-center gap-2">
            <input name="published" type="checkbox" defaultChecked className="rounded border-slate-300" />
            Published
          </span>
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Link href="/admin/content/tracks" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cancel
        </Link>
        <button type="submit" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
          Create Track
        </button>
      </div>
    </form>
  );
}
