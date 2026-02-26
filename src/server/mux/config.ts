/**
 * Mux env config. Used for API (upload/create) and optional signed playback.
 * Read lazily so process.env is read at request time (after Next.js has loaded .env).
 */
function getMuxConfig() {
  const tokenId = process.env.MUX_TOKEN_ID?.trim() ?? "";
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim() ?? "";
  const webhookSecret = process.env.MUX_WEBHOOK_SECRET;
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  const privateKey = process.env.MUX_PRIVATE_KEY;
  const playbackTokenTtl = process.env.MUX_PLAYBACK_TOKEN_TTL ?? "2h";
  const uploadCorsOrigin = process.env.MUX_UPLOAD_CORS_ORIGIN ?? "http://localhost:3001";

  return {
    tokenId: tokenId || undefined,
    tokenSecret: tokenSecret || undefined,
    webhookSecret: webhookSecret && webhookSecret !== "..." ? webhookSecret : null,
    signingKeyId: signingKeyId && signingKeyId !== "..." ? signingKeyId : null,
    privateKey: privateKey && privateKey !== "..." ? privateKey : null,
    playbackTokenTtl,
    uploadCorsOrigin,
  };
}

export function getMuxConfigFresh() {
  return getMuxConfig();
}

export const muxConfig = getMuxConfig();

export function isMuxApiConfigured(): boolean {
  const c = getMuxConfig();
  return Boolean(c.tokenId && c.tokenSecret);
}

/** Returns which Mux API env vars are missing (for error messages). */
export function getMissingMuxApiVars(): string[] {
  const c = getMuxConfig();
  const missing: string[] = [];
  if (!c.tokenId) missing.push("MUX_TOKEN_ID");
  if (!c.tokenSecret) missing.push("MUX_TOKEN_SECRET");
  return missing;
}

export function isMuxWebhookConfigured(): boolean {
  return Boolean(getMuxConfig().webhookSecret);
}

export function isSignedPlaybackConfigured(): boolean {
  const c = getMuxConfig();
  return Boolean(c.signingKeyId && c.privateKey);
}
