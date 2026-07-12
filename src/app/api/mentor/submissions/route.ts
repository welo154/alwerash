import { NextResponse } from "next/server";
import { SubmissionStatus } from "@prisma/client";
import { handleRoute } from "@/server/lib/route";
import { requireMentorIdForActor, requireMentorSession } from "@/server/auth/mentor-context";
import { mentorListSubmissions } from "@/server/content/mentor.service";

export const GET = handleRoute(async (req) => {
  const { user, isAdmin } = await requireMentorSession();
  const mentorId = await requireMentorIdForActor(user.id, isAdmin);
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const courseId = searchParams.get("courseId") ?? undefined;
  const status =
    statusParam && Object.values(SubmissionStatus).includes(statusParam as SubmissionStatus)
      ? (statusParam as SubmissionStatus)
      : undefined;
  const submissions = await mentorListSubmissions(mentorId, { status, courseId });
  return NextResponse.json({ submissions });
});
