import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { AddMentorForm } from "./AddMentorForm";

export default async function NewMentorPage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="p-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600">
        <Link
          href="/admin/content/mentors"
          className="rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ← Mentors
        </Link>
      </nav>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Add Mentor</h1>
      <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AddMentorForm />
      </div>
    </div>
  );
}
