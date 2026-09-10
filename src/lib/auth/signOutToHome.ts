"use client";

import { signOut } from "next-auth/react";

/** Full-page leave after sign-out so the protected page is not rebuilt with a null session. */
export async function signOutToHome() {
  await signOut({ redirect: false });
  window.location.assign("/?toast=Signed+out");
}
