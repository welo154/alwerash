// file: src/server/video/mux.ts
import Mux from "@mux/mux-node";

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const mux = new Mux({
  tokenId: must("MUX_TOKEN_ID"),
  tokenSecret: must("MUX_TOKEN_SECRET"),
  jwtSigningKey: must("MUX_SIGNING_KEY_ID"),
  jwtPrivateKey: must("MUX_PRIVATE_KEY"),
});

export function playbackUrl(playbackId: string, token: string) {
  return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
}

export function playbackTTL(): string {
  return process.env.MUX_PLAYBACK_TOKEN_TTL ?? "2h";
}

export function uploadCorsOrigin(): string {
  return process.env.MUX_UPLOAD_CORS_ORIGIN ?? "http://localhost:3000";
}
