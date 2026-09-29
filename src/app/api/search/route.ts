import { NextRequest } from "next/server";
import { publicSearch } from "@/server/content/public.service";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { ip } = await readRequestContext();
  const limited = await consumeRateLimit(RATE_LIMITS.searchPerIp, ip);
  if (!limited.allowed) {
    return Response.json(
      { error: "RATE_LIMITED", message: RATE_LIMITED_MESSAGE },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 10, 20);
  const result = await publicSearch(q, limit);
  return Response.json(result);
}
