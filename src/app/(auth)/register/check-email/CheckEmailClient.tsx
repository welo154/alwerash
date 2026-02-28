"use client";

import { useState } from "react";

export function CheckEmailClient(props: { email?: string }) {
  const email = props.email;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleResend() {
    if (!email?.trim()) return;
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.sent) {
        setStatus("sent");
        setMessage("Verification email sent. Check your inbox.");
      } else {
        setStatus("error");
        setMessage((data && data.message) ? data.message : "Could not send. Try again later.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (!email?.trim()) return null;

  const messageClass = status === "sent" ? "text-green-600" : "text-red-600";

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <p className="text-sm text-slate-600">Did not get the email?</p>
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending"}
        className="mt-2 text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Resend verification email"}
      </button>
      {message ? <p className={"mt-2 text-sm " + messageClass}>{message}</p> : null}
    </div>
  );
}
