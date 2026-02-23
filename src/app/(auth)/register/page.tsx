import { redirect } from "next/navigation";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { registerUser, RegisterInput } from "@/server/auth/auth.service";
import { AppError } from "@/server/lib/errors";
import RegisterForm from "./RegisterForm";

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
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    const raw = {
      email: String(formData.get("email") ?? "").trim(),
      password,
      name: (formData.get("name") as string)?.trim() || undefined,
      country: (formData.get("country") as string)?.trim() || undefined,
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
    redirect("/login?registered=1&toast=Account+created");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <Link
              href="/"
              className="text-xl font-semibold text-blue-600 hover:text-blue-700"
            >
              Alwerash
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Create account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your details to get started
            </p>
          </div>
          <RegisterForm action={action} />
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
