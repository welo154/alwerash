import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConfirmDeleteButton } from "@/app/admin/content/components/ConfirmDeleteButton";
import { requireRole } from "@/server/auth/require";
import { AppError } from "@/server/lib/errors";
import { adminDeleteStudentStory, adminGetStudentStory } from "@/server/content/student-stories.service";
import { revalidateStudentStoryPaths } from "@/server/content/revalidate-public-paths";
import { StudentStoryForm } from "../StudentStoryForm";

export default async function EditStudentStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  let story;
  try {
    story = await adminGetStudentStory(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    throw error;
  }

  async function remove() {
    "use server";
    await requireRole(["ADMIN"]);
    await adminDeleteStudentStory(id);
    revalidateStudentStoryPaths();
    redirect("/admin/content/students?toast=Deleted");
  }

  return (
    <div className="max-w-xl space-y-6 p-8 font-sans">
      <Link href="/admin/content/students" className="text-sm text-slate-500 underline hover:text-black">
        ← Student stories
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-black">Edit student</h1>
      <StudentStoryForm mode="edit" story={story} />
      <form action={remove} className="border-t border-slate-200 pt-4">
        <ConfirmDeleteButton label="Delete this student" confirmMessage="Delete this student story? This cannot be undone." />
      </form>
    </div>
  );
}
