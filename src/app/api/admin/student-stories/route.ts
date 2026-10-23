import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import {
  adminCreateStudentStory,
  adminListStudentStories,
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

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  const stories = await adminListStudentStories();
  return NextResponse.json({ stories });
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const story = await adminCreateStudentStory(body);
    revalidateStudentStoryPaths();
    return NextResponse.json({ story });
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
}
