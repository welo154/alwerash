import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { instructorGetCourseLearners } from "@/server/content/instructor.service";
import { AppError } from "@/server/lib/errors";

export default async function InstructorCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await requireRole(["INSTRUCTOR", "ADMIN"]);
  const isAdmin = (session.user.roles ?? []).includes("ADMIN");
  const { courseId } = await params;

  let data: Awaited<ReturnType<typeof instructorGetCourseLearners>>;
  try {
    data = await instructorGetCourseLearners(session.user.id, courseId, isAdmin);
  } catch (e) {
    if (e instanceof AppError && e.code === "FORBIDDEN") redirect("/403");
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black">{data.course.title}</h1>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Learners who attended</h2>
        <p className="mt-1 text-sm text-slate-600">
          A learner appears here if they have started or completed any published lesson in this course.
        </p>

        <div className="mt-4 space-y-2">
          {data.learners.length === 0 ? (
            <p className="text-sm text-slate-600">No attendees yet.</p>
          ) : (
            data.learners.map((learner) => (
              <div
                key={learner.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
              >
                <span className="text-sm font-medium text-slate-900">{learner.name || "Unnamed learner"}</span>
                <span className="text-sm text-slate-600">{learner.email}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Submissions</h2>
        <p className="mt-2 text-sm text-slate-600">Submissions coming soon.</p>
      </section>
    </div>
  );
}
