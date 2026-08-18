import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { publicGetCoursesMenu } from "@/server/content/public.service";

export const dynamic = "force-dynamic";

export const GET = handleRoute(async () => {
  const menu = await publicGetCoursesMenu();
  return NextResponse.json(menu);
});
