import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Alwerash <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export function isEmailConfigured(): boolean {
  return Boolean(apiKey);
}

export function getAppBaseUrl(): string {
  const raw =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

async function sendHtmlEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: true } | { success: false; error: string }> {
  if (!resend) {
    console.warn("[Resend] RESEND_API_KEY not set; skipping email:", subject);
    return { success: false, error: "Email not configured" };
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("[Resend] Failed to send email:", subject, error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Send the verification email with a link. No-op if RESEND_API_KEY is not set.
 */
export async function sendVerificationEmail(
  to: string,
  verifyUrl: string
): Promise<{ success: true } | { success: false; error: string }> {
  return sendHtmlEmail(
    to,
    "Verify your email — Alwerash",
    [
      "<p>Thanks for signing up. Please verify your email by clicking the link below.</p>",
      `<p><a href="${verifyUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Verify email</a></p>`,
      `<p>Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
      "<p>This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>",
    ].join("\n")
  );
}

export async function sendMentorCapstoneSubmittedEmail(input: {
  to: string;
  learnerName: string;
  courseTitle: string;
  assignmentTitle: string;
  reviewUrl: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const learner = input.learnerName.trim() || "A learner";
  return sendHtmlEmail(
    input.to,
    `Capstone submitted — ${input.courseTitle}`,
    [
      `<p><strong>${learner}</strong> submitted the final assignment for <strong>${input.courseTitle}</strong>.</p>`,
      `<p>Assignment: ${input.assignmentTitle}</p>`,
      `<p><a href="${input.reviewUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Open submission to rate &amp; comment</a></p>`,
      `<p>Or copy this link: <a href="${input.reviewUrl}">${input.reviewUrl}</a></p>`,
    ].join("\n")
  );
}

export async function sendLearnerCapstoneReviewedEmail(input: {
  to: string;
  courseTitle: string;
  assignmentTitle: string;
  feedback: string;
  grade: number | null;
  feedbackUrl: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const gradeLine =
    input.grade != null
      ? `<p><strong>Grade:</strong> ${input.grade}/100</p>`
      : "<p><strong>Grade:</strong> Not scored</p>";
  const safeFeedback = input.feedback
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return sendHtmlEmail(
    input.to,
    `Your capstone was reviewed — ${input.courseTitle}`,
    [
      `<p>Your mentor reviewed <strong>${input.assignmentTitle}</strong> for <strong>${input.courseTitle}</strong>.</p>`,
      gradeLine,
      `<p><strong>Comment:</strong></p><p>${safeFeedback}</p>`,
      `<p><a href="${input.feedbackUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">View grade &amp; comment</a></p>`,
      `<p>Or copy this link: <a href="${input.feedbackUrl}">${input.feedbackUrl}</a></p>`,
    ].join("\n")
  );
}
