# Alwerash

Subscription learning platform for design and creative skills, aimed at the Middle East and North Africa. Learners buy a yearly membership and get every course: video lessons taught by industry mentors, with progress tracking, assignments reviewed by mentors, and certificates. The interface is in English and Arabic.

This README is the single source of truth for developers. Deeper write-ups live in `docs/` (security reviews, performance measurements).

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [Stack](#stack)
- [Project layout](#project-layout)
- [Users and roles](#users-and-roles)
- [Content model](#content-model)
- [How the main flows work](#how-the-main-flows-work)
- [Routes](#routes)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Operations](#operations)
- [Security model](#security-model)
- [Known limitations and launch checklist](#known-limitations-and-launch-checklist)

## Quick start

Requirements: Node 22, npm, and a PostgreSQL database (the project uses Supabase).

```bash
npm install                      # also runs `prisma generate`
cp .env.example .env             # then fill in at least DATABASE_URL, DIRECT_URL, AUTH_SECRET, AUTH_URL
npx tsx scripts/test-db-connection.ts
npm run db:deploy                # apply migrations
npx prisma db seed               # create the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                      # http://localhost:3070
```

In development, uploads are written to local disk (`.data/` and `public/uploads/`), the free "self-grant" subscription button works, and missing Mux, Resend, Polar or Supabase settings only produce warnings.

Set `AUTH_URL=http://localhost:3070` so sign-in callbacks and email links match the dev server.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3070 |
| `npm run build` / `npm start` | Production build and server. The build does not need a database. |
| `npm run lint` | ESLint (Next.js rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (Vitest). No database needed. |
| `npm run db:deploy` | Apply pending migrations (`prisma migrate deploy`) |
| `npm run db:migrate` | Create a new migration in development |
| `npx prisma db seed` | Create or update the admin user |
| `npm run db:studio` | Prisma Studio |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build on every pull request and on pushes to `main` and `dev`.

Useful one-off scripts in `scripts/` (run with `npx tsx scripts/<name>.ts`):

| Script | Purpose |
|---|---|
| `test-db-connection.ts`, `test-mux-config.ts`, `test-resend.ts` | Check that a service is reachable with the current `.env` |
| `ensure-user-can-login.ts`, `reset-user-password.ts`, `verify-user-email.ts` | Support tasks for a single account |
| `grant-subscription.ts` | Give a user membership by hand (respects the self-grant guard) |
| `delete-user.ts`, `remove-admin-role.ts` | Account administration |

The `import-*`, `apply-*`, `assign-*`, `mark-*` and `migrate-*` scripts were one-off content imports and data fixes. Check what one does before running it.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 (tokens in `src/app/globals.css`), GSAP and Swiper for motion and carousels |
| Database | PostgreSQL on Supabase, Prisma 6 |
| Auth | NextAuth v4: email and password (argon2id), optional Google sign-in, JWT sessions plus a server-side device-session table |
| Video | Mux direct uploads, signed HLS playback, hls.js player, per-viewer watermark |
| Payments | Polar (merchant of record, USD card checkout) |
| Email | Resend |
| File storage | Supabase Storage (one private and one public bucket) |
| Validation | Zod 4 |
| Analytics | Microsoft Clarity (`NEXT_PUBLIC_CLARITY_PROJECT_ID`) |
| Hosting | Vercel, region `dub1` (`vercel.json`) |

## Project layout

```
src/
├── app/                 Routes (App Router). Pages, layouts, API route handlers, server actions
├── components/          UI by area: landing, home, learn, library, course, video, layout, auth, profile…
├── lib/                 Code shared by client and server: i18n dictionary, plan data, URL helpers
├── server/              Server-only code
│   ├── auth/            Registration, passwords, device sessions, role guards (require.ts)
│   ├── authz/           lesson-access.ts: the single place that decides lesson access
│   ├── content/         Catalog (public.service.ts) and admin CMS services
│   ├── db/prisma.ts     Prisma client, pool configuration, retry on pool exhaustion
│   ├── payments/        Polar client
│   ├── subscription/    Entitlements, payment-event idempotency, subscription checks
│   ├── video/ mux/      Mux uploads, playback tokens, webhooks, watermark
│   ├── storage/         Object storage and file-signature checks
│   ├── security/        Rate limiting, request context, security event log
│   └── env.ts           Startup configuration check
├── auth.ts              NextAuth configuration
├── middleware.ts        Edge route guards by role
└── instrumentation.ts   Runs the env check and warms Prisma at server start
prisma/                  schema.prisma, migrations/, seed.ts
scripts/                 Operational and one-off scripts
docs/                    Security and performance write-ups
public/                  Static assets, fonts, images
```

Conventions:

- Pages are server components that fetch data and pass it to presentational components. Interactivity lives in client components (`"use client"`).
- Business logic belongs in `src/server/**`; route handlers stay thin. Throw `AppError` (`src/server/lib/errors.ts`) for expected failures.
- Lesson access always goes through `authorizeLessonAccess`; never re-implement the rule in a page.
- After a catalog change, call the helpers in `src/server/content/revalidate-public-paths.ts`.
- Tests sit next to the code as `*.test.ts`.

## Users and roles

Roles are stored in `user_roles`; one user can hold several.

| Role | How it is assigned | Lands on | Can do |
|---|---|---|---|
| Guest | No account | `/` | Browse the catalog, mentors and tracks; watch the free preview (first module of each course) |
| `LEARNER` | Self-registration | `/home` | Watch lessons with an active membership, track progress, submit assignments, earn certificates |
| `INSTRUCTOR` | Created by an admin | `/instructor` | See assigned courses and their learners' progress |
| `MENTOR` | Admin creates a login on a mentor profile | `/mentor` | Review submissions for courses where they are the mentor |
| `ADMIN` | `prisma db seed` | `/admin` | Full CMS, users, analytics, submissions, certificates |

Middleware keeps signed-in admins inside `/admin`, `/instructor` and `/mentor`. Role changes take effect on the next request without signing in again, because roles are re-read on every request.

Mentors (`mentors` table) are public profiles shown on courses. Instructors (`course_instructors`) are user accounts assigned to manage a course. They are separate concepts.

## Content model

School → Track → Course → Module → Lesson (`VIDEO`, `ARTICLE` or `RESOURCE`). Each level has `order` and `published`. Lessons can have assignments; learners' submissions are reviewed by the course mentor.

Other key tables: `lesson_progress`, `user_learning_days` (weekly activity), `entitlements` (membership access), `payment_events` (webhook idempotency), `device_sessions`, `rate_limit_buckets`, `security_events`, `certificates`, `student_stories`.

## How the main flows work

**Registration and sign-in.** `/register` calls a server action that hashes the password with argon2id and emails a verification link (Resend). Sign-in is refused until the email is verified. Sign-in and registration are rate-limited per email and per IP, stored in Postgres. Each sign-in registers a device session; signing in on a second device of the same kind (phone, tablet or desktop) signs out the older one.

**Membership purchase (Polar).**

1. `/subscription` → `/subscription/checkout` → the `requestCheckout` server action creates a Polar checkout tied to the user (`external_customer_id`) and redirects to Polar.
2. Polar redirects back to `/subscription/success`, which polls until access appears. The redirect itself never grants anything.
3. Polar calls `POST /api/webhooks/polar`. After verifying the signature, `order.paid` for `POLAR_PRODUCT_ID` grants 12 months of `ALL_ACCESS` (stacked onto any remaining time) and `order.refunded` takes it back.
4. Each Polar event is applied exactly once, even if Polar delivers it twice at the same moment (`claimPaymentEvent` in `entitlement.service.ts`).

The membership is currently a one-time yearly purchase with no automatic renewal. Paymob and Stripe buttons on the checkout page only record the choice; they do not take payment.

**Video.** Admins upload directly to Mux from the module editor. The Mux webhook (`/api/webhooks/mux`, signature verified) marks the asset ready. Playback requests go to `/api/video/playback/[lessonId]`, which checks lesson access and returns a short-lived signed token. The player overlays a pseudonymous watermark per viewer.

**Progress.** The player saves its position to `/api/learning/progress/lesson/[lessonId]`, which also checks lesson access. A lesson is complete at 90% watched or within the last 30 seconds.

**Language.** English and Arabic. UI strings are translated through `src/lib/i18n/dictionary.ts`, keyed by the English text. The chosen language is stored in the browser and applied on the client.

## Routes

Public: `/`, `/course` (catalog), `/course/[courseId]`, `/tracks`, `/tracks/[slug]`, `/mentors`, `/mentors/[id]`, `/library/**`, `/events`, `/subscription`, `/certificates/[code]` (public certificate check).

Auth: `/login`, `/register`, `/register/check-email`, `/verify-email`, `/forgot-password`, `/reset-password`.

Learner: `/home`, `/course-access/[courseId]` (course player), `/lessons/[lessonId]`, `/profile/**`, `/settings`, `/subscription/checkout`, `/subscription/success`.

Staff: `/admin/**`, `/instructor/**`, `/mentor/**`.

Legacy `/learn/**` URLs redirect to `/course` or `/course-access/[courseId]`.

API groups under `src/app/api/`: `admin/*` (admin only), `instructor/*`, `mentor/*`, `learning/*` (progress, assignments, submissions), `catalog/*`, `video/playback/*`, `webhooks/{mux,polar}`, `auth/*`, `me`, `profile`, `search`, `stats`, `health`.

## Environment variables

`.env.example` documents every variable. At startup `src/server/env.ts` checks them and logs one list of problems in the runtime logs:

- **Stops the server** (production): `DATABASE_URL` missing or invalid, `AUTH_SECRET` missing, or `SUBSCRIPTION_SELF_GRANT_ENABLED=true`. The site cannot work, or would give paid access away, in these cases.
- **Warns and keeps serving**: missing or placeholder video, email, storage or payment credentials, a weak `AUTH_SECRET`, or a missing or non-https `AUTH_URL`. The affected feature fails until configured; everything else works. Look for `[env] Configuration warnings` in the Vercel logs after each deploy.

`SKIP_ENV_VALIDATION=1` bypasses the check entirely in an emergency.

| Group | Variables | If missing in production |
|---|---|---|
| Database | `DATABASE_URL`, `DIRECT_URL` | Server stops |
| Auth | `AUTH_SECRET` (at least 32 characters) | Server stops if missing; warning if short |
| Auth | `AUTH_URL` (https) | Warning: email links and payment redirects point at localhost |
| Google sign-in | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional |
| Video | `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, `MUX_SIGNING_KEY_ID`, `MUX_PRIVATE_KEY`, `MUX_WEBHOOK_SECRET` | Warning: uploads and playback fail |
| Email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Warning: verification and reset emails fail |
| Storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (optional `STORAGE_PRIVATE_BUCKET`, `STORAGE_PUBLIC_BUCKET`) | Warning: photo and submission uploads fail |
| Payments | `POLAR_ACCESS_TOKEN`, `POLAR_PRODUCT_ID`, `POLAR_WEBHOOK_SECRET`, `POLAR_SERVER=production` | Warning: checkout fails (a sandbox `POLAR_SERVER` also warns) |
| Analytics | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optional |
| Tuning | `DB_CONNECTION_LIMIT`, `PERF_TIMING`, `CATALOG_SHOW_UNPUBLISHED` | Optional |
| Never in production | `SUBSCRIPTION_SELF_GRANT_ENABLED=true` (lets anyone unlock access for free) | Server stops |

Database URLs: use the Supabase session pooler (`aws-0-REGION.pooler.supabase.com:5432`, user `postgres.PROJECT_REF`). URL-encode special characters in the password. Production defaults to one connection per server instance; raise it with `DB_CONNECTION_LIMIT` only after checking the pooler's capacity (Supabase session mode allows 15 in total).

## Deployment

Target: Vercel (region `dub1`, next to the database).

1. Set every production variable above in the Vercel project (Production environment).
2. Apply migrations **before** the new code serves traffic: `npm run db:deploy` with production `DATABASE_URL` and `DIRECT_URL`. Migrations must stay backward-compatible with the previous release (add columns first, remove them in a later release) so a rollback never meets an incompatible schema.
3. Deploy. The build needs no database; catalog pages render per request and cache their data for 60 seconds.
4. Check `GET /api/health` returns `200`, look for `[env] Configuration warnings` in the runtime logs, then do one sign-in and one lesson playback.
5. Webhooks: Mux → `https://<domain>/api/webhooks/mux`; Polar → `https://<domain>/api/webhooks/polar` with `order.paid` and `order.refunded`.

**Rollback:** promote the previous deployment in Vercel. Because migrations are backward-compatible, no database change is needed. Never roll back by editing migration history.

## Operations

- **Health:** `GET /api/health` returns `200 {"ok":true}` or `503`. Point the uptime monitor here.
- **Database pool exhaustion:** queries retry twice, then fail with HTTP 503 and log `[db] connection pool exhausted`. If this appears, check the pooler mode and `DB_CONNECTION_LIMIT`.
- **Logs:** `console` output in Vercel. Security-relevant events (sign-ins, rate limits, device replacements) are also stored in the `security_events` table.
- **Backups:** enable Supabase point-in-time recovery (or daily backups) on the production project. Restore into a scratch project at least once before launch to prove it works.
- **Support tasks:** use the scripts listed under [Commands](#commands), run locally with production credentials, carefully.

## Security model

- Authorization lives in the application: edge middleware for routes, plus `requireRole` / `requireAuth` / `authorizeLessonAccess` in handlers. Postgres row-level security is not used, so the Supabase Data API must stay disabled, or every table must deny the `anon` and `authenticated` roles.
- Passwords use argon2id (old bcrypt hashes are still accepted). Email verification is required, and responses never reveal whether an email is registered.
- Rate limits, stored in Postgres, cover sign-in, registration, emails, password reset, search, playback tokens, uploads and checkout (`src/server/security/rate-limit.ts`). If the limiter's database is unavailable it allows requests rather than locking everyone out.
- Paid access comes only from verified webhooks. Webhook signatures (Mux, Polar) are verified.
- Uploads are checked by their file signature, not the browser-reported type. Private files are served only through authorized routes.
- Security headers come from `next.config.ts`. The content security policy is still in **report-only** mode.
- More detail: `docs/security/`.

## Known limitations and launch checklist

Before launch:

- [ ] **Font licence:** the site uses a Fontwerk **trial** font (`public/fonts/FwTRIAL-PangeaVAR.woff2`). Buy a web licence and replace the file.
- [ ] Polar: production product, `POLAR_SERVER=production`, webhook configured, one real purchase and refund tested.
- [ ] Decide on the plan cards: Studio, Starter and Pro currently share one price and one Polar product.
- [ ] Hide the Paymob and Stripe buttons, or connect them.
- [ ] Supabase: Data API disabled (or deny-all RLS), point-in-time recovery on, restore tested.
- [ ] Review content security policy reports on staging, then switch to an enforced policy.
- [ ] Add error tracking (for example Sentry) and an uptime monitor on `/api/health`.
- [ ] End-to-end test of register → verify → sign in → pay → watch.

Known limitations:

- Arabic is applied on the client only: the server always renders English, so Arabic visitors briefly see English and search engines index only English.
- Some sections use fixed desktop pixel widths from the Figma designs and scroll sideways on small screens.
- Several very large components (over 1,000 lines) need splitting: `ActivityScheduleCard`, `HomeTrackExplorerSection`, `FullCourseLearningExperience`, `ContinueLearningSection`, and `server/content/public.service.ts`.
- `public.service.ts` and `admin.service.ts` still contain fallbacks for database columns missing from older migrations. Remove them once production migrations are confirmed up to date.
- `npm audit` still reports advisories inside Next's build-time postcss, the Prisma CLI and the `@auth/core` copy bundled with next-auth v4. None has a non-major fix; revisit on the next major upgrades.
