import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthRegisterPanel } from "@/components/auth/AuthRegisterPanel";
import { registerUser, RegisterInput } from "@/server/auth/auth.service";
import { AppError } from "@/server/lib/errors";

function getErrorMessage(e: unknown): string {
  if (e instanceof AppError) return e.message;
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message;
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return "This email is already registered.";
  }
  return "Registration failed. Please try again.";
}

export default function RegisterPage() {
  async function action(formData: FormData): Promise<{ success: true } | { success: false; error: string }> {
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
    redirect(`/register/check-email?email=${encodeURIComponent(parsed.data.email)}`);
  }

  return (
    <AuthPageShell
      panel={
        <Suspense fallback={null}>
          <AuthRegisterPanel action={action} />
        </Suspense>
      }
    />
  );
}
