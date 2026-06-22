"use client";

import { LoggedInAppHeader } from "./LoggedInAppHeader";

/** Guest marketing pages — same green app shell as signed-in users, with Log in / Sign up. */
export function GuestSiteHeader() {
  return <LoggedInAppHeader />;
}
