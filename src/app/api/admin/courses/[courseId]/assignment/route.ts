import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateCourseAssignment,
  adminDeleteCourseAssignment,
  adminGetCourseAssignment,
  adminUpdateCourseAssignment,
} from "@/server/content/assignment.service";

export const GET = handleRoute(async (_req, ctx: { params: Promise<{ courseId: string }> }) => {
  await requireRole(["ADMIN"]);
  const { courseId } = await ctx.params;
  const assignment = await adminGetCourseAssignment(courseId);
  return NextResponse.json({ assignment });
});

export const POST = handleRoute(async (req, ctx: { params: Promise<{ courseId: string }> }) => {
  await requireRole(["ADMIN"]);
  const { courseId } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const assignment = await adminCreateCourseAssignment({ ...body, courseId });
  return NextResponse.json({ assignment }, { status: 201 });
});

export const PUT = handleRoute(async (req, ctx: { params: Promise<{ courseId: string }> }) => {
  await requireRole(["ADMIN"]);
  const { courseId } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const assignment = await adminUpdateCourseAssignment(courseId, body);
  return NextResponse.json({ assignment });
});

export const DELETE = handleRoute(async (_req, ctx: { params: Promise<{ courseId: string }> }) => {
  await requireRole(["ADMIN"]);
  const { courseId } = await ctx.params;
  await adminDeleteCourseAssignment(courseId);
  return NextResponse.json({ ok: true });
});
