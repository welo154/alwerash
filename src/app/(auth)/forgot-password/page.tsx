import { z } from "zod";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ForgotPasswordPanel } from "@/components/auth/AuthPasswordResetPanels";
import { requestPasswordReset } from "@/server/auth/password-reset.service";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";

const EmailSchema = z.string().email().transform((v) => v.toLowerCase().trim());

export default function ForgotPasswordPage() {
  async function action(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
    "use server";
    const parsed = EmailSchema.safeParse(String(formData.get("email") ?? "").trim());
    if (!parsed.success) return { ok: false, error: "Please enter a valid email address" };

    const { ip } = await readRequestContext();
    const [perAddress, perIp] = await Promise.all([
      consumeRateLimit(RATE_LIMITS.emailPerAddress, parsed.data),
      consumeRateLimit(RATE_LIMITS.emailPerIp, ip),
    ]);
    if (!perAddress.allowed || !perIp.allowed) return { ok: false, error: RATE_LIMITED_MESSAGE };

    try {
      await requestPasswordReset(parsed.data);
    } catch (error) {
      console.error("[forgot-password] failed", error);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
    return { ok: true };
  }

  return <AuthPageShell mobileLayout="login" panel={<ForgotPasswordPanel action={action} />} />;
}
