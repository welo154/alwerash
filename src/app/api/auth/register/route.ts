// file: src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { RegisterInput, registerUser } from "@/server/auth/auth.service";

export const POST = handleRoute(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = RegisterInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "BAD_REQUEST", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await registerUser(parsed.data);
  return NextResponse.json({ user }, { status: 201 });
});
