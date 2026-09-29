import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthRegisterPanel } from "@/components/auth/AuthRegisterPanel";
import { registerUser, RegisterInput } from "@/server/auth/auth.service";
import { AppError } from "@/server/lib/errors";

/** Only AppError messages are written for users; anything else may expose internals. */
function getErrorMessage(e: unknown): string {
  if (e instanceof AppError) return e.message;
  console.error("[register] failed", e);
  return "Registration failed. Please try again.";
}

export default function RegisterPage() {
  async function action(
    formData: FormData
  ): Promise<{ success: true; email: string } | { success: false; error: string }> {
    "use server";
    const raw = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      name: String(formData.get("name") ?? "").trim(),
    };

    const parsed = RegisterInput.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      const message = first?.message ?? "Invalid input";
      return { success: false, error: message };
    }

    try {
      await registerUser(parsed.data);
    } catch (e) {
      return { success: false, error: getErrorMessage(e) };
    }
    return { success: true, email: parsed.data.email };
  }

  return (
    <AuthPageShell
      mobileLayout="register"
      panel={
        <Suspense fallback={null}>
          <AuthRegisterPanel action={action} />
        </Suspense>
      }
    />
  );
}
