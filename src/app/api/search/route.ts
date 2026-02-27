import { NextRequest } from "next/server";
import { publicSearch } from "@/server/content/public.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 10, 20);
  const result = await publicSearch(q, limit);
  return Response.json(result);
}
