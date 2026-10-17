# Mux service – HLS video playback

## What’s in place

- **Config** (`config.ts`): reads `MUX_*` env vars.
- **Lesson uploads** (`mux.service.ts` `createDirectUpload`): Mux direct upload with **signed** playback policy. Used by `POST /api/admin/lessons/[lessonId]/upload`.
- **Course intro uploads**: still **public** (catalog thumbnails via `image.mux.com`, not paid lesson content).
- **Signed playback** (`GET /api/video/playback/[lessonId]`): authz in the route handler, then a short-lived Mux JWT. Learner/admin players fetch this URL instead of building `stream.mux.com/{id}.m3u8`.

## Lesson flow

1. Admin uploads a VIDEO lesson → Mux creates a **signed** asset.
2. Webhook / sync stores `LessonVideo.muxAssetId` and `muxPlaybackId` (prefers a signed playback ID).
3. Player requests `/api/video/playback/{lessonId}`.
4. Server checks access (free first-module preview **or** subscriber/admin/instructor) and returns `playbackUrl` with `?token=`.
5. Token expires (`MUX_SIGNED_PLAYBACK_TTL_SECONDS` or `MUX_PLAYBACK_TOKEN_TTL`).

## Existing public assets

Changing upload code does **not** convert assets already created as public. Audit then migrate:

```bash
npm run scripts:migrate-mux-signed-playback -- --dry-run
npm run scripts:migrate-mux-signed-playback
```

See that script’s comments for Mux dashboard fallback steps.

**Deploy checklist**

1. `MUX_SIGNING_KEY_ID` + `MUX_PRIVATE_KEY` set on Vercel (required or playback returns 503).
2. Run the migration against production Mux + DB so old public `.m3u8` URLs stop working.
3. Confirm learner Network tab shows `stream.mux.com/...m3u8?token=...` and that the same URL without `token` fails in Incognito.

## Webhook URL

In Mux Dashboard → Settings → Webhooks:

- **URL**: `https://your-domain.com/api/webhooks/mux`
- **Events**: `video.asset.ready` (and upload events if used)
- **Signing secret** → `MUX_WEBHOOK_SECRET`
