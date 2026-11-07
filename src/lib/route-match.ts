/** `base` itself or anything below it, matched by whole path segments ("/mentor" is not "/mentors"). */
export function isUnder(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}
