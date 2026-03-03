import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { adminGetMentor, adminUpdateMentor } from "@/server/content/admin.service";
import { MentorPhotoUpload } from "../../components/MentorPhotoUpload";

export default async function AdminMentorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const mentor = await adminGetMentor(id);

  async function update(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const mentorId = String(formData.get("mentorId") ?? "");
    if (!mentorId) return;
    await adminUpdateMentor(mentorId, {
      name: String(formData.get("name") ?? ""),
      certificateName: String(formData.get("certificateName") ?? "").trim() || undefined,
      aboutMe: String(formData.get("aboutMe") ?? "").trim() || undefined,
    });
    revalidatePath(`/admin/content/mentors/${mentorId}`);
    redirect(`/admin/content/mentors/${mentorId}?toast=Mentor+updated`);
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
            <label className="mb-1 block text-sm font-medium text-slate-700">About me</label>
            <textarea
              name="aboutMe"
              defaultValue={mentor.aboutMe ?? ""}
              placeholder="Short bio or description"
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
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
      </div>
    </div>
  );
}
