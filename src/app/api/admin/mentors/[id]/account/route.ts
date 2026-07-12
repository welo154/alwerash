import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateMentorAccount,
  adminGetMentorAccountStatus,
} from "@/server/auth/adminUsers.service";

export const GET = handleRoute(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  await requireRole(["ADMIN"]);
  const { id } = await ctx.params;
  const status = await adminGetMentorAccountStatus(id);
  return NextResponse.json(status);
});

export const POST = handleRoute(async (req, ctx: { params: Promise<{ id: string }> }) => {
  await requireRole(["ADMIN"]);
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const result = await adminCreateMentorAccount({ ...body, mentorId: id });
  return NextResponse.json(result, { status: 201 });
});
