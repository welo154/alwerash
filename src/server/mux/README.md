# Mux service – HLS video playback

## What’s in place

- **Config** (`config.ts`): reads `MUX_*` env vars; API and optional webhook/signed playback.
- **Service** (`mux.service.ts`):
  - `createDirectUpload(lessonId)` – create a direct upload URL and pass `lessonId` as passthrough for the webhook.
  - `getPlaybackIdForAsset(assetId)` – get HLS playback ID for an asset.
  - `linkVideoToLesson(lessonId, muxAssetId, muxPlaybackId)` – create/update `LessonVideo` for a lesson.
- **Webhook** `POST /api/webhooks/mux`: on `video.asset.ready`, creates `LessonVideo` using passthrough `lessonId` and the asset’s playback ID.
- **Admin upload** `POST /api/admin/lessons/[lessonId]/upload`: returns `{ uploadId, url }` for direct upload. Used by `MuxUploadButton` on the module page.

## Flow

1. Admin opens a module, sees VIDEO lessons. For lessons without a video, “Upload video” is shown.
2. Admin clicks “Upload video” and selects a file. Client calls `POST /api/admin/lessons/:lessonId/upload`, gets `url`, then `PUT`s the file to that URL (direct to Mux).
3. Mux processes the file and sends a `video.asset.ready` webhook to your app.
4. Webhook handler creates `LessonVideo` with `muxAssetId` and `muxPlaybackId`.
5. Learn page streams via `https://stream.mux.com/{playbackId}.m3u8` (public playback).

## Webhook URL to set in Mux

In [Mux Dashboard → Settings → Webhooks](https://dashboard.mux.com/settings/webhooks), add:

- **URL**: `https://your-domain.com/api/webhooks/mux`  
  Local: use a tunnel (e.g. ngrok) and put that URL in Mux.
- **Events**: enable `video.asset.ready`.
- Copy the **Signing secret** into `.env` as `MUX_WEBHOOK_SECRET`.

Until the webhook is configured, uploads will complete to Mux but `LessonVideo` won’t be created automatically; you can still create/link videos via API or DB if needed.

## Optional: signed playback

If you set `MUX_SIGNING_KEY_ID` and `MUX_PRIVATE_KEY`, you can add an API that returns a signed playback token (JWT) and use it with Mux signed playback so streams aren’t public. The current learn page uses public HLS URLs.
