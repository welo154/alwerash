import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getPublishedAssignmentForCourse } from "@/server/content/assignment.service";
import { getLearnerSubmissionForCourse } from "@/server/learning/submission.service";

export const GET = handleRoute(async (_req, ctx: { params: Promise<{ courseId: string }> }) => {
  const session = await requireSubscription();
  const { courseId } = await ctx.params;
  const assignment = await getPublishedAssignmentForCourse(courseId);
  if (!assignment) {
    return NextResponse.json({ assignment: null, submission: null });
  }
  const submission = await getLearnerSubmissionForCourse(courseId, session.user.id);
  return NextResponse.json({ assignment, submission });
});
