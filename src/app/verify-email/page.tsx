import Link from "next/link";
import { redirect } from "next/navigation";
import { withNext } from "@/lib/safe-internal-path";
import { readPostAuthNext, clearPostAuthNext } from "@/server/auth/post-auth-next";
import { verifyToken } from "@/server/email/verification.service";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const rememberedNext = await readPostAuthNext();
  const loginHref = withNext("/login", rememberedNext);

  if (!token?.trim()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center max-w-md">
          <h1 className="text-xl font-bold text-slate-900">Invalid link</h1>
          <p className="mt-2 text-sm text-slate-600">
            This verification link is invalid. Request a new one from sign-in or after registering.
          </p>
          <Link
            href={loginHref}
            className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyToken(token);

  if (result.success) {
    if (rememberedNext) await clearPostAuthNext();
    redirect(withNext("/login?verified=1", rememberedNext));
  }

  const isExpired = result.reason === "expired";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center max-w-md">
        <h1 className="text-xl font-bold text-slate-900">
          {isExpired ? "Link expired" : "Invalid link"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isExpired
            ? "This verification link has expired. Request a new one from sign-in."
            : "This link is invalid or already used."}
        </p>
        <Link
          href={loginHref}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
