// file: src/app/(auth)/login/page.tsx
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
