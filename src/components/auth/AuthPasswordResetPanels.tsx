"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AuthPasswordField,
  AuthTextField,
  authHeadingStyle,
  authSubmitButtonStyle,
  authText24,
} from "./auth-form-ui";

type ActionResult = { ok: true } | { ok: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="auth-login-title m-0 text-black" style={authHeadingStyle}>
        {children}
      </h1>
      <div className="auth-login-title-gap h-[48px] shrink-0" aria-hidden />
    </>
  );
}

function SubmitButton({ loading, idle, busy }: { loading: boolean; idle: string; busy: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="auth-login-submit mx-auto flex items-center justify-center border border-black bg-white disabled:cursor-not-allowed disabled:opacity-50"
      style={authSubmitButtonStyle}
    >
      {loading ? busy : idle}
    </button>
  );
}

function BackToLogin() {
  return (
    <p className="m-0 mt-[32px] text-center" style={authText24}>
      <Link href="/login" className="text-black underline">
        Back to sign in
      </Link>
    </p>
  );
}

export function ForgotPasswordPanel({
  action,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    const result = await action(formData);
    setLoading(false);
    if (result.ok) setSent(true);
    else setError(result.error);
  }

  return (
    <div className="auth-mobile-panel auth-login-panel flex w-full flex-col">
      <PanelHeading>RESET PASSWORD</PanelHeading>
      {sent ? (
        <>
          <p className="m-0 text-center" style={authText24} role="status">
            If an account exists for that email, we&apos;ve sent a link to choose a new password. It
            expires in 1 hour.
          </p>
          <BackToLogin />
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <p className="m-0 mb-[24px]" style={authText24}>
            Enter your email and we&apos;ll send you a link to choose a new password.
          </p>
          <AuthTextField
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            error={error}
            errorId="forgot-email-error"
            onValueChange={() => setError(null)}
          />
          <div className="h-[32px] shrink-0" aria-hidden />
          <SubmitButton loading={loading} idle="SEND LINK" busy="Sending..." />
          <BackToLogin />
        </form>
      )}
    </div>
  );
}

export function ResetPasswordPanel({
  token,
  action,
}: {
  token: string;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  // Keep the token out of the address bar, where analytics session recording and
  // browser history would otherwise capture a working reset link.
  useEffect(() => {
    window.history.replaceState(null, "", "/reset-password");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    setError(null);
    setLoading(true);
    const result = await action(formData);
    setLoading(false);
    if (result.ok) setDone(true);
    else setError(result.error);
  }

  return (
    <div className="auth-mobile-panel auth-login-panel flex w-full flex-col">
      <PanelHeading>NEW PASSWORD</PanelHeading>
      {done ? (
        <>
          <p className="m-0 text-center" style={authText24} role="status">
            Your password has been changed and every device has been signed out. Sign in with your
            new password.
          </p>
          <BackToLogin />
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <p className="m-0 mb-[24px]" style={authText24}>
            At least 10 characters, with an uppercase letter, a lowercase letter, and a number.
          </p>
          <AuthPasswordField
            showPassword={showPassword}
            onShowPassword={() => setShowPassword(true)}
            onHidePassword={() => setShowPassword(false)}
            autoComplete="new-password"
            error={error}
            errorId="reset-password-error"
            onValueChange={() => setError(null)}
          />
          <div className="h-[32px] shrink-0" aria-hidden />
          <SubmitButton loading={loading} idle="SAVE" busy="Saving..." />
          <BackToLogin />
        </form>
      )}
    </div>
  );
}

export function ResetLinkProblemPanel({ expired }: { expired: boolean }) {
  return (
    <div className="auth-mobile-panel auth-login-panel flex w-full flex-col">
      <PanelHeading>{expired ? "LINK EXPIRED" : "INVALID LINK"}</PanelHeading>
      <p className="m-0 text-center" style={authText24}>
        {expired
          ? "This reset link has expired. Request a new one."
          : "This reset link is invalid or has already been used."}
      </p>
      <p className="m-0 mt-[32px] text-center" style={authText24}>
        <Link href="/forgot-password" className="text-black underline">
          Request a new link
        </Link>
      </p>
    </div>
  );
}
