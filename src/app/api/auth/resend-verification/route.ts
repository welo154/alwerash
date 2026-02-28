import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { createAndSendVerificationToken } from "@/server/email/verification.service";
import { z } from "zod";

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
