import crypto from "crypto";

/**
 * Emailed one-time tokens are stored as SHA-256 hashes. The raw value lives only
 * in the link, so a database leak does not hand out working verification or
 * password-reset links. A plain hash is enough: the input is 256 random bits,
 * which cannot be brute-forced.
 */
export function hashOneTimeToken(raw: string): string {
  return crypto.createHash("sha256").update(raw.trim()).digest("hex");
}

export function generateOneTimeToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString("hex");
  return { raw, hash: hashOneTimeToken(raw) };
}

/** Identifier prefix that keeps reset tokens from being accepted as verification tokens. */
export const PASSWORD_RESET_IDENTIFIER_PREFIX = "password-reset:";
