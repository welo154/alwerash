// file: src/app/courses/[courseId]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicGetCourseById } from "@/server/content/public.service";
import { AppError } from "@/server/lib/errors";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  let course;
  try {
    course = await publicGetCourseById(courseId);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="p-6 space-y-4">
      {course.track ? (
        <Link className="underline text-sm" href={`/tracks/${course.track.slug}`}>
          ← Back to {course.track.title}
        </Link>
      ) : (
        <Link className="underline text-sm" href="/tracks">← Back to Tracks</Link>
      )}

      <h1 className="text-2xl font-semibold">{course.title}</h1>
      {course.summary ? <p>{course.summary}</p> : null}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Modules</h2>
        {course.modules.length === 0 ? (
          <p className="text-sm opacity-60">No modules yet.</p>
        ) : (
          course.modules.map((m) => (
            <div key={m.id} className="rounded border p-4">
              <h2 className="text-lg font-semibold">{m.title}</h2>
              <ul className="mt-2 space-y-1">
                {m.lessons.map((l) => (
                  <li key={l.id} className="text-sm">
                    {l.title} <span className="opacity-60">({l.type})</span>
                  </li>
                ))}
                {m.lessons.length === 0 ? (
                  <li className="text-sm opacity-60">No published lessons yet.</li>
                ) : null}
              </ul>
            </div>
          ))
        )
      }
      </div>
    </div>
  );
}