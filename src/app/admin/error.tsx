"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  const isAuthError =
    error.message?.includes("Unauthorized") ||
    error.message?.includes("Forbidden") ||
    (error as { code?: string }).code === "UNAUTHORIZED" ||
    (error as { code?: string }).code === "FORBIDDEN";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-black">
          {isAuthError ? "Access denied" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isAuthError
            ? "You don’t have permission to view this page. Try logging in with an admin account."
            : "The admin dashboard couldn’t load. This may be a temporary issue—try again or check the server."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Try again
          </button>
          {isAuthError ? (
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Log in
            </Link>
          ) : null}
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
