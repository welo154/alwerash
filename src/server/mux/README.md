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

Changing upload code does **not** convert assets already created as public. Run:

```bash
npx tsx scripts/migrate-mux-lesson-playback-to-signed.ts
```

See that script’s comments for Mux dashboard fallback steps.

## Webhook URL

In Mux Dashboard → Settings → Webhooks:

- **URL**: `https://your-domain.com/api/webhooks/mux`
- **Events**: `video.asset.ready` (and upload events if used)
- **Signing secret** → `MUX_WEBHOOK_SECRET`
