import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { createAndSendVerificationToken } from "@/server/email/verification.service";
import { z } from "zod";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";
import { recordSecurityEvent } from "@/server/security/security-events";

const BodySchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid email" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const { ip } = await readRequestContext();
  const [perAddress, perIp] = await Promise.all([
    consumeRateLimit(RATE_LIMITS.emailPerAddress, email),
    consumeRateLimit(RATE_LIMITS.emailPerIp, ip),
  ]);
  if (!perAddress.allowed || !perIp.allowed) {
    await recordSecurityEvent({ type: "RATE_LIMITED", email, metadata: { rule: "resend_verification" } });
    return NextResponse.json(
      { sent: false, message: RATE_LIMITED_MESSAGE },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(perAddress.retryAfterSeconds, perIp.retryAfterSeconds)) },
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, emailVerified: true },
  });

  if (!user || user.emailVerified) {
    return NextResponse.json({ sent: true });
  }

  const { sent, error } = await createAndSendVerificationToken(user.id, user.email);

  if (!sent) {
    return NextResponse.json(
      { sent: false, message: error ?? "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ sent: true });
}
