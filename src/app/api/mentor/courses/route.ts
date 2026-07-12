import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireMentorIdForActor, requireMentorSession } from "@/server/auth/mentor-context";
import { mentorListCourses } from "@/server/content/mentor.service";

export const GET = handleRoute(async () => {
  const { user, isAdmin } = await requireMentorSession();
  const mentorId = await requireMentorIdForActor(user.id, isAdmin);
  const courses = await mentorListCourses(mentorId);
  return NextResponse.json({ courses });
});
