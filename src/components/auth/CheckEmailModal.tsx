"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { AUTH_PANEL_GREEN, pangeaFont } from "./auth-theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTH_LOGO_IMAGE = "/auth/alwerash-logo.png";

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
};

export function CheckEmailModal({ open, email: initialEmail, onClose }: Props) {
  const titleId = useId();
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail(initialEmail);
      setStatus("idle");
      setMessage(null);
    }
  }, [open, initialEmail]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  async function handleResend() {
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Enter your email address first.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.sent) {
        setStatus("sent");
        setMessage("Verification email sent. Check your inbox.");
      } else {
        setStatus("error");
        setMessage(data?.message ? data.message : "Could not send. Try again later.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (!open) return null;

  const hasEmail = Boolean(email.trim());

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-[520px] animate-scale-in overflow-hidden rounded-[28px] border border-black bg-white"
        style={{ fontFamily: pangeaFont }}
      >
        <div
          className="h-3 w-full"
          style={{ background: AUTH_PANEL_GREEN }}
          aria-hidden
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white transition-opacity hover:opacity-70"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-black" strokeWidth={2} />
        </button>

        <div className="px-8 pb-9 pt-8 sm:px-10 sm:pb-10 sm:pt-9">
          <Image
            src={AUTH_LOGO_IMAGE}
            alt="alwerash."
            width={140}
            height={42}
            className="h-[42px] w-[140px] object-contain object-left"
            unoptimized
          />

          <h2
            id={titleId}
            className="m-0 mt-7 text-black"
            style={{
              fontSize: 40,
              fontWeight: 600,
              lineHeight: "115%",
            }}
          >
            Check your email
          </h2>

          <p
            className="m-0 mt-3 text-black"
            style={{
              fontSize: 20,
              fontWeight: 400,
              lineHeight: "130%",
              opacity: 0.7,
            }}
          >
            We sent a verification link to your inbox. Open it to verify your account, then sign in.
          </p>

          {hasEmail ? (
            <div
              className="mt-6 rounded-[8px] border border-black bg-white px-4 py-3"
              style={{ background: `${AUTH_PANEL_GREEN}33` }}
            >
              <p
                className="m-0 text-black"
                style={{ fontSize: 14, fontWeight: 400, opacity: 0.65, lineHeight: "120%" }}
              >
                Sent to
              </p>
              <p
                className="m-0 mt-1 break-all text-black"
                style={{ fontSize: 20, fontWeight: 600, lineHeight: "120%" }}
              >
                {email.trim()}
              </p>
            </div>
          ) : (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              autoComplete="email"
              className="mt-6 w-full rounded-[8px] border border-black bg-white px-4 py-3 text-[20px] text-black outline-none"
              style={{ fontFamily: pangeaFont }}
            />
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="flex h-[64px] w-full items-center justify-center rounded-[8px] border border-black bg-white text-center text-black transition-opacity hover:opacity-80"
              style={{
                fontSize: 24,
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              Continue to sign in
            </Link>

            <button
              type="button"
              onClick={handleResend}
              disabled={status === "sending"}
              className="mx-auto mt-1 border-none bg-transparent p-0 text-black underline underline-offset-4 disabled:opacity-50"
              style={{
                fontSize: 18,
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              {status === "sending" ? "Sending…" : "Resend verification email"}
            </button>
          </div>

          {message ? (
            <p
              className="m-0 mt-4 text-center"
              style={{
                fontSize: 16,
                lineHeight: "130%",
                color: status === "sent" ? "#166534" : "#b91c1c",
              }}
            >
              {message}
            </p>
          ) : (
            <p
              className="m-0 mt-4 text-center text-black"
              style={{ fontSize: 16, lineHeight: "130%", opacity: 0.55 }}
            >
              Didn&apos;t get it? Check spam, or resend the link.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
