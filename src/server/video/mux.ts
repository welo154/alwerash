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
 * Mux JWT expiration. Prefers MUX_SIGNED_PLAYBACK_TTL_SECONDS (e.g. 3600),
 * else MUX_PLAYBACK_TOKEN_TTL (Mux duration string, default 1h).
 */
export function playbackTTL(): string {
  const secondsRaw = process.env.MUX_SIGNED_PLAYBACK_TTL_SECONDS?.trim();
  if (secondsRaw && /^\d+$/.test(secondsRaw)) {
    const seconds = Number(secondsRaw);
    if (seconds > 0) return `${seconds}s`;
  }
  return process.env.MUX_PLAYBACK_TOKEN_TTL ?? "1h";
}

export function uploadCorsOrigin(): string {
  return process.env.MUX_UPLOAD_CORS_ORIGIN ?? "http://localhost:3000";
}
