"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const registered = searchParams.get("registered") === "1";
  const verified = searchParams.get("verified") === "1";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    if (result?.ok && result?.url) {
      const toast = "toast=Signed+in";
      const res = await fetch("/api/auth/session");
      const session = (await res.json()) as { user?: { roles?: string[] } };
      const isAdmin = session?.user?.roles?.includes("ADMIN");
      if (nextParam && nextParam.startsWith("/")) {
        window.location.href = nextParam.includes("?") ? `${nextParam}&${toast}` : `${nextParam}?${toast}`;
      } else if (isAdmin) {
        window.location.href = `/admin/content/tracks?${toast}`;
      } else {
        window.location.href = `/?${toast}`;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {verified && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Email verified. You can sign in now.
        </div>
      )}
      {registered && !verified && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Registration successful. Please sign in.
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
