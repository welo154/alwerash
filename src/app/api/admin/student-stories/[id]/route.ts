import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import {
  adminDeleteStudentStory,
  adminUpdateStudentStory,
} from "@/server/content/student-stories.service";
import { revalidateStudentStoryPaths } from "@/server/content/revalidate-public-paths";
import { AppError } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

function denied(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const story = await adminUpdateStudentStory(id, body);
    revalidateStudentStoryPaths();
    return NextResponse.json({ story });
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  const { id } = await ctx.params;
  try {
    await adminDeleteStudentStory(id);
    revalidateStudentStoryPaths();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
}
