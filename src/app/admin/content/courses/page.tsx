import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/server/auth/require";
import { adminListCourses } from "@/server/content/admin.service";
import { AdminCoursesPageClient } from "./AdminCoursesPage";
import { CreateCourseForm } from "./CreateCourseForm";

type CourseItem = Awaited<ReturnType<typeof adminListCourses>>[number];

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const courses = await adminListCourses();
  const params = await searchParams;
  const showAddModal = params?.add === "1";

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Courses</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/admin/content/courses/${c.id}`}
            className="group card-hover flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md"
          >
            {c.coverImage ? (
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100">
                <Image
                  src={c.coverImage}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
              </div>
            ) : (
              <div className="aspect-video w-full shrink-0 bg-slate-100" />
            )}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {c.track ? `${c.track.title}` : "No track"}
              </p>
              <div className="mt-auto pt-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {c.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </Link>
        ))}
        <AdminCoursesPageClient
          showAddModal={showAddModal}
          createForm={<CreateCourseForm />}
        />
      </div>
    </div>
  );
}
