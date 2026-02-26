// file: src/app/api/catalog/tracks/[slug]/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { publicGetTrackBySlug } from "@/server/content/public.service";

export const GET = handleRoute(async (_req, ctx) => {
  const params = await ctx.params;
  const slug = params.slug;
  if (!slug) return NextResponse.json({ error: "BAD_REQUEST", message: "slug required" }, { status: 400 });
  const track = await publicGetTrackBySlug(slug);
  return NextResponse.json({ track });
});
