import { revalidatePath } from "next/cache";
import { requireRole } from "@/server/auth/require";
import {
  adminListCourses,
  adminSetCoursePopular,
  adminSetCourseTrending,
} from "@/server/content/admin.service";
import { AdminCoursesPageClient } from "./AdminCoursesPage";
import { AdminCourseCard } from "./AdminCourseCard";
import { CreateCourseForm } from "./CreateCourseForm";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const courses = await adminListCourses();
  const params = await searchParams;
  const showAddModal = params?.add === "1";

  async function toggleCoursePopular(courseId: string, popular: boolean) {
    "use server";
    await requireRole(["ADMIN"]);
    await adminSetCoursePopular(courseId, popular);
    revalidatePath("/admin/content/courses");
    revalidatePath("/learn");
  }

  async function toggleCourseTrending(courseId: string, trending: boolean) {
    "use server";
    await requireRole(["ADMIN"]);
    await adminSetCourseTrending(courseId, trending);
    revalidatePath("/admin/content/courses");
    revalidatePath("/learn");
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Courses</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((c) => (
          <AdminCourseCard
            key={c.id}
            course={{
              id: c.id,
              title: c.title,
              summary: c.summary,
              coverImage: c.coverImage,
              published: c.published,
              featuredMostPlayedOrder: c.featuredMostPlayedOrder ?? null,
              featuredTrendingOrder: c.featuredTrendingOrder ?? null,
              track: c.track,
            }}
            togglePopular={toggleCoursePopular}
            toggleTrending={toggleCourseTrending}
          />
        ))}
        <AdminCoursesPageClient
          showAddModal={showAddModal}
          createForm={<CreateCourseForm />}
        />
      </div>
    </div>
  );
}
