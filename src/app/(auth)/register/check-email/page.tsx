import Link from "next/link";
import { Suspense } from "react";
import { CheckEmailClient } from "./CheckEmailClient";

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-black">Check your email</h1>
      <p className="mt-2 text-sm text-slate-600">
        We sent a verification link to your email. Click the link to verify your account, then sign in.
      </p>
      <Suspense fallback={<div className="mt-6 h-20 animate-pulse rounded bg-slate-100" />}>
        <CheckEmailContent searchParams={searchParams} />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link href="/login" className="font-medium text-black underline underline-offset-2">
          Back to sign in
        </Link>
      </p>
    </>
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
        <p className="text-sm text-slate-700">
          Sent to <strong>{displayEmail}</strong>
        </p>
      )}
      <CheckEmailClient email={displayEmail ?? undefined} />
    </div>
  );
}
