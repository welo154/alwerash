/**
 * Server-side device classification from the User-Agent header.
 *
 * Used to decide whether a sign-in occupies a student's MOBILE slot or their
 * COMPUTER slot. The User-Agent is client-controlled, so this is a usability
 * heuristic, not a security boundary: a determined user can present any string
 * they like. The security boundary is the per-kind session cap itself, which is
 * enforced server-side no matter what the header claims.
 *
 * Tablets count as MOBILE, so a phone plus an iPad cannot occupy both slots.
 */
import crypto from "crypto";

export type DeviceKindValue = "MOBILE" | "COMPUTER";

/** Phones, tablets, and e-readers. Checked before desktop hints. */
const MOBILE_PATTERNS = [
  /Android/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /Windows Phone/i,
  /Windows CE/i,
  /IEMobile/i,
  /BlackBerry/i,
  /BB10/i,
  /Opera Mini/i,
  /Opera Mobi/i,
  /Mobile Safari/i,
  /Silk/i,
  /Kindle/i,
  /Tablet/i,
  /PlayBook/i,
  /webOS/i,
  /Symbian/i,
  /KAIOS/i,
];

/** Desktop platform hints, checked only when nothing mobile matched. */
const DESKTOP_PATTERNS = [
  /Macintosh/i,
  /Mac OS X/i,
  /Windows NT/i,
  /Linux x86_64/i,
  /X11/i,
  /CrOS/i,
];

/**
 * Classify a User-Agent string.
 *
 * Defaults to COMPUTER when the header is missing or unrecognized. That is the
 * deliberate choice: mobile is the more commonly shared slot, and defaulting an
 * unknown client to MOBILE would let a scripted client squat it.
 */
export function classifyDeviceKind(userAgent: string | null | undefined): DeviceKindValue {
  const ua = userAgent?.trim();
  if (!ua) return "COMPUTER";

  // "Mobile" alone is too loose (it appears in some desktop strings), so require
  // it alongside a known mobile platform token.
  if (MOBILE_PATTERNS.some((p) => p.test(ua))) return "MOBILE";
  if (/\bMobile\b/.test(ua) && !DESKTOP_PATTERNS.some((p) => p.test(ua))) return "MOBILE";

  return "COMPUTER";
}

/**
 * Short, human-readable device label for the account's device list.
 * Best-effort only; never used for authorization.
 */
export function describeDevice(userAgent: string | null | undefined): string {
  const ua = userAgent?.trim();
  if (!ua) return "Unknown device";

  const browser =
    /Edg\//i.test(ua) ? "Edge"
    : /OPR\//i.test(ua) || /Opera/i.test(ua) ? "Opera"
    : /Firefox\//i.test(ua) ? "Firefox"
    : /Chrome\//i.test(ua) ? "Chrome"
    : /Safari\//i.test(ua) ? "Safari"
    : null;

  const platform =
    /iPhone/i.test(ua) ? "iPhone"
    : /iPad/i.test(ua) ? "iPad"
    : /Android/i.test(ua) ? "Android"
    : /Windows NT/i.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua) ? "macOS"
    : /CrOS/i.test(ua) ? "ChromeOS"
    : /Linux/i.test(ua) ? "Linux"
    : null;

  if (browser && platform) return `${browser} on ${platform}`;
  return browser ?? platform ?? "Unknown device";
}

/**
 * Hash a client address so an approximate location signal can be compared between
 * sign-ins without ever storing a raw IP address.
 */
export function hashClientIp(ip: string | null | undefined, secret: string): string | null {
  const value = ip?.trim();
  if (!value) return null;
  return crypto.createHmac("sha256", secret).update(`ip:v1:${value}`).digest("hex").slice(0, 32);
}

/** First address in an X-Forwarded-For chain, which is the client on Vercel. */
export function clientIpFromHeaders(forwardedFor: string | null, realIp: string | null): string | null {
  const first = forwardedFor?.split(",")[0]?.trim();
  return first || realIp?.trim() || null;
}
