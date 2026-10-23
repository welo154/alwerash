import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { handleRoute } from "@/server/lib/route";
import { adminGetSubmission } from "@/server/content/admin-submissions.service";
import { adminReviewSubmission } from "@/server/content/mentor.service";

export const GET = handleRoute(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  await requireRole(["ADMIN"]);
  const { id } = await ctx.params;
  const submission = await adminGetSubmission(id);
  return NextResponse.json({ submission });
});

export const PATCH = handleRoute(async (req, ctx: { params: Promise<{ id: string }> }) => {
  await requireRole(["ADMIN"]);
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const submission = await adminReviewSubmission(id, body);
  return NextResponse.json({ submission });
});
