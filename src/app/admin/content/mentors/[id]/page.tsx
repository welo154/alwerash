import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ConfirmDeleteButton } from "@/app/admin/content/components/ConfirmDeleteButton";
import { requireRole } from "@/server/auth/require";
import { adminDeleteMentor, adminGetMentor, adminUpdateMentor, MAX_LANDING_POPULAR_MENTORS } from "@/server/content/admin.service";
import { adminGetMentorAccountStatus } from "@/server/auth/adminUsers.service";
import { revalidatePublicMentorPaths } from "@/server/content/revalidate-public-paths";
import { MentorPhotoUpload } from "../../components/MentorPhotoUpload";
import { MentorAccountClient } from "../MentorAccountClient";

export default async function AdminMentorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const [mentor, accountStatus] = await Promise.all([
    adminGetMentor(id),
    adminGetMentorAccountStatus(id),
  ]);

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const mentorId = String(formData.get("mentorId") ?? "");
    if (!mentorId) return;
    const featuredOrder = formData.get("featuredOrder");
    const landingPopularOrder = formData.get("landingPopularOrder");
    await adminUpdateMentor(mentorId, {
      name: String(formData.get("name") ?? ""),
      certificateName: String(formData.get("certificateName") ?? "").trim() || undefined,
      aboutMe: String(formData.get("aboutMe") ?? "").trim(),
      featuredOrder:
        featuredOrder === "" || featuredOrder == null ? null : Number(featuredOrder),
      landingPopularOrder:
        landingPopularOrder === "" || landingPopularOrder == null
          ? null
          : Number(landingPopularOrder),
    });
    revalidatePath(`/admin/content/mentors/${mentorId}`);
    revalidatePath("/learn");
    revalidatePublicMentorPaths();
    redirect(`/admin/content/mentors/${mentorId}?toast=Mentor+updated`);
  }

  async function deleteMentor(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const mentorId = String(formData.get("mentorId") ?? "");
    if (!mentorId) return;
    await adminDeleteMentor(mentorId);
    revalidatePublicMentorPaths();
    revalidatePath("/admin/content/mentors");
    redirect("/admin/content/mentors?toast=Mentor+deleted");
  }

  return (
    <div className="p-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600">
        <Link
          href="/admin/content/mentors"
          className="rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ← Mentors
        </Link>
      </nav>

      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Edit Mentor</h1>

      {mentor.featuredOrder != null ? (
        <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
          Featured on Learn page (order {mentor.featuredOrder})
        </p>
      ) : null}
      {mentor.landingPopularOrder != null ? (
        <p className="mb-4 ml-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
          Popular on home page (order {mentor.landingPopularOrder})
        </p>
      ) : null}

      <div className="max-w-xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <MentorPhotoUpload mentorId={mentor.id} photo={mentor.photo} />

        <form action={update} className="space-y-4">
          <input type="hidden" name="mentorId" value={mentor.id} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              name="name"
              defaultValue={mentor.name}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Certificate name</label>
            <input
              name="certificateName"
              defaultValue={mentor.certificateName ?? ""}
              placeholder="e.g. Certified Design Mentor"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="aboutMe"
              defaultValue={mentor.aboutMe ?? ""}
              placeholder="Short bio or description"
              rows={4}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Featured on Learn page (order)
            </label>
            <input
              name="featuredOrder"
              type="number"
              min={0}
              max={8}
              placeholder="Leave empty to hide"
              defaultValue={mentor.featuredOrder ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <p className="mt-0.5 text-xs text-slate-500">Max 8 featured mentors (2 rows of 4 on Learn). Lower = first.</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Popular on home page (order)
            </label>
            <input
              name="landingPopularOrder"
              type="number"
              min={0}
              max={MAX_LANDING_POPULAR_MENTORS}
              placeholder="Leave empty to hide"
              defaultValue={mentor.landingPopularOrder ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <p className="mt-0.5 text-xs text-slate-500">
              Max {MAX_LANDING_POPULAR_MENTORS} mentors on the guest home “Current Mosts” strip. Lower = first.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Link
              href="/admin/content/mentors"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </form>

        <form action={deleteMentor} className="mt-6 border-t border-slate-200 pt-6">
          <input type="hidden" name="mentorId" value={mentor.id} />
          <ConfirmDeleteButton
            label="Delete mentor"
            confirmMessage={`Remove “${mentor.name}” permanently? Courses that list this mentor will have the mentor cleared. This cannot be undone.`}
          />
        </form>
      </div>

      <MentorAccountClient
        mentorId={mentor.id}
        linkedEmail={accountStatus.linked ? accountStatus.user.email : null}
      />
    </div>
  );
}
