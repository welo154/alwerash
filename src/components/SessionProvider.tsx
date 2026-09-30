"use client";

import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Do not pass a server session from the root layout — that would force the layout
 * dynamic and re-run auth (previously with DB) on every client navigation.
 * Refetch every five minutes so the cookie picks up a role change. Server pages
 * already re-read roles on each request; middleware only sees the cookie.
 */
export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
