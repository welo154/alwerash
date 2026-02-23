"use client";

import { useSearchParams } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState, useEffect } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REQUIREMENTS = {
  min: 10,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  digit: /[0-9]/,
};

export default function RegisterForm({
  action,
}: {
  action: (formData: FormData) => Promise<{ success: true } | { success: false; error: string }>;
}) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [error, setError] = useState<string | null>(errorParam);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(errorParam);
  }, [errorParam]);

  function validate(
    email: string,
    password: string,
    confirmPassword: string
  ): string | null {
    if (!email.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
    if (!password) return "Password is required";
    if (password.length < PASSWORD_REQUIREMENTS.min)
      return `Password must be at least ${PASSWORD_REQUIREMENTS.min} characters`;
    if (!PASSWORD_REQUIREMENTS.upper.test(password))
      return "Password must include an uppercase letter";
    if (!PASSWORD_REQUIREMENTS.lower.test(password))
      return "Password must include a lowercase letter";
    if (!PASSWORD_REQUIREMENTS.digit.test(password))
      return "Password must include a number";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const err = validate(email, password, confirmPassword);
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await action(formData);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Name (optional)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
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
          autoComplete="new-password"
          placeholder="Min 10 chars, upper, lower, number"
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          At least 10 characters, one uppercase, one lowercase, one number
        </p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-slate-700">
          Country (optional)
        </label>
        <input
          id="country"
          name="country"
          type="text"
          autoComplete="country-code"
          placeholder="EG, SA, AE..."
          maxLength={2}
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 uppercase outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
