import { AuthPageShell } from "@/components/auth/AuthPageShell";
import {
  ResetLinkProblemPanel,
  ResetPasswordPanel,
} from "@/components/auth/AuthPasswordResetPanels";
import { PasswordSchema } from "@/server/auth/auth.service";
import { checkPasswordResetToken, resetPassword } from "@/server/auth/password-reset.service";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const state = await checkPasswordResetToken(token);

  async function action(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
    "use server";
    const { ip } = await readRequestContext();
    const limited = await consumeRateLimit(RATE_LIMITS.passwordResetPerIp, ip);
    if (!limited.allowed) return { ok: false, error: RATE_LIMITED_MESSAGE };

    const parsed = PasswordSchema.safeParse(String(formData.get("password") ?? ""));
    if (!parsed.success) {
      return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid password" };
    }

    const result = await resetPassword(String(formData.get("token") ?? ""), parsed.data);
    if (!result.ok) {
      return {
        ok: false,
        error:
          result.reason === "expired"
            ? "This reset link has expired. Request a new one."
            : "This reset link is invalid or has already been used.",
      };
    }
    return { ok: true };
  }

  return (
    <AuthPageShell
      mobileLayout="login"
      panel={
        state === "valid" ? (
          <ResetPasswordPanel token={token} action={action} />
        ) : (
          <ResetLinkProblemPanel expired={state === "expired"} />
        )
      }
    />
  );
}
