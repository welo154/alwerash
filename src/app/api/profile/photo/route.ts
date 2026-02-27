import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/server/db/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/** POST /api/profile/photo — upload profile picture; returns { url }. */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("photo") ?? formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const f = file as File;
  if (!ALLOWED_TYPES.includes(f.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400 }
    );
  }
  if (f.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be 4MB or smaller" },
      { status: 400 }
    );
  }

  const ext = f.type === "image/png" ? "png" : f.type === "image/webp" ? "webp" : "jpg";
  const filename = `${session.user.id}.${ext}`;
  const dir = path.join(process.cwd(), "public", "avatars");
  const filepath = path.join(dir, filename);

  try {
    await mkdir(dir, { recursive: true });
    const bytes = await f.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
  } catch (err) {
    console.error("Profile photo write failed:", err);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }

  const url = `/avatars/${filename}`;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: url },
  });

  return NextResponse.json({ url });
}
