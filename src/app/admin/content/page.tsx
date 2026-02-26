// file: src/app/admin/content/page.tsx
import Link from "next/link";

export default function AdminContentHome() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Content Admin</h1>
      <p className="text-sm text-zinc-600">
        Hierarchy: <strong>School</strong> (e.g. Arts) → <strong>Track</strong> (e.g. Ornaments) → <strong>Course</strong> (e.g. Geometric Ornamentation) → <strong>Modules</strong> → Lessons. A course can have no track.
      </p>
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
        <strong>Upload video:</strong> Go to <strong>Manage Courses</strong> → open a course → open a <strong>module</strong> → for each <strong>Video</strong> lesson, use the <strong>Upload video</strong> button.
      </p>
      <div className="flex flex-col gap-4">
        <div className="rounded border p-4 max-w-md">
          <h2 className="font-semibold mb-1">Schools</h2>
          <p className="text-sm text-zinc-600 mb-2">Top level (e.g. Arts, Design). Tracks belong to a school.</p>
          <Link
            href="/admin/content/schools"
            className="inline-block rounded bg-black px-4 py-2 text-white no-underline"
          >
            Manage Schools
          </Link>
        </div>
        <div className="rounded border p-4 max-w-md">
          <h2 className="font-semibold mb-1">Tracks</h2>
          <p className="text-sm text-zinc-600 mb-2">Group courses within a school (e.g. Ornaments, Typography).</p>
          <Link
            href="/admin/content/tracks"
            className="inline-block rounded border border-black px-4 py-2 no-underline"
          >
            Manage Tracks
          </Link>
        </div>
        <div className="rounded border p-4 max-w-md">
          <h2 className="font-semibold mb-1">Courses</h2>
          <p className="text-sm text-zinc-600 mb-2">Main content. Assign to a track or leave unassigned.</p>
          <Link
            href="/admin/content/courses"
            className="inline-block rounded border border-black px-4 py-2 no-underline"
          >
            Manage Courses
          </Link>
        </div>
      </div>
      <Link className="underline text-sm" href="/dashboard">← Back to Dashboard</Link>
    </div>
  );
}
