import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireMentorIdForActor, requireMentorSession } from "@/server/auth/mentor-context";
import { mentorGetSubmission, mentorReviewSubmission } from "@/server/content/mentor.service";

export const GET = handleRoute(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const { user, isAdmin } = await requireMentorSession();
  const mentorId = await requireMentorIdForActor(user.id, isAdmin);
  const { id } = await ctx.params;
  const submission = await mentorGetSubmission(mentorId, id);
  return NextResponse.json({ submission });
});

export const PATCH = handleRoute(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const { user, isAdmin } = await requireMentorSession();
  const mentorId = await requireMentorIdForActor(user.id, isAdmin);
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const submission = await mentorReviewSubmission(mentorId, id, body);
  return NextResponse.json({ submission });
});
