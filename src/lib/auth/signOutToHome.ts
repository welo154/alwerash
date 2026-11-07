"use client";

import { signOut } from "next-auth/react";

/** Full-page leave after sign-out so the protected page is not rebuilt with a null session. */
export async function signOutToHome() {
  await signOut({ redirect: false });
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload is the point (see above)
  window.location.assign("/?toast=Signed+out");
}
