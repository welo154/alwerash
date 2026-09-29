// file: src/server/video/mux.ts
import Mux from "@mux/mux-node";

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

let _mux: Mux | null = null;

/** Lazy-init Mux client so build can succeed without Mux env vars. Throws when used if vars are missing. */
export function getMux(): Mux {
  if (!_mux) {
    _mux = new Mux({
      tokenId: must("MUX_TOKEN_ID"),
      tokenSecret: must("MUX_TOKEN_SECRET"),
      jwtSigningKey: must("MUX_SIGNING_KEY_ID"),
      jwtPrivateKey: must("MUX_PRIVATE_KEY"),
    });
  }
  return _mux;
}

/** @deprecated Use getMux() so build does not require Mux env. Kept for compatibility. */
export const mux = new Proxy({} as Mux, {
  get(_, prop) {
    return (getMux() as unknown as Record<string, unknown>)[prop as string];
  },
});

export function playbackUrl(playbackId: string, token: string) {
  return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
}

/**
 * Default signed-playback token lifetime, in seconds.
 *
 * Mux validates only the signature, expiry, audience, and playback id — it cannot
 * check who is asking. A short lifetime is therefore the main control limiting how
 * long a copied URL keeps working. The player rolls the token during playback, so
 * this does not need to cover a whole lesson.
 */
const DEFAULT_PLAYBACK_TTL_SECONDS = 30 * 60;
const MIN_PLAYBACK_TTL_SECONDS = 60;
const MAX_PLAYBACK_TTL_SECONDS = 12 * 60 * 60;

/** Parse a Mux-style duration string ("90s", "15m", "2h", "1d") into seconds. */
function parseDurationSeconds(raw: string): number | null {
  const m = raw.trim().match(/^(\d+)\s*([smhd])?$/i);
  if (!m) return null;
  const value = Number(m[1]);
  if (!Number.isFinite(value) || value <= 0) return null;
  const unit = (m[2] ?? "s").toLowerCase();
  const multiplier = unit === "d" ? 86400 : unit === "h" ? 3600 : unit === "m" ? 60 : 1;
  return value * multiplier;
}

/**
 * Resolved token lifetime in seconds, clamped to a sane range so a misconfigured
 * env var cannot mint effectively permanent URLs.
 *
 * Prefers MUX_SIGNED_PLAYBACK_TTL_SECONDS, then MUX_PLAYBACK_TOKEN_TTL.
 */
export function playbackTTLSeconds(): number {
  const secondsRaw = process.env.MUX_SIGNED_PLAYBACK_TTL_SECONDS?.trim();
  const durationRaw = process.env.MUX_PLAYBACK_TOKEN_TTL?.trim();

  let seconds: number | null = null;
  if (secondsRaw && /^\d+$/.test(secondsRaw)) {
    seconds = Number(secondsRaw);
  } else if (durationRaw) {
    seconds = parseDurationSeconds(durationRaw);
  }
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) {
    seconds = DEFAULT_PLAYBACK_TTL_SECONDS;
  }

  return Math.min(Math.max(Math.floor(seconds), MIN_PLAYBACK_TTL_SECONDS), MAX_PLAYBACK_TTL_SECONDS);
}

/** Mux JWT expiration as a duration string. */
export function playbackTTL(): string {
  return `${playbackTTLSeconds()}s`;
}

export function uploadCorsOrigin(): string {
  return process.env.MUX_UPLOAD_CORS_ORIGIN ?? "http://localhost:3000";
}
