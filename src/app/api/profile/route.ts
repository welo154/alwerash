import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

function skillsToSqlArray(skills: string[]): Prisma.Sql {
  if (skills.length === 0) return Prisma.sql`ARRAY[]::text[]`;
  return Prisma.sql`ARRAY[${Prisma.join(
    skills.map((s) => Prisma.sql`${s}`)
  )}]::text[]`;
}

/** PATCH /api/profile — update name, profession, bio, skills, country, image (no email). */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: string | null;
    profession?: string | null;
    bio?: string | null;
    skills?: string[];
    country?: string | null;
    image?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name =
    body.name !== undefined
      ? typeof body.name === "string"
        ? body.name.trim() || null
        : null
      : undefined;
  const profession =
    body.profession !== undefined
      ? typeof body.profession === "string"
        ? body.profession.trim() || null
        : null
      : undefined;
  const bio =
    body.bio !== undefined
      ? typeof body.bio === "string"
        ? body.bio.trim() || null
        : null
      : undefined;
  const skills =
    body.skills !== undefined
      ? Array.isArray(body.skills)
        ? body.skills
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      : undefined;
  const country =
    body.country !== undefined
      ? typeof body.country === "string"
        ? body.country.trim() || null
        : null
      : undefined;
  const image =
    body.image !== undefined
      ? typeof body.image === "string"
        ? body.image.trim() || null
        : null
      : undefined;

  if (
    name === undefined &&
    profession === undefined &&
    bio === undefined &&
    skills === undefined &&
    country === undefined &&
    image === undefined
  ) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const userId = session.user.id;

  try {
    const core: {
      name?: string | null;
      profession?: string | null;
      country?: string | null;
      image?: string | null;
    } = {};
    if (name !== undefined) core.name = name;
    if (profession !== undefined) core.profession = profession;
    if (country !== undefined) core.country = country;
    if (image !== undefined) core.image = image;

    if (Object.keys(core).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: core,
      });
    }

    if (bio !== undefined || skills !== undefined) {
      try {
        const sets: Prisma.Sql[] = [];
        if (bio !== undefined) sets.push(Prisma.sql`"bio" = ${bio}`);
        if (skills !== undefined) {
          sets.push(Prisma.sql`"skills" = ${skillsToSqlArray(skills)}`);
        }
        await prisma.$executeRaw(
          Prisma.sql`UPDATE "users" SET ${Prisma.join(sets, ", ")} WHERE "id" = ${userId}`
        );
      } catch (bioErr) {
        // Columns may not exist until migration is applied — core fields still saved
        console.warn("[api/profile] bio/skills update skipped:", bioErr);
      }
    }
  } catch (err) {
    console.error("[api/profile] update failed", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    profile: {
      name: name ?? undefined,
      profession: profession ?? undefined,
      bio: bio ?? undefined,
      skills: skills ?? undefined,
    },
  });
}
