# Security, reliability & SEO checklist

Use this list to track what’s done and what’s left. Items marked **Done** were applied in the last pass.

---

## Security

| Done | Action |
|------|--------|
| ✅ | **.env.example** – Replaced real secrets with placeholders. **If your real secrets were ever committed:** rotate DB password, Mux tokens, webhook secret, signing keys, and AUTH_SECRET. |
| ✅ | **TypeScript** – Removed `ignoreBuildErrors: true` from `next.config.ts`. Build now fails on type errors. |
| ✅ | **Legacy code** – Excluded `frontend/` and `backend/` from `tsconfig.json` so only `src/` is type-checked. Fix or remove those folders when you use them. |
| ☐ | **Rate limiting** – Add rate limiting for `/api/auth/*`, login form, and register (e.g. next-rate-limit or Upstash) in production. |
| ☐ | **API validation** – Ensure every API route validates body/params with Zod (or similar) and returns 400 on failure. |
| ☐ | **Security headers** – Consider adding `next.config` headers (e.g. X-Frame-Options, CSP) for production. |

---

## Reliability

| Done | Action |
|------|--------|
| ✅ | **error.tsx** – Added `src/app/error.tsx`: shows “Something went wrong”, Try again, and Back to home. |
| ✅ | **global-error.tsx** – Added `src/app/global-error.tsx`: catches errors that escape the root layout. |
| ☐ | **Segment error boundaries** – Optionally add `error.tsx` under `app/learn/` and `app/admin/` for segment-specific messages. |
| ☐ | **Logging / monitoring** – Add structured logging (e.g. Pino) and/or error reporting (e.g. Sentry) for production. |
| ☐ | **Health check** – Ensure `/api/admin/health` or a public `/api/health` is used by your host for readiness. |

---

## SEO & metadata

| Done | Action |
|------|--------|
| ✅ | **Root metadata** – In `src/app/layout.tsx`: added `metadata` (title, description, openGraph). All pages now get a default title and description. |
| ✅ | **Course page** – Added `generateMetadata` in `src/app/courses/[courseId]/page.tsx` so the course title (and summary) appear in the tab and in shares. |
| ✅ | **Lesson page** – Added `generateMetadata` in `src/app/learn/[courseId]/lesson/[lessonId]/page.tsx` so the lesson title appears in the tab. |
| ☐ | **Tracks and learn course** – Optionally add `generateMetadata` for `tracks/[slug]` and `learn/[courseId]` (track/course title). |
| ☐ | **Canonical URLs** – If you have duplicate or alternate URLs, add canonical links in metadata. |

---

## Quick reference: what was changed

- **.env.example** – All values replaced with placeholders; no real credentials.
- **next.config.ts** – `typescript.ignoreBuildErrors` removed.
- **tsconfig.json** – `frontend` and `backend` added to `exclude`.
- **src/app/error.tsx** – New client error boundary (Try again, Back to home).
- **src/app/global-error.tsx** – New root error boundary.
- **src/app/layout.tsx** – New `metadata` export (title, description, openGraph).
- **src/app/courses/[courseId]/page.tsx** – New `generateMetadata` (course title, description).
- **src/app/learn/[courseId]/lesson/[lessonId]/page.tsx** – New `generateMetadata` (lesson title).
- **src/server/video/video.service.ts** – Fixed Mux JWT usage (`mux.jwt.signPlaybackId`) and playbackId type for webhook.

See **docs/DIAGNOSIS.md** for the full diagnosis and **docs/PERFORMANCE-DIAGNOSIS.md** for performance details.
