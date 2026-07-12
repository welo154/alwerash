import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireMentorIdForActor, requireMentorSession } from "@/server/auth/mentor-context";
import { mentorGetDashboardStats } from "@/server/content/mentor.service";

export const GET = handleRoute(async () => {
  const { user, isAdmin } = await requireMentorSession();
  const mentorId = await requireMentorIdForActor(user.id, isAdmin);
  const stats = await mentorGetDashboardStats(mentorId);
  return NextResponse.json({ stats });
});
