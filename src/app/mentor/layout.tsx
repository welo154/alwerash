import Link from "next/link";
import { getMentorIdForUser } from "@/server/auth/mentor-context";
import { requireRole } from "@/server/auth/require";
import { prisma } from "@/server/db/prisma";

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  const mentorId = await getMentorIdForUser(session.user.id);
  const mentor = mentorId
    ? await prisma.mentor.findUnique({ where: { id: mentorId }, select: { name: true } })
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mentor portal</p>
            <p className="text-lg font-semibold text-slate-900">{mentor?.name ?? "Mentor"}</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <Link href="/mentor" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/mentor/submissions" className="hover:text-slate-900">
              Submissions
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
