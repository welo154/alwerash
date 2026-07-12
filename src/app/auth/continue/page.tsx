import { redirect } from "next/navigation";
import { auth } from "@/auth";

function withToast(path: string): string {
  return path.includes("?") ? `${path}&toast=Signed+in` : `${path}?toast=Signed+in`;
}

export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { next } = await searchParams;
  if (next?.startsWith("/")) {
    redirect(withToast(next));
  }

  const roles = (session.user as { roles?: string[] }).roles ?? [];
  if (roles.includes("ADMIN")) {
    redirect(withToast("/admin/content/tracks"));
  }
  if (roles.includes("MENTOR")) {
    redirect(withToast("/mentor"));
  }
  if (roles.includes("INSTRUCTOR")) {
    redirect(withToast("/instructor"));
  }

  redirect(withToast("/home"));
}
