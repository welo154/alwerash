import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { submitSubmission } from "@/server/learning/submission.service";

export const POST = handleRoute(async (_req, ctx: { params: Promise<{ assignmentId: string }> }) => {
  const session = await requireSubscription();
  const { assignmentId } = await ctx.params;
  const submission = await submitSubmission(assignmentId, session.user.id);
  return NextResponse.json({ submission });
});
