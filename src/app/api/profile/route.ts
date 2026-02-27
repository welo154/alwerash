import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

/** PATCH /api/profile — update name, country, image (no email). */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; country?: string; image?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() || null : undefined;
  const country = typeof body.country === "string" ? body.country.trim() || null : undefined;
  const image = body.image !== undefined ? (typeof body.image === "string" ? body.image.trim() || null : null) : undefined;

  if (name === undefined && country === undefined && image === undefined) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const data: { name?: string | null; country?: string | null; image?: string | null } = {};
  if (name !== undefined) data.name = name;
  if (country !== undefined) data.country = country;
  if (image !== undefined) data.image = image;

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return NextResponse.json({ ok: true });
}
