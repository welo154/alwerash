import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
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
              Sign in
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email and password to access your account
            </p>
          </div>
          <Suspense fallback={<div className="mt-8 animate-pulse text-slate-500">Loading...</div>}>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Sign up
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
