import { cookies } from "next/headers";
import { safeInternalPath } from "@/lib/safe-internal-path";

const COOKIE = "alwerash_post_auth_next";
const MAX_AGE_SECONDS = 60 * 60 * 24;

/**
 * Remember where a guest should land after they verify email and sign in.
 * The register URL already carries `next`; this covers the email link, which cannot.
 */
export async function rememberPostAuthNext(path: string): Promise<void> {
  const safe = safeInternalPath(path);
  if (!safe) return;
  const jar = await cookies();
  jar.set(COOKIE, safe, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readPostAuthNext(): Promise<string | null> {
  const jar = await cookies();
  return safeInternalPath(jar.get(COOKIE)?.value);
}

export async function clearPostAuthNext(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
