import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import {
  adminListCourseInstructorAssignments,
  adminListInstructors,
} from "@/server/auth/adminUsers.service";
import { adminListCourses } from "@/server/content/admin.service";
import { InstructorsAdminClient } from "./InstructorsAdminClient";

export default async function AdminInstructorsPage() {
  await requireRole(["ADMIN"]);

  const [instructors, courses, assignments] = await Promise.all([
    adminListInstructors(),
    adminListCourses(),
    adminListCourseInstructorAssignments(),
  ]);

  const courseOptions = courses.map((c) => ({ id: c.id, title: c.title }));

  return (
    <div className="p-6 font-sans">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Instructors</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Create login accounts and assign them to courses. Instructors use <strong>/login</strong> and the{" "}
            <strong>Instructor portal</strong>.
          </p>
        </div>
        <Link
          href="/instructor"
          className="rounded-xl border border-black px-4 py-2 text-sm font-medium text-black no-underline hover:bg-slate-50"
        >
          Open instructor portal
        </Link>
      </div>

      <InstructorsAdminClient
        instructors={instructors}
        courses={courseOptions}
        assignments={assignments}
      />

      <p className="mt-10">
        <Link className="text-sm text-[var(--color-text-muted)] hover:text-black underline" href="/admin/content">
          ← Content admin
        </Link>
      </p>
    </div>
  );
}
