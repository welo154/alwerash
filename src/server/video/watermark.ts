/**
 * Pseudonymous viewer markers for video watermarking.
 *
 * The marker must be traceable back to an account by staff, but must not expose
 * personal data to the browser. A leaked screen recording shows only an opaque
 * code; resolving it to a user requires the server secret and a database lookup.
 *
 * Never put an email address, real name, or raw user id in a watermark.
 */
import crypto from "crypto";

const MARKER_LENGTH = 10;
/** Crockford-style alphabet: no I, L, O, U, so codes are unambiguous when read off a screenshot. */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function watermarkSecret(): string {
  const secret =
    process.env.WATERMARK_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing WATERMARK_SECRET / AUTH_SECRET for watermark derivation");
  }
  return secret;
}

function encode(buffer: Buffer, length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[buffer[i % buffer.length] % ALPHABET.length];
  }
  return out;
}

/**
 * Stable, non-reversible marker for a user. Same user always yields the same
 * code, so repeat leaks are attributable, but the code reveals nothing.
 *
 * Format: XXXXX-XXXXX
 */
export function viewerWatermarkMarker(userId: string): string {
  const digest = crypto
    .createHmac("sha256", watermarkSecret())
    .update(`watermark:v1:${userId}`)
    .digest();
  const code = encode(digest, MARKER_LENGTH);
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}

/**
 * Resolve a marker seen in a leaked recording back to a user id.
 * Staff/CLI use only: never expose this over HTTP.
 */
export function matchesWatermarkMarker(userId: string, marker: string): boolean {
  const expected = viewerWatermarkMarker(userId);
  const a = Buffer.from(expected.toUpperCase());
  const b = Buffer.from(marker.trim().toUpperCase());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
