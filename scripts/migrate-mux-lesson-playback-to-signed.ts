/**
 * Convert existing lesson Mux assets from public playback to signed.
 *
 * New uploads already use signed policy. This script is required for videos
 * created before that change. Course intro videos are left public (thumbnails).
 *
 * Requires: DATABASE_URL, MUX_TOKEN_ID, MUX_TOKEN_SECRET
 *
 *   npx tsx scripts/migrate-mux-lesson-playback-to-signed.ts --dry-run
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
  const dryRun = process.argv.includes("--dry-run");
  const tokenId = process.env.MUX_TOKEN_ID?.trim();
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim();
  if (!tokenId || !tokenSecret) {
    throw new Error("Set MUX_TOKEN_ID and MUX_TOKEN_SECRET");
  }

  const mux = new Mux({ tokenId, tokenSecret });
  const rows = await prisma.lessonVideo.findMany({
    select: { lessonId: true, muxAssetId: true, muxPlaybackId: true },
  });

  console.log(`${dryRun ? "[dry-run] " : ""}Found ${rows.length} lesson video(s).`);

  let alreadySigned = 0;
  let needsWork = 0;
  let updated = 0;
  let publicDeleted = 0;
  let errors = 0;

  for (const row of rows) {
    try {
      const asset = await mux.video.assets.retrieve(row.muxAssetId);
      const ids = (asset.playback_ids ?? []) as PlaybackId[];
      const signed = ids.find((p) => p.policy === "signed" && p.id);
      const publicIds = ids.filter((p) => p.policy === "public" && p.id);
      const dbIsSigned = Boolean(signed?.id && signed.id === row.muxPlaybackId);

      if (dbIsSigned && publicIds.length === 0) {
        alreadySigned += 1;
        continue;
      }

      needsWork += 1;
      console.log(
        `Lesson ${row.lessonId}: db=${dbIsSigned ? "signed" : "public/stale"}, publicIds=${publicIds.length}, hasSigned=${Boolean(signed?.id)}`
      );

      if (dryRun) continue;

      let signedId = signed?.id ?? null;
      if (!signedId) {
        const created = (await mux.video.assets.createPlaybackId(row.muxAssetId, {
          policy: "signed",
        })) as PlaybackId;
        signedId = created.id ?? null;
        if (!signedId) {
          console.error(`No signed playback ID created for asset ${row.muxAssetId} (lesson ${row.lessonId})`);
          errors += 1;
          continue;
        }
        console.log(`Created signed playback ID for lesson ${row.lessonId}`);
      }

      if (signedId !== row.muxPlaybackId) {
        await prisma.lessonVideo.update({
          where: { lessonId: row.lessonId },
          data: { muxPlaybackId: signedId },
        });
        updated += 1;
        console.log(`Updated lesson ${row.lessonId} playback ID in the database`);
      }

      for (const pub of publicIds) {
        if (!pub.id) continue;
        await mux.video.assets.deletePlaybackId(row.muxAssetId, pub.id);
        publicDeleted += 1;
        console.log(`Deleted public playback ID ${pub.id} on asset ${row.muxAssetId}`);
      }
    } catch (e) {
      errors += 1;
      console.error(`Failed lesson ${row.lessonId} / asset ${row.muxAssetId}:`, e);
    }
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Summary: total=${rows.length} alreadySigned=${alreadySigned} needsWork=${needsWork} updated=${updated} publicDeleted=${publicDeleted} errors=${errors}`
  );
  if (!dryRun) {
    console.log("Done. Existing public lesson stream URLs should no longer play.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
