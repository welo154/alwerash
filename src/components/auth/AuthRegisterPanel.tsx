"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useEffect, useState } from "react";
import {
  AuthOAuthSection,
  AuthPasswordField,
  AuthTextField,
  authHeadingStyle,
  authSubmitButtonStyle,
  authText24,
} from "./auth-form-ui";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REQUIREMENTS = {
  min: 10,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  digit: /[0-9]/,
};

type RegisterFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

function validateFields(name: string, email: string, password: string): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  if (!name.trim()) errors.name = "Name is required";
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < PASSWORD_REQUIREMENTS.min) {
    errors.password = `Password must be at least ${PASSWORD_REQUIREMENTS.min} characters`;
  } else if (!PASSWORD_REQUIREMENTS.upper.test(password)) {
    errors.password = "Password must include an uppercase letter";
  } else if (!PASSWORD_REQUIREMENTS.lower.test(password)) {
    errors.password = "Password must include a lowercase letter";
  } else if (!PASSWORD_REQUIREMENTS.digit.test(password)) {
    errors.password = "Password must include a number";
  }

  return errors;
}

function mapServerError(message: string): RegisterFieldErrors {
  const lower = message.toLowerCase();
  if (lower.includes("email") && lower.includes("registered")) {
    return { email: message };
  }
  if (lower.includes("password")) {
    return { password: message };
  }
  if (lower.includes("name")) {
    return { name: message };
  }
  return { email: message };
}

export function AuthRegisterPanel({
  action,
}: {
  action: (formData: FormData) => Promise<{ success: true } | { success: false; error: string }>;
}) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setFieldErrors(mapServerError(errorParam));
    }
  }, [errorParam]);

  function clearFieldError(field: keyof RegisterFieldErrors) {
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
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const errors = validateFields(name, email, password);
    if (errors.name || errors.email || errors.password) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const result = await action(formData);
      if (!result.success) {
        setFieldErrors(mapServerError(result.error));
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setFieldErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="m-0 text-black" style={authHeadingStyle}>
        SIGN IN
      </h1>
      <div className="h-[12px] shrink-0" aria-hidden />
      <p className="m-0 h-[29px] w-[598px] max-w-full text-black" style={authText24}>
        Learn from the best and showcase your creative work.
      </p>
      <div className="h-[33px] shrink-0" aria-hidden />

      <form onSubmit={handleSubmit} className="flex flex-col">
        <AuthTextField
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          autoComplete="name"
          required
          error={fieldErrors.name}
          errorId="register-name-error"
          onValueChange={() => clearFieldError("name")}
        />
        <div className="h-[18px] shrink-0" aria-hidden />

        <AuthTextField
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          error={fieldErrors.email}
          errorId="register-email-error"
          onValueChange={() => clearFieldError("email")}
        />
        <div className="h-[18px] shrink-0" aria-hidden />

        <AuthPasswordField
          showPassword={showPassword}
          onShowPassword={() => setShowPassword(true)}
          onHidePassword={() => setShowPassword(false)}
          autoComplete="new-password"
          error={fieldErrors.password}
          errorId="register-password-error"
          onValueChange={() => clearFieldError("password")}
        />
        <div className="h-[35px] shrink-0" aria-hidden />

        <p className="m-0 h-[65px] w-[549px] max-w-full text-black" style={authText24}>
          By signing up, you agree to our{" "}
          <Link href="/" className="text-black underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-black underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="h-[32px] shrink-0" aria-hidden />

        <button
          type="submit"
          disabled={loading}
          className="mx-auto flex items-center justify-center border border-black bg-white disabled:cursor-not-allowed disabled:opacity-50"
          style={authSubmitButtonStyle}
        >
          {loading ? "Creating account..." : "GET STARTED"}
        </button>
      </form>

      <AuthOAuthSection />

      <div className="h-[40px] shrink-0" aria-hidden />

      <p className="m-0 text-center text-black" style={authText24}>
        Already have an account?{" "}
        <Link href="/login" className="text-black underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
