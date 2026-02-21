"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: next,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    if (result?.url) window.location.href = result.url;
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          name="email"
          type="email"
          placeholder="email"
          className="w-full rounded border p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          className="w-full rounded border p-2"
          required
        />
        <button type="submit" className="w-full rounded bg-black p-2 text-white">
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account? <a className="underline" href="/register">Register</a>
      </p>
    </div>
  );
}
