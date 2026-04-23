"use client";

import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Pass `session` from the server (`await auth()`) so the client does not need an
 * immediate `fetch("/api/auth/session")` on mount — that call often surfaces as
 * CLIENT_FETCH_ERROR / "Failed to fetch" when the origin is wrong or the dev server
 * is briefly unreachable; the server already has the cookie.
 */
export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  /** From `await auth()` in the root layout; use `null` when logged out (not `undefined`). */
  session: Session | null;
}) {
  return (
    <NextAuthSessionProvider
      session={session}
      /** Avoid background `/api/auth/session` calls that throw CLIENT_FETCH_ERROR when dev HMR/restart or focus races occur. */
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
