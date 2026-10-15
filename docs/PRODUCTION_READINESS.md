# Alwerash production readiness

**Overall launch readiness:** Blocked  
**Engineering estimate of recommended-launch completion:** ~45% (not an objective measurement; see [How the estimate was calculated](#how-the-estimate-was-calculated))  
**Last audit date:** 2026-10-15  
**Audited git ref:** `main` at `288e063` (`origin/main`). Unmerged remote branches (`security/phase5-hardening`, `security/phase0-architecture-review`, `perf/measurement`) were **not** treated as shipped.

## Technologies and deployment assumptions

| Layer | What exists in this repo |
| --- | --- |
| App | Next.js 15 App Router, React 19, TypeScript, Tailwind 4 |
| Auth | NextAuth v4, JWT sessions, Credentials (+ optional Google), Prisma adapter, argon2id passwords |
| Data | Prisma 6 → PostgreSQL. `.env.example` documents **Supabase** pooler URLs. 25 Prisma migrations |
| Video | Mux direct upload + signed HLS playback + webhook |
| Email | Resend (verification) |
| Payments | Schema enums `STRIPE` / `PAYMOB` and `PaymentEvent` model. **No payment SDK. Choosing a plan grants a free `ALL_ACCESS` entitlement.** |
| Hosting | No Dockerfile, `vercel.json`, or Render config. CI and env comments assume a Node/Vercel-like host. **Production host: Unknown.** |
| Jobs | Mux webhook only. No queue/cron in `src/` |
| Analytics | Microsoft Clarity (session replay) |

**Assumption used for this audit:** a real launch means paying customers, durable uploads, and a hosted Next.js process (serverless or Node) in front of the same Postgres database. If you intend an invite-only free beta on a single long-lived VM, several P0 items drop to P1 — that is called out below.

## What was actually inspected and tested

**Inspected**

- Root `package.json`, `next.config.ts`, `.env.example`, `.github/workflows/ci.yml`, `README.md`
- `src/auth.ts`, `src/middleware.ts`, `src/server/db/prisma.ts`, subscription/video/auth services
- App routes, API routes, Prisma schema/indexes, upload routes, existing `docs/`
- Unmerged remote branch **commit titles** (not a full code review of those branches)

**Ran on 2026-10-15 (local Windows, Node via npm scripts)**

| Check | Result |
| --- | --- |
| `npm run typecheck` | **Fail** — `instrumentationHook` not in `ExperimentalConfig`; `useCourseCarouselMetrics.ts` literal type mismatches |
| `npm run lint` | **Pass with warnings** — 3 warnings (`react-hooks/exhaustive-deps`, 2× `@next/next/no-img-element`) |
| `npm run build` | **Fail** at “Checking validity of types” after **successful compile in 49s**. Lint skipped (`eslint.ignoreDuringBuilds: true`) |
| `npm audit --omit=dev` | **22 vulnerabilities** (5 critical, 13 high, 3 moderate, 1 low). Includes **critical** `next-auth` / `@auth/core` advisories |
| Automated tests | **None exist** (`*.test.*` / `*.spec.*` / Jest / Playwright / Vitest not present). CI does not run tests |
| Load test / Core Web Vitals / production API latency | **Not run.** No production URL, no k6/Artillery config, no authorized live load. Prior `docs/platform-capacity.canvas.tsx` numbers are modeled, not measured |

**Not verified (Unknown)**

- Live Supabase Data API / RLS state in the hosted project (migrations on `main` do not enable RLS)
- Production env vars, domain, HTTPS, Mux/Resend production config
- Backup/restore actually succeeding
- Real-user journeys on a deployed environment
- Whether `security/phase5-hardening` is merge-clean against current `main`

---

## Category scorecard

### Performance — Needs Improvement

| | |
| --- | --- |
| **Findings** | Catalog menu/course page uses `unstable_cache` (60s, tag `PUBLIC_CATALOG_CACHE_TAG`). Learn/course-access still do session + `requireSubscription` then data. Prisma production `connection_limit=1` per process; pooler URL is rewritten to **transaction mode `:6543`**. Pool exhaustion is swallowed (empty results). No `loading.tsx` under `course-access`. `next build` never produced a `.next` bundle to measure. Unmerged `perf/measurement` records DB timing work that is **not on main**. |
| **Impact** | Perceived slowness and possible empty pages under pool pressure. Capacity unknown. |
| **Action** | Fix pool fail-loud; measure catalog/learn/playback on a production-like `next start`; then decide on cache/query changes. Do not treat the old capacity canvas as a baseline. |
| **Priority** | P1 (pool swallowing is P0 under Reliability) |
| **Effort** | 1–3 days to instrument and measure; optimization TBD after numbers |
| **Verification** | p50/p95 of `/course`, `/course-access/:id`, `/api/video/playback/:id` on `next start` against a copy of prod data. Empty-catalog must not occur on pool errors. |

### Scalability — Needs Improvement

| | |
| --- | --- |
| **Findings** | Indexes exist on common filters (`published`, `userId`, course tag columns, entitlements). No queue. Local disk uploads will not scale on serverless (ephemeral FS). Progress PATCH is auth-only (any logged-in user). Horizontal scaling of Node is possible if sessions stay JWT (they do) **and** uploads leave local disk. Connection pooling is a first bottleneck (limit 1 in prod). Race on free entitlement upsert is low risk until payments exist. |
| **Impact** | Fine for a small pilot **if** host is a single VM with disk. Not fine for Vercel-style multi-instance + paid growth. |
| **Action** | Object storage; confirm pooler mode with Prisma (unmerged perf branch stopped forcing `:6543`); add subscription check on progress APIs. Skip microservices. |
| **Priority** | P0 for serverless uploads; P1 otherwise |
| **Effort** | 2–4 days storage; 0.5 day progress auth; pooler change 0.5–1 day + measure |
| **Verification** | Upload photo on two instances and still see the file; progress API 403 without entitlement; pooler errors do not return empty catalogs. |

### Security — Fail

| | |
| --- | --- |
| **Findings** | **Paid content is free:** `chooseSubscriptionPlan` → `createFreeEntitlement` (“without payment (for now)”). Register returns 409 `"Email is already registered"` (enumeration). No rate limiting. No password reset. JWT roles hydrated **once** (`token.roles == null`); role revocation needs re-login. Any `INSTRUCTOR` JWT bypasses subscription for **all** lesson playback. First published module is a **guest free preview**. No security headers in `next.config.ts`. File type checks use `File.type` (client-supplied MIME), not magic bytes. No RLS in Prisma migrations; app uses the DB user via Prisma — **Supabase Data API exposure is Unknown**. Mux webhook signature is verified. Passwords hashed with argon2. `npm audit` reports critical Auth.js issues. Health route comment says unauthenticated; middleware still gates `/api/admin*`. |
| **Impact** | Anyone who registers can take catalog access without paying. Auth abuse and stale admin roles. Possible PostgREST leak if Data API is on. |
| **Action** | Stop self-serve free entitlements; integrate Paymob/Stripe **or** admin-grant only. Rate-limit auth. Headers. Rotate any secret that ever lived in git. Review/merge `security/phase5-hardening` after diff review. Patch `next-auth` after checking breaking changes. Confirm Data API disabled or RLS deny-all for `anon`/`authenticated`. |
| **Priority** | P0 |
| **Effort** | 1–2 weeks paid path; 1–2 days if launch is explicitly free/invite-only |
| **Verification** | Unauthenticated user cannot obtain `ALL_ACCESS`. Login/register 429 after abuse. Playback 403 without entitlement except documented free preview. `curl -I` shows CSP/HSTS/frame options on prod. |

### Reliability and code quality — Fail

| | |
| --- | --- |
| **Findings** | `src/server/db/prisma.ts` on pool exhaustion sets `prismaPoolBroken` and returns `[]` / `null` / `0` for subsequent queries — **silent data loss / false unpaid / empty UI**. `error.tsx` and `global-error.tsx` exist. Logging is `console.*` only. No Sentry. No automated tests. `$queryRawUnsafe` is parameterized (`$1`) in sampled featured-mentor SQL — not string-concatenated. `frontend/` and `backend/` trees exist but are excluded from tsconfig. |
| **Impact** | Users and admins cannot trust empty states. Outages look like “no courses”. |
| **Action** | Fail the request on pool errors. Add Sentry (or equivalent). Add tests for register, login, entitlement, playback auth. |
| **Priority** | P0 (pool swallow), P1 (observability/tests) |
| **Effort** | 4h pool behavior; 1 day Sentry; 3–5 days critical-path tests |
| **Verification** | Forced pool error returns 503, not empty catalog. Sentry receives a test exception in staging. Tests fail if playback skips entitlement. |

### Testing — Fail

| | |
| --- | --- |
| **Findings** | CI runs lint, typecheck, build. Typecheck/build **fail on current `main`**. No unit/e2e tests. Manual scripts (`test-db-connection.ts`, `test-mux-config.ts`, `test-resend.ts`) are not CI. |
| **Impact** | Regressions in auth/payments/video will ship unnoticed. CI cannot go green today. |
| **Action** | Unblock typecheck/build first. Then Playwright (or similar) for register → verify → login → catalog → (paid) access → playback 403/200. |
| **Priority** | P0 for green CI; P1 for e2e |
| **Effort** | 2h type errors; 3–5 days e2e |
| **Verification** | GitHub Actions on `main` green. E2E covers the journey above against a staging DB. |

### Deployment and operations — Fail

| | |
| --- | --- |
| **Findings** | CI only; no deploy workflow, health used by a host, rollback runbook, or backup procedure in-repo. README still says port 3000 while `npm run dev` uses **3002**. `AUTH_SECRET` has a build placeholder. Env is not schema-validated at boot. Clarity project id is hardcoded in `MicrosoftClarity.tsx`. |
| **Impact** | Repeatable production release is not demonstrated. |
| **Action** | Document host, required env, migrate command (`prisma migrate deploy`), backup (Supabase PITR or snapshots), rollback (previous deployment + migration policy). Public `/api/health` for the load balancer. |
| **Priority** | P0 for first production; P1 for fancy CD |
| **Effort** | 1–2 days to define and dry-run; more if host is undecided |
| **Verification** | Staging deploy from a clean clone using only documented env. Restore a backup into a throwaway DB once. |

### User experience and launch completeness — Needs Improvement

| | |
| --- | --- |
| **Findings** | Catalog, tracks, course detail, register, email verify, login, home, admin CMS, Mux learn player exist. **Gaps:** subscription UI shows prices but does not charge; change-password “coming soon”; certificates placeholder; library categories “coming soon”; instructor submissions “coming soon”; OAuth buttons “coming soon”; `withTestTextLessons` **injects demo intro/article lessons** on live `/course-access` when missing INTRO/ARTICLE. Duplicate routes `/course/[id]` and `/courses/[id]`. Root metadata exists. Accessibility not systematically audited. |
| **Impact** | A determined user can browse and (today) self-grant access. Password recovery and paid checkout are missing. Learners may see QA dummy lessons. |
| **Action** | Remove demo lesson injector. Either ship payments or remove price/checkout UX. Password reset. Decide library/certificates scope for MVP (hide nav if not shipping). |
| **Priority** | P0 demo lessons + paid vs free product honesty; P1 password reset; P2 library/certs |
| **Effort** | 2h demo lessons; 1–2 days password reset; payments per Security |
| **Verification** | Course with only VIDEO lessons shows no `demo-intro-*` ids. Forgot-password email works in Resend production domain. |

---

## Remaining work

### Verified completed (on `main`, re-checked this audit)

- [x] NextAuth credentials login with `emailVerified` required (`src/auth.ts`)
- [x] Role middleware for `/admin`, `/instructor`, `/mentor` (`src/middleware.ts`)
- [x] Mux webhook signature verification (`src/app/api/webhooks/mux/route.ts`)
- [x] Signed playback path with server-side `assertCanAccessLessonPlayback`
- [x] Argon2 hashing (`src/server/auth/password.ts`)
- [x] Zod on register body
- [x] Root + some course/lesson metadata
- [x] `error.tsx` / `global-error.tsx`
- [x] Public catalog `unstable_cache` for menu/course page
- [x] Prisma migrations in repo (25 folders)
- [x] CI workflow exists (lint/typecheck/build) — **currently would fail typecheck/build**

### Outstanding — P0 launch blockers

- [ ] **Stop unpaid self-serve `ALL_ACCESS`** or replace with a real payment webhook that only then writes entitlements. ~8h (kill-switch) or 40–80h (Paymob/Stripe). *Matters:* otherwise launch is “all courses free.”
- [ ] **Do not swallow Postgres pool errors.** ~4h. *Matters:* empty UI vs outage.
- [ ] **Production build and typecheck green.** ~2h (`instrumentationHook` + carousel types). *Matters:* CI and deploy cannot complete.
- [ ] **Durable uploads** (S3/R2/Supabase Storage) if the host is serverless or multi-instance. ~16–24h. *Matters:* avatars, mentor photos, assignment files vanish.
- [ ] **Confirm Supabase Data API / RLS.** ~4–8h. *Matters:* without RLS, PostgREST can expose `public` tables. Unknown until the project dashboard is checked.
- [ ] **Remove `withTestTextLessons` from production course-access.** ~2h. *Matters:* fake lessons and copied “money back” marketing copy.
- [ ] **Document and dry-run migrate + backup + rollback** on the chosen host. ~8h + waiting on provider. *Matters:* first incident.

### Outstanding — P1

- [ ] Rate-limit `/api/auth/*`, register, login. ~8h
- [ ] Security headers (CSP, HSTS, frame, nosniff). ~4h
- [ ] Password reset (page is placeholder). ~12h
- [ ] Require subscription (or 403) on `/api/learning/progress/*`. ~4h
- [ ] Refresh or expire JWT roles when admin changes roles. ~8h
- [ ] Scope instructor playback to assigned courses. ~8h
- [ ] Error tracking (Sentry or equivalent). ~8h
- [ ] Public health endpoint used by the host. ~2h
- [ ] Upgrade/patch `next-auth` / `@auth/core` after a compatibility check. ~8–16h
- [ ] Hide unfinished nav (certificates, library categories, OAuth) or ship them. ~4–16h
- [ ] Critical-path automated tests. ~24–40h

### Outstanding — P2 / P3

- [ ] Segment `error.tsx` / `loading.tsx` on remaining slow routes. ~8h
- [ ] Canonical URLs; generateMetadata on tracks. ~4h
- [ ] Accessibility pass. ~16h
- [ ] Replace `File.type` with content sniffing; object-storage AV. ~8h
- [ ] Remove or archive unused `frontend/` `backend/` trees. ~4h
- [ ] Load test staging (after auth). ~8–16h + infra
- [ ] Review and merge `security/phase5-hardening` / `perf/measurement` **after** conflict review. ~16–40h (do not merge blind)

**Blockers / dependencies:** payment provider account + KYC; Resend domain; Mux production keys; decision on Vercel vs VM; Supabase plan (PITR); whether launch is paid or invite-only.

---

## Performance baseline

### Measured (this audit)

| Metric | Value | Conditions |
| --- | --- | --- |
| `next build` compile | 49s | Local Windows, Next.js 15.5.12, then **failed typecheck** |
| Typecheck | Fail (3 files / 7 errors) | `npm run typecheck` |
| Lint | 3 warnings, 0 errors | `next lint` |
| npm audit (prod omit-dev) | 22 vulns (5 critical) | 2026-10-15 |
| API p50/p95/p99 | **Not measured** | No staging load |
| Throughput / error rate | **Not measured** | |
| DB query timings on `main` | **Not measured** | Unmerged `perf/measurement` claims a baseline; not reproduced here |
| Core Web Vitals | **Not measured** | No CrUX / Lighthouse this run |
| Concurrent users | **Not measured** | Do not use modeled 50–100 watchers from older capacity notes as fact |

### Untested assumptions (do not treat as facts)

- Transaction pooler `:6543` is required on Vercel (code forces it; unmerged perf work questions it).
- `connection_limit=1` is enough for serverless but will serialize SSR on a single Node process.
- Mux offload means video bytes are not the app’s bottleneck (likely true; not measured).

---

## Launch checklist

Use this at go-live. Unchecked items are **not** verified.

- [ ] Security and authorization: paid entitlement only after payment (or documented free beta); playback 403; admin role checks; Data API/RLS confirmed
- [ ] Critical journeys: register → verify email → login → browse → pay/grant → watch lesson → progress saves
- [ ] Password reset works
- [ ] Automated tests on that journey in CI
- [ ] `npm run build` green; CI green on `main`
- [ ] `prisma migrate deploy` runbook; backup restored once
- [ ] Env: `AUTH_SECRET`, `AUTH_URL`, `DATABASE_URL`, `DIRECT_URL`, Mux, Resend production from, no placeholder secrets
- [ ] HTTPS and production `AUTH_URL`
- [ ] Monitoring: error tracker + Clarity privacy review (session replay on a learning product)
- [ ] Health check wired to the host
- [ ] Deployment and rollback documented and rehearsed
- [ ] Known accepted risks listed in the release note

**Known issues / accepted risks (if you launch anyway)**

- First module of each published course is a free preview by design (`playback-access.ts`).
- Watermark (if any) is deterrence, not DRM.
- JWT role lag until re-login.
- No e2e tests.

---

## How the estimate was calculated

Feature surface on `main` (catalog, CMS, Mux, auth, progress) is largely implemented. Production safety (money, durability, CI green, ops) is not. Weighting those equally yields **~45% of a recommended paid production launch**. A **feature-only** view would look higher (~65–70%); that would be misleading for “real-world production.”

Unknowns that move the date: payment provider integration, host choice (VM vs serverless), whether Data API is already locked down, and whether you merge the existing security branches instead of reimplementing.

---

## Time to launch

Assumptions: one full-time engineer who already knows this repo; reviews included; **not** calendar wait for Apple/Google OAuth; payment KYC not included in hours.

### 1. Minimum launch — safe functional MVP

**Definition:** no silent DB lies, green build, no fake paid checkout, durable files **or** a single-VM host, auth rate limits, headers, backups understood, demo lessons gone. **Either** invite-only with admin-granted access **or** real payments.

| Variant | Engineering hours | Calendar (1 engineer) |
| --- | --- | --- |
| Invite-only / admin-grant, long-lived VM | **70–90 h** | **10–15 working days** |
| Paid checkout + serverless host | **130–180 h** | **4–6 weeks** + payment-provider wait |

External wait: Paymob/Stripe account, DNS, Resend domain, Mux signing keys.

### 2. Recommended launch

Minimum **plus** Sentry, password reset, progress API gating, JWT role refresh, instructor scoping, Auth.js advisory patch, critical e2e, reviewed merge of security hardening, staging load smoke.

**Additional ~90–130 h** → **about 8–10 weeks** from today for a paid serverless launch with one engineer.

### 3. Further optimization (after launch)

- Catalog/query profiling using real p95
- Device-session limits / watermark upgrades (already sketched on unmerged security branches)
- Accessibility and SEO polish
- Library, certificates, OAuth
- Connection-pool and cache tuning only after measured baselines

---

## Next three highest-value actions

1. **Unblock `npm run build` / CI** (remove `experimental.instrumentationHook`; fix carousel literal types).
2. **Product decision:** paid vs invite-only — then **disable `createFreeEntitlement` on the public subscription form** the same day.
3. **Fail loud on Prisma pool errors** and **delete `withTestTextLessons`** from the learner path.

Ask before: merging `security/phase5-hardening` wholesale, introducing a new host/vendor, or a large auth rewrite (NextAuth v5).
