import Link from "next/link";
import { Suspense } from "react";
import { CheckEmailClient } from "./CheckEmailClient";

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <Link
              href="/"
              className="text-xl font-semibold text-blue-600 hover:text-blue-700"
            >
              Alwerash
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              We sent a verification link to your email. Click the link to verify your account, then sign in.
            </p>
          </div>
          <Suspense fallback={<div className="mt-6 h-20 animate-pulse rounded bg-slate-100" />}>
            <CheckEmailContent searchParams={searchParams} />
          </Suspense>
          <p className="mt-6 text-center text-sm text-slate-600">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

async function CheckEmailContent({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const displayEmail = email?.trim() || null;
  return (
    <div className="mt-6">
      {displayEmail && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Sent to <strong>{displayEmail}</strong>
        </p>
      )}
      <CheckEmailClient email={displayEmail ?? undefined} />
    </div>
  );
}
