import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { upsertSubmissionDraft } from "@/server/learning/submission.service";

export const POST = handleRoute(async (req, ctx: { params: Promise<{ assignmentId: string }> }) => {
  const session = await requireSubscription();
  const { assignmentId } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const submission = await upsertSubmissionDraft(assignmentId, session.user.id, body);
  return NextResponse.json({ submission });
});
