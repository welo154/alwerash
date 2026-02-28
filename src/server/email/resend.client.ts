import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Alwerash <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export function isEmailConfigured(): boolean {
  return Boolean(apiKey);
}

/**
 * Send the verification email with a link. No-op if RESEND_API_KEY is not set.
 */
export async function sendVerificationEmail(
  to: string,
  verifyUrl: string
): Promise<{ success: true } | { success: false; error: string }> {
  if (!resend) {
    console.warn("[Resend] RESEND_API_KEY not set; skipping verification email");
    return { success: false, error: "Email not configured" };
  }

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: "Verify your email — Alwerash",
    html: [
      "<p>Thanks for signing up. Please verify your email by clicking the link below.</p>",
      "<p><a href=\"" + verifyUrl + "\" style=\"display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;\">Verify email</a></p>",
      "<p>Or copy this link: <a href=\"" + verifyUrl + "\">" + verifyUrl + "</a></p>",
      "<p>This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>",
    ].join("\n"),
  });

  if (error) {
    console.error("[Resend] Failed to send verification email:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
