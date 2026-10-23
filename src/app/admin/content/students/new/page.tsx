import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { adminListStudentStories } from "@/server/content/student-stories.service";
import { StudentStoryForm } from "../StudentStoryForm";

export default async function NewStudentStoryPage() {
  await requireRole(["ADMIN"]);
  let nextOrder = 1;
  try {
    const stories = await adminListStudentStories();
    nextOrder = stories.reduce((highest, story) => Math.max(highest, story.sortOrder), 0) + 1;
  } catch {
    nextOrder = 1;
  }

  return (
    <div className="max-w-xl space-y-6 p-8 font-sans">
      <Link href="/admin/content/students" className="text-sm text-slate-500 underline hover:text-black">
        ← Student stories
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-black">Add a student</h1>
      <StudentStoryForm mode="create" story={{ id: "", name: "", jobTitle: "", quote: "", projectImage: null, sortOrder: nextOrder, published: true }} />
    </div>
  );
}
