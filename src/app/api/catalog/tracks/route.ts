// file: src/app/api/catalog/tracks/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { publicListTracks } from "@/server/content/public.service";

export const GET = handleRoute(async () => {
  const tracks = await publicListTracks();
  return NextResponse.json({ tracks });
});