"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
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
import { buildOAuthCallbackUrl } from "./auth-oauth-icons";
import { CheckEmailModal } from "./CheckEmailModal";

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
  action: (
    formData: FormData
  ) => Promise<{ success: true; email: string } | { success: false; error: string }>;
}) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const nextParam = searchParams.get("next");
  const checkEmailParam = searchParams.get("checkEmail");
  const emailQueryParam = searchParams.get("email");
  const presetCheckEmail = (checkEmailParam ?? emailQueryParam ?? "").trim();
  const shouldOpenFromQuery = checkEmailParam !== null || Boolean(emailQueryParam?.trim());
  const oauthCallbackUrl = buildOAuthCallbackUrl(nextParam);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple">("card");
  const [checkEmailOpen, setCheckEmailOpen] = useState(shouldOpenFromQuery);
  const [checkEmailAddress, setCheckEmailAddress] = useState(presetCheckEmail);

  useEffect(() => {
    if (errorParam) {
      setFieldErrors(mapServerError(errorParam));
    }
  }, [errorParam]);

  useEffect(() => {
    if (shouldOpenFromQuery) {
      setCheckEmailAddress(presetCheckEmail);
      setCheckEmailOpen(true);
    }
  }, [shouldOpenFromQuery, presetCheckEmail]);

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
        return;
      }
      setCheckEmailAddress(result.email);
      setCheckEmailOpen(true);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setFieldErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-mobile-panel auth-register-panel flex w-full flex-col">
      <h1 className="auth-login-title m-0 text-black" style={authHeadingStyle}>
        SIGN IN
      </h1>
      <div className="auth-register-title-gap h-[12px] shrink-0" aria-hidden />
      <p className="auth-register-subtitle m-0 h-[29px] w-[598px] max-w-full text-black" style={authText24}>
        Learn from the best and showcase your creative work.
      </p>
      <div className="auth-register-fields-gap h-[33px] shrink-0" aria-hidden />

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
        <div className="auth-login-password-gap h-[18px] shrink-0" aria-hidden />

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
        <div className="auth-login-password-gap h-[18px] shrink-0" aria-hidden />

        <AuthPasswordField
          showPassword={showPassword}
          onShowPassword={() => setShowPassword(true)}
          onHidePassword={() => setShowPassword(false)}
          autoComplete="new-password"
          error={fieldErrors.password}
          errorId="register-password-error"
          onValueChange={() => clearFieldError("password")}
        />
        <div className="auth-register-payment">
          <div className="auth-register-payment-label-gap shrink-0" aria-hidden />
          <p className="auth-register-payment-label m-0 text-black">Payment Method</p>
          <div className="auth-register-payment-tabs-gap shrink-0" aria-hidden />
          <div className="auth-register-payment-tabs" role="tablist" aria-label="Payment method">
            <button
              type="button"
              role="tab"
              aria-selected={paymentMethod === "card"}
              className={`auth-register-pay-tab auth-register-pay-tab-card${
                paymentMethod === "card" ? " is-selected" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={25}
                height={19}
                viewBox="0 0 27 21"
                fill="none"
                aria-hidden
                className="auth-register-pay-icon shrink-0"
              >
                <path
                  d="M0.650391 7.77539H25.6504M2.92312 0.650391H23.3777C24.6329 0.650391 25.6504 1.71371 25.6504 3.02539V17.2754C25.6504 18.5871 24.6329 19.6504 23.3777 19.6504H2.92312C1.66793 19.6504 0.650391 18.5871 0.650391 17.2754V3.02539C0.650391 1.71371 1.66793 0.650391 2.92312 0.650391Z"
                  stroke="black"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Credit card
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={paymentMethod === "apple"}
              className={`auth-register-pay-tab auth-register-pay-tab-apple${
                paymentMethod === "apple" ? " is-selected" : ""
              }`}
              onClick={() => setPaymentMethod("apple")}
            >
              <img
                src="/auth/apple-pay.png"
                alt=""
                width={27}
                height={30}
                className="auth-register-pay-icon shrink-0"
              />
              Apple pay
            </button>
          </div>
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
          <div className="auth-register-payment-fields-gap shrink-0" aria-hidden />
          <AuthTextField
            id="card-name"
            name="cardName"
            placeholder="Name"
            autoComplete="cc-name"
          />
          <div className="auth-login-password-gap h-[18px] shrink-0" aria-hidden />
          <AuthTextField
            id="card-number"
            name="cardNumber"
            placeholder="Cards number"
            autoComplete="cc-number"
            inputMode="numeric"
          />
          <div className="auth-login-password-gap h-[18px] shrink-0" aria-hidden />
          <div className="auth-register-card-row">
            <AuthTextField
              id="card-expiry"
              name="cardExpiry"
              placeholder="Expiry date"
              autoComplete="cc-exp"
              className="auth-field-half"
            />
            <AuthTextField
              id="card-cvv"
              name="cardCvv"
              placeholder="CVV"
              autoComplete="cc-csc"
              inputMode="numeric"
              className="auth-field-half"
            />
          </div>
        </div>
        <div className="auth-login-forgot-gap h-[35px] shrink-0" aria-hidden />

        <div className="auth-login-centered flex flex-col">
        <p className="auth-register-terms m-0 h-[65px] w-[549px] max-w-full text-black" style={authText24}>
          By signing up, you agree to our{" "}
          <Link href="/" className="auth-login-join-link text-black underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/" className="auth-login-join-link text-black underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="auth-login-submit-gap h-[32px] shrink-0" aria-hidden />

        <button
          type="submit"
          disabled={loading}
          className="auth-login-submit mx-auto flex items-center justify-center border border-black bg-white disabled:cursor-not-allowed disabled:opacity-50"
          style={authSubmitButtonStyle}
        >
          {loading ? "Creating account..." : "GET STARTED"}
        </button>

      <AuthOAuthSection
        onOAuthSignIn={(providerId) => signIn(providerId, { callbackUrl: oauthCallbackUrl })}
      />

      <div className="auth-login-resend-gap h-[40px] shrink-0" aria-hidden />

      <p className="auth-login-join m-0 text-center text-black" style={authText24}>
        Already have an account?{" "}
        <Link href="/login" className="auth-login-join-link text-black underline">
          Log in
        </Link>
      </p>
        </div>
      </form>

      <CheckEmailModal
        open={checkEmailOpen}
        email={checkEmailAddress}
        onClose={() => setCheckEmailOpen(false)}
      />
    </div>
  );
}
