/** Prefer a signed Mux playback ID when an asset has both public and signed IDs. */
export function pickMuxPlaybackId(
  playbackIds?: Array<{ id?: string | null; policy?: string | null }> | null
): string | null {
  if (!playbackIds?.length) return null;
  const signed = playbackIds.find((p) => p.policy === "signed" && p.id);
  if (signed?.id) return signed.id;
  return playbackIds.find((p) => p.id)?.id ?? null;
}
