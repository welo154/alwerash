import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <Link
              href="/"
              className="font-logo text-3xl font-semibold italic text-black transition-colors hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            >
              alwerash<span className="text-3xl text-[var(--color-primary)]">.</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold uppercase tracking-tight text-black">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Enter your email and password to access your account
            </p>
          </div>
          <Suspense fallback={<div className="mt-8 animate-pulse text-slate-500">Loading...</div>}>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-black underline decoration-[var(--color-primary)] underline-offset-2 hover:text-[var(--color-primary)]">
              Sign up
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-black">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
