// file: src/app/(auth)/register/page.tsx
import { redirect } from "next/navigation";
import { registerUser, RegisterInput } from "@backend/auth/auth.service";

export default function RegisterPage() {
  async function action(formData: FormData) {
    "use server";
    const raw = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      name: String(formData.get("name") ?? "") || undefined,
      country: String(formData.get("country") ?? "") || undefined,
    };

    const parsed = RegisterInput.safeParse(raw);
    if (!parsed.success) {
      redirect("/register?error=invalid");
    }

    await registerUser(parsed.data);
    redirect("/login?registered=1");
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Register</h1>
      <form action={action} className="mt-6 space-y-3">
        <input name="name" placeholder="name" className="w-full rounded border p-2" />
        <input
          name="email"
          type="email"
          placeholder="email"
          className="w-full rounded border p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="password (min 10, upper/lower/number)"
          className="w-full rounded border p-2"
          required
        />
        <input
          name="country"
          placeholder="country (EG, SA, AE...)"
          className="w-full rounded border p-2"
        />
        <button className="w-full rounded bg-black p-2 text-white">
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm">
        Have an account? <a className="underline" href="/login">Login</a>
      </p>
    </div>
  );
}
