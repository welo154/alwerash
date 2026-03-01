import { NextResponse } from "next/server";
import { publicListTracks } from "@/server/content/public.service";

export const dynamic = "force-dynamic";

/** GET /api/catalog/tracks — public list of tracks for hero and UI. */
export async function GET() {
  try {
    const tracks = await publicListTracks();
    const list = tracks.map((t) => ({ id: t.id, title: t.title, slug: t.slug }));
    return NextResponse.json(list);
  } catch (err) {
    console.error("Catalog tracks API failed:", err);
    return NextResponse.json([], { status: 200 });
  }
}
