// file: src/app/api/webhooks/mux/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { verifyMuxWebhookSignature } from "@/server/video/webhook";
import { handleMuxWebhook } from "@/server/video/video.service";

export const runtime = "nodejs";
export const maxDuration = 30;

export const POST = handleRoute(async (req: Request) => {
  const rawBody = await req.text();
  const sig = req.headers.get("mux-signature");
  const secret = process.env.MUX_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "INTERNAL", message: "Missing MUX_WEBHOOK_SECRET" }, { status: 500 });
  }

  verifyMuxWebhookSignature({ rawBody, signatureHeader: sig, secret });

  const event = JSON.parse(rawBody);
  const result = await handleMuxWebhook(event);
  return NextResponse.json(result);
});
