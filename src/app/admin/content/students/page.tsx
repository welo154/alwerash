import Link from "next/link";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/server/auth/require";
import { adminListStudentStories } from "@/server/content/student-stories.service";

export default async function AdminStudentStoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { toast } = await searchParams;
  let stories: Awaited<ReturnType<typeof adminListStudentStories>> = [];
  let tableMissing = false;
  try {
    stories = await adminListStudentStories();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      tableMissing = true;
    } else {
      throw error;
    }
  }

  return (
    <div className="space-y-6 p-8 font-sans">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Student stories</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            These cards fill “Why students love Alwerash”. Each one is a student name, job title, review, and a submitted project photo. The site shows the first four that are marked visible, in order. Clicking the photo on the site opens it larger.
          </p>
        </div>
        <Link
          href="/admin/content/students/new"
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white no-underline hover:bg-slate-800"
        >
          Add student
        </Link>
      </div>

      {toast ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{toast}</p>
      ) : null}

      {tableMissing ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The student stories table is not set up yet. Run{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">npx prisma migrate deploy</code>
          , then refresh.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {stories.map((story) => (
          <article key={story.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="h-36 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-[#E7E7E7]">
              {story.projectImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.projectImage} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black">{story.name}</h2>
                  <p className="text-sm text-slate-600">{story.jobTitle}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {story.published ? `Visible · #${story.sortOrder}` : "Hidden"}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-slate-700">{story.quote}</p>
              <Link
                href={`/admin/content/students/${story.id}`}
                className="mt-3 inline-block text-sm font-medium text-black underline"
              >
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!tableMissing && stories.length === 0 ? (
        <p className="text-sm text-slate-600">No student stories yet.</p>
      ) : null}

      <Link className="text-sm text-slate-500 underline hover:text-black" href="/admin/content">
        ← Back to content
      </Link>
    </div>
  );
}
