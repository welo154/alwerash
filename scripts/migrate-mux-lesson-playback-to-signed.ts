/**
 * Convert existing lesson Mux assets from public playback to signed.
 *
 * New uploads already use signed policy. This script is required for videos
 * created before that change. Course intro videos are left public (thumbnails).
 *
 * Requires: DATABASE_URL, MUX_TOKEN_ID, MUX_TOKEN_SECRET
 *
 *   npx tsx scripts/migrate-mux-lesson-playback-to-signed.ts
 *
 * Mux API: create a signed playback ID on the asset, store it on LessonVideo,
 * then delete the public playback ID so the old .m3u8 URL stops working.
 *
 * Manual dashboard fallback (if the API call fails):
 * 1. Mux Dashboard → the asset → Playback IDs → Add playback ID → Signed
 * 2. Copy the new signed ID into lesson_video.mux_playback_id
 * 3. Delete the Public playback ID on that asset
 */
import "dotenv/config";
import Mux from "@mux/mux-node";
import { prisma } from "../src/server/db/prisma";

type PlaybackId = { id?: string; policy?: string };

async function main() {
  const tokenId = process.env.MUX_TOKEN_ID?.trim();
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim();
  if (!tokenId || !tokenSecret) {
    throw new Error("Set MUX_TOKEN_ID and MUX_TOKEN_SECRET");
  }

  const mux = new Mux({ tokenId, tokenSecret });
  const rows = await prisma.lessonVideo.findMany({
    select: { lessonId: true, muxAssetId: true, muxPlaybackId: true },
  });

  console.log(`Found ${rows.length} lesson video(s).`);

  for (const row of rows) {
    const asset = await mux.video.assets.retrieve(row.muxAssetId);
    const ids = (asset.playback_ids ?? []) as PlaybackId[];
    const signed = ids.find((p) => p.policy === "signed" && p.id);
    const publicIds = ids.filter((p) => p.policy === "public" && p.id);

    let signedId = signed?.id ?? null;
    if (!signedId) {
      const created = (await mux.video.assets.createPlaybackId(row.muxAssetId, {
        policy: "signed",
      })) as PlaybackId;
      signedId = created.id ?? null;
      if (!signedId) {
        console.error(`No signed playback ID created for asset ${row.muxAssetId} (lesson ${row.lessonId})`);
        continue;
      }
      console.log(`Created signed playback ID for lesson ${row.lessonId}`);
    }

    if (signedId !== row.muxPlaybackId) {
      await prisma.lessonVideo.update({
        where: { lessonId: row.lessonId },
        data: { muxPlaybackId: signedId },
      });
      console.log(`Updated lesson ${row.lessonId} playback ID in the database`);
    }

    for (const pub of publicIds) {
      if (!pub.id) continue;
      await mux.video.assets.deletePlaybackId(row.muxAssetId, pub.id);
      console.log(`Deleted public playback ID ${pub.id} on asset ${row.muxAssetId}`);
    }
  }

  console.log("Done. Existing public lesson stream URLs should no longer play.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
