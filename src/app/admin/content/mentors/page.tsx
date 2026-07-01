import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/server/auth/require";
import { adminListMentors, adminSetMentorFeatured } from "@/server/content/admin.service";
import { AdminMentorCard } from "./AdminMentorCard";
import { MentorsAddCard } from "./MentorsAddCard";

export default async function AdminMentorsPage() {
  await requireRole(["ADMIN"]);
  let mentors: Awaited<ReturnType<typeof adminListMentors>> = [];
  let tableMissing = false;
  try {
    mentors = await adminListMentors();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
      mentors = [];
      tableMissing = true;
    } else {
      throw e;
    }
  }

  async function toggleMentorFeatured(mentorId: string, featured: boolean) {
    "use server";
    await requireRole(["ADMIN"]);
    await adminSetMentorFeatured(mentorId, featured);
    revalidatePath("/admin/content/mentors");
    revalidatePath("/learn");
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Mentors</h1>

      {tableMissing && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Mentors table not set up.</strong> Run in your project:{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">npx prisma migrate deploy</code>
          , then refresh this page.
        </div>
      )}

      <p className="mb-6 max-w-2xl text-sm text-slate-600">
        Mark up to <strong>8 mentors</strong> as featured to show in the Learn page mentor section (2 rows of 4).
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentors.map((m) => (
          <AdminMentorCard
            key={m.id}
            mentor={{
              id: m.id,
              name: m.name,
              photo: m.photo,
              featuredOrder: m.featuredOrder ?? null,
            }}
            toggleFeatured={toggleMentorFeatured}
          />
        ))}
        {!tableMissing && <MentorsAddCard />}
      </div>
    </div>
  );
}
