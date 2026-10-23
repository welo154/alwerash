import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { handleRoute } from "@/server/lib/route";
import { adminPendingSubmissionCount } from "@/server/content/admin-submissions.service";

export const dynamic = "force-dynamic";

export const GET = handleRoute(async () => {
  await requireRole(["ADMIN"]);
  const count = await adminPendingSubmissionCount();
  return NextResponse.json({ count });
});
