/** Same-origin path only. Rejects protocol-relative URLs and backslash tricks. */
export function safeInternalPath(value: string | null | undefined): string | null {
  if (!value) return null;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\") || decoded.includes("\0")) {
    return null;
  }
  return decoded;
}

/** Attach a safe in-app `next` path. Drops anything that is not a local path. */
export function withNext(path: string, nextPath: string | null | undefined): string {
  const next = safeInternalPath(nextPath);
  if (!next) return path;
  const url = new URL(path, "http://local");
  url.searchParams.set("next", next);
  return `${url.pathname}${url.search}`;
}
