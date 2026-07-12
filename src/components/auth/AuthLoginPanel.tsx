"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  AuthOAuthSection,
  AuthPasswordField,
  AuthTextField,
  authHeadingStyle,
  authSubmitButtonStyle,
  authText24,
} from "./auth-form-ui";
import { buildOAuthCallbackUrl } from "./auth-oauth-icons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already registered with a password. Sign in with email instead, or use the same sign-in method you used when you registered.",
  OAuthSignin: "Could not start sign-in. Please try again.",
  OAuthCallback: "Sign-in was interrupted. Please try again.",
  AccessDenied: "Access was denied. Please try again or use another sign-in method.",
};

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export function AuthLoginPanel() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const registered = searchParams.get("registered") === "1";
  const verified = searchParams.get("verified") === "1";
  const oauthError = searchParams.get("error");
  const oauthErrorMessage = oauthError ? OAUTH_ERROR_MESSAGES[oauthError] : undefined;
  const oauthCallbackUrl = buildOAuthCallbackUrl(nextParam);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");

  function clearFieldError(field: keyof LoginFieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const errors: LoginFieldErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (errors.email || errors.password) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (!result?.ok) {
      setFieldErrors({
        password:
          "Invalid email or password. If you registered recently, confirm your email from the link we sent, then try again.",
      });
      return;
    }

    const toast = "toast=Signed+in";
    const res = await fetch("/api/auth/session");
    const session = (await res.json()) as { user?: { roles?: string[] } };
    const roles = session?.user?.roles ?? [];
    const isAdmin = roles.includes("ADMIN");
    const isMentor = roles.includes("MENTOR");
    const isInstructor = roles.includes("INSTRUCTOR");

    if (nextParam && nextParam.startsWith("/")) {
      window.location.href = nextParam.includes("?") ? `${nextParam}&${toast}` : `${nextParam}?${toast}`;
    } else if (isAdmin) {
      window.location.href = `/admin/content/tracks?${toast}`;
    } else if (isMentor) {
      window.location.href = `/mentor?${toast}`;
    } else if (isInstructor) {
      window.location.href = `/instructor?${toast}`;
    } else {
      window.location.href = `/home?${toast}`;
    }
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="m-0 text-black" style={authHeadingStyle}>
        LOG IN
      </h1>
      <div className="h-[74px] shrink-0" aria-hidden />

      <form onSubmit={handleSubmit} className="flex flex-col">
        {verified && (
          <p className="mb-[18px] text-center" style={authText24}>
            Email verified. You can sign in now.
          </p>
        )}
        {registered && !verified && (
          <p className="mb-[18px] text-center" style={authText24}>
            Registration successful. Please sign in.
          </p>
        )}
        {oauthErrorMessage && (
          <p className="mb-[18px] text-center text-red-700" style={authText24}>
            {oauthErrorMessage}
          </p>
        )}

        <AuthTextField
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          error={fieldErrors.email}
          errorId="login-email-error"
          onValueChange={() => {
            const el = document.getElementById("email") as HTMLInputElement | null;
            setEmailDraft(el?.value ?? "");
            clearFieldError("email");
          }}
        />
        <div className="h-[18px] shrink-0" aria-hidden />

        <AuthPasswordField
          showPassword={showPassword}
          onShowPassword={() => setShowPassword(true)}
          onHidePassword={() => setShowPassword(false)}
          error={fieldErrors.password}
          errorId="login-password-error"
          onValueChange={() => clearFieldError("password")}
        />
        <div className="h-[18px] shrink-0" aria-hidden />

        <p className="m-0 w-full text-right" style={authText24}>
          <Link href="/login" className="text-black">
            Forgot Password?
          </Link>
        </p>
        <div className="h-[31px] shrink-0" aria-hidden />

        <p className="m-0 mx-auto h-[29px] w-[372px] text-center text-black" style={authText24}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black underline">
            Join for Free
          </Link>
        </p>
        <div className="h-[32px] shrink-0" aria-hidden />

        <button
          type="submit"
          disabled={loading}
          className="mx-auto flex items-center justify-center border border-black bg-white disabled:cursor-not-allowed disabled:opacity-50"
          style={authSubmitButtonStyle}
        >
          {loading ? "Signing in..." : "GET STARTED"}
        </button>
      </form>

      <AuthOAuthSection
        onOAuthSignIn={(providerId) => signIn(providerId, { callbackUrl: oauthCallbackUrl })}
      />

      <div className="h-[68px] shrink-0" aria-hidden />

      <p className="m-0 mx-auto w-[477px] text-center text-black" style={authText24}>
        If you haven&apos;t received the confirmation email, you can{" "}
        <Link
          href={
            emailDraft.trim()
              ? `/register?checkEmail=${encodeURIComponent(emailDraft.trim())}`
              : "/register?checkEmail="
          }
          className="text-black underline"
        >
          resend it
        </Link>
        .
      </p>
    </div>
  );
}
