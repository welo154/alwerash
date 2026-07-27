import { redirect } from "next/navigation";

/** Legacy URL — public course pages now live at /course/[courseId]. */
export default async function LegacyCourseRedirect({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  redirect(`/course/${courseId}`);
}
