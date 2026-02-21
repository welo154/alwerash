// file: src/server/lib/route.ts
import { NextResponse } from "next/server";
import { AppError } from "./errors";

export type RouteContext = { params: Promise<Record<string, string>> };

type HandlerFn = (req: Request, context?: RouteContext) => Promise<Response>;
type HandlerWithParamsFn = (req: Request, context: RouteContext) => Promise<Response>;

function handleErr(err: unknown): Response {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: err.code, message: err.message, details: err.details ?? null },
      { status: err.status }
    );
  }
  console.error(err);
  return NextResponse.json(
    { error: "INTERNAL", message: "Unexpected server error" },
    { status: 500 }
  );
}

export function handleRoute(fn: HandlerFn): HandlerFn {
  return async (req: Request, context?: RouteContext) => {
    try {
      return await fn(req, context ?? { params: Promise.resolve({}) });
    } catch (err) {
      return handleErr(err);
    }
  };
}

/** Use for dynamic routes (e.g. [courseId]) so Next.js types are satisfied */
export function handleRouteWithParams(fn: HandlerWithParamsFn): HandlerWithParamsFn {
  return async (req: Request, context: RouteContext) => {
    try {
      return await fn(req, context);
    } catch (err) {
      return handleErr(err);
    }
  };
}
