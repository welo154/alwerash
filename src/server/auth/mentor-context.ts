import type { Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { requireRole } from "./require";

export async function getMentorIdForUser(userId: string): Promise<string | null> {
  const mentor = await prisma.mentor.findFirst({
    where: { userId },
    select: { id: true },
  });
  return mentor?.id ?? null;
}

export type MentorSession = {
  user: { id: string; roles: Role[] };
  mentorId: string | null;
  isAdmin: boolean;
};

/** Resolve mentor portal session. Mentors get their mentorId; admins may access all mentor data. */
export async function requireMentorSession(): Promise<MentorSession> {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  const roles = session.user.roles ?? [];
  const isAdmin = roles.includes("ADMIN");
  const mentorId = isAdmin ? null : await getMentorIdForUser(session.user.id);
  if (!isAdmin && !mentorId) {
    throw new AppError("FORBIDDEN", 403, "No mentor profile linked to this account");
  }
  return { user: session.user, mentorId, isAdmin };
}

export async function requireMentorIdForActor(actorUserId: string, isAdmin: boolean): Promise<string> {
  if (isAdmin) {
    throw new AppError("BAD_REQUEST", 400, "Admin must use mentor-scoped endpoints with a mentor account");
  }
  const mentorId = await getMentorIdForUser(actorUserId);
  if (!mentorId) throw new AppError("FORBIDDEN", 403, "No mentor profile linked to this account");
  return mentorId;
}
