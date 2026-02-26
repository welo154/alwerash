// file: src/server/video/webhook.ts
import crypto from "crypto";
import { AppError } from "@/server/lib/errors";

export function verifyMuxWebhookSignature(opts: {
  rawBody: string;
  signatureHeader: string | null;
  secret: string;
  toleranceSeconds?: number;
}) {
  const { rawBody, signatureHeader, secret } = opts;
  const tolerance = opts.toleranceSeconds ?? 300; // 5 minutes (Mux default guidance)

  if (!signatureHeader) throw new AppError("FORBIDDEN", 403, "Missing Mux-Signature header");

  const parts = signatureHeader.split(",").map((p) => p.trim());
  const t = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);

  if (!t || !v1) throw new AppError("FORBIDDEN", 403, "Invalid Mux-Signature format");

  const timestamp = Number(t);
  if (!Number.isFinite(timestamp)) throw new AppError("FORBIDDEN", 403, "Invalid timestamp");

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) {
    throw new AppError("FORBIDDEN", 403, "Webhook timestamp outside tolerance");
  }

  const payload = `${t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  // constant-time compare
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(v1, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new AppError("FORBIDDEN", 403, "Invalid webhook signature");
  }
}
