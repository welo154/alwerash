// file: src/app/admin/content/page.tsx
import Link from "next/link";

export default function AdminContentHome() {
  return (
    <div className="p-6 font-sans space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-black">Content Admin</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        Hierarchy: <strong>School</strong> (e.g. Arts) → <strong>Track</strong> (e.g. Ornaments) → <strong>Course</strong> (e.g. Geometric Ornamentation) → <strong>Modules</strong> → Lessons. A course can have no track.
      </p>
      <div className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary-light)] px-4 py-3">
        <h2 className="font-semibold text-black mb-1">Videos</h2>
        <p className="text-sm text-black/80 mb-2">
          Upload and preview lesson videos from the module page: <strong>Manage Courses</strong> → open a course → open a <strong>module</strong>. For each <strong>Video</strong> lesson you can <strong>Upload video</strong> and see a preview once the video is ready.
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
          <h2 className="font-semibold text-black mb-1">Schools</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">Top level (e.g. Arts, Design). Tracks belong to a school.</p>
          <Link
            href="/admin/content/schools"
            className="inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white no-underline hover:bg-slate-800 transition-colors"
          >
            Manage Schools
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-md shadow-sm">
          <h2 className="font-semibold text-black mb-1">Tracks</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">Group courses within a school (e.g. Ornaments, Typography).</p>
          <Link
            href="/admin/content/tracks"
            className="inline-block rounded-xl border border-black px-4 py-2 text-sm font-medium text-black no-underline hover:bg-slate-50 transition-colors"
          >
            Manage Tracks
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-md shadow-sm">
          <h2 className="font-semibold text-black mb-1">Courses</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">Main content. Assign to a track or leave unassigned.</p>
          <Link
            href="/admin/content/courses"
            className="inline-block rounded-xl border border-black px-4 py-2 text-sm font-medium text-black no-underline hover:bg-slate-50 transition-colors"
          >
            Manage Courses
          </Link>
        </div>
      </div>
      <Link className="text-sm text-[var(--color-text-muted)] hover:text-black underline" href="/dashboard">← Back to Dashboard</Link>
    </div>
  );
}
