// file: src/server/lib/route.ts
import { NextResponse } from "next/server";
import { AppError } from "./errors";

export function handleRoute(
  fn: (...args: any[]) => Promise<Response>
): (...args: any[]) => Promise<Response> {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (err) {
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
  };
}
