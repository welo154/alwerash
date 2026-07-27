/**
 * One-off Resend connectivity test. Does not print secrets.
 * Usage: npx tsx scripts/test-resend.ts [optional-to-email]
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { Resend } from "resend";

function loadEnvFile(path: string) {
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env"));

const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "Alwerash <onboarding@resend.dev>";
const authUrl = (process.env.AUTH_URL || process.env.NEXTAUTH_URL || "").trim();

console.log("--- Resend config check ---");
console.log("RESEND_API_KEY set:", Boolean(apiKey));
console.log("RESEND_API_KEY prefix:", apiKey ? `${apiKey.slice(0, 6)}… (len ${apiKey.length})` : "(missing)");
console.log("RESEND_FROM_EMAIL:", fromEmail);
console.log("AUTH_URL/NEXTAUTH_URL:", authUrl || "(missing — email deep links may be wrong)");

if (!apiKey) {
  console.error("FAIL: RESEND_API_KEY is not set in .env");
  process.exit(1);
}

const toArg = process.argv[2]?.trim();
const fromMatch = fromEmail.match(/<([^>]+)>/) || fromEmail.match(/([^\s]+@[^\s]+)/);
const defaultTo = fromMatch?.[1] ?? "";
const to = toArg || defaultTo;

if (!to || !to.includes("@")) {
  console.error("FAIL: Pass a recipient email: npx tsx scripts/test-resend.ts you@example.com");
  process.exit(1);
}

console.log("Sending test email to:", to);

const resend = new Resend(apiKey);

async function main() {
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: "Alwerash Resend test",
    html: "<p>This is a connectivity test from Alwerash. If you see this, Resend can send.</p>",
  });

  if (error) {
    console.error("FAIL: Resend API error");
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log("OK: email accepted by Resend");
  console.log("id:", data?.id ?? "(none)");

  // Also exercise app helpers (same API path as capstone emails).
  const { sendMentorCapstoneSubmittedEmail, sendLearnerCapstoneReviewedEmail, getAppBaseUrl } =
    await import("../src/server/email/resend.client");

  const base = getAppBaseUrl();
  console.log("--- Capstone helper smoke tests ---");
  console.log("getAppBaseUrl():", base);

  const mentorResult = await sendMentorCapstoneSubmittedEmail({
    to,
    learnerName: "Test Learner",
    courseTitle: "Debug Course",
    assignmentTitle: "Final Capstone",
    reviewUrl: `${base}/mentor/submissions/test-id`,
  });
  console.log("mentor notify:", mentorResult);

  const learnerResult = await sendLearnerCapstoneReviewedEmail({
    to,
    courseTitle: "Debug Course",
    assignmentTitle: "Final Capstone",
    feedback: "Great work — this is a test comment.",
    grade: 92,
    feedbackUrl: `${base}/learn/test-course#final-assignment`,
  });
  console.log("learner notify:", learnerResult);

  if (!mentorResult.success || !learnerResult.success) {
    process.exit(1);
  }
  console.log("OK: capstone email helpers also succeeded");
}

main().catch((err) => {
  console.error("FAIL: unexpected error", err);
  process.exit(1);
});
