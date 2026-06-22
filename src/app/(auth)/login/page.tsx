import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthLoginPanel } from "@/components/auth/AuthLoginPanel";

export default function LoginPage() {
  return (
    <AuthPageShell
      panel={
        <Suspense fallback={null}>
          <AuthLoginPanel />
        </Suspense>
      }
    />
  );
}
