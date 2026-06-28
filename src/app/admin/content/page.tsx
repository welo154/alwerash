// file: src/app/admin/content/page.tsx
import Link from "next/link";

export default function AdminContentHome() {
  return (
    <div className="p-6 font-sans space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-black">Content Admin</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        Hierarchy: <strong>Track</strong> (e.g. Graphic Design) → <strong>Course</strong> → <strong>Modules</strong> → Lessons. Tracks appear on the home page; courses use the middle card on each track page.
      </p>
      <div className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary-light)] px-4 py-3">
        <h2 className="font-semibold text-black mb-1">Videos</h2>
        <p className="text-sm text-black/80 mb-2">
          Upload lesson videos from: <strong>Courses</strong> → open a course → open a <strong>module</strong>.
        </p>
        <Link
          href="/admin/content/courses"
          className="inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white no-underline hover:bg-slate-800 transition-colors"
        >
          Go to Courses →
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-md shadow-sm">
          <h2 className="font-semibold text-black mb-1">Tracks</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Top-level categories (tall cards on home). Set Featured / Top rated / Activity order for home filters.
          </p>
          <Link
            href="/admin/content/tracks"
            className="inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white no-underline hover:bg-slate-800 transition-colors"
          >
            Manage Tracks
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-md shadow-sm">
          <h2 className="font-semibold text-black mb-1">Courses</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">Lessons live inside courses. Assign each course to a track.</p>
          <Link
            href="/admin/content/courses"
            className="inline-block rounded-xl border border-black px-4 py-2 text-sm font-medium text-black no-underline hover:bg-slate-50 transition-colors"
          >
            Manage Courses
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-md shadow-sm">
          <h2 className="font-semibold text-black mb-1">Instructors</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Create instructor accounts and assign them to courses.
          </p>
          <Link
            href="/admin/content/instructors"
            className="inline-block rounded-xl border border-black px-4 py-2 text-sm font-medium text-black no-underline hover:bg-slate-50 transition-colors"
          >
            Manage instructors
          </Link>
        </div>
      </div>
      <Link className="text-sm text-[var(--color-text-muted)] hover:text-black underline" href="/dashboard">← Back to Dashboard</Link>
    </div>
  );
}
