# 00 — Architecture Review (Phase 0)

**Audited commit:** `288e063708d27833459535aacf9e21cfa13a8a02`
**Branch:** `security/phase0-architecture-review`
**Mode:** read-only inspection. No application code was changed during Phase 0.

> The working tree also carried unrelated in-progress mobile-routing edits from a
> previous task. Those were not part of this review and were not committed with
> the security work.

---

## 1. Stack and installed versions

Resolved from `package-lock.json` rather than the `^` ranges in `package.json`.

| Component | Version | Note |
|---|---|---|
| next | 15.5.12 | App Router. Patched against the `x-middleware-subrequest` middleware-bypass CVE (fixed in 15.2.3). |
| next-auth | 4.24.13 | v4, **not** Auth.js v5. |
| @prisma/client / prisma | 6.19.2 | PostgreSQL, Supabase session pooler. |
| argon2 | 0.41.1 | Password hashing (argon2id). |
| bcrypt | 5.1.1 | Legacy verification path only. |
| @mux/mux-node | 12.8.1 | Video platform SDK. |
| resend | 6.9.3 | Transactional email. |
| hls.js | 1.6.15 | Custom video player. |
| zod | 3.25.76 | Input validation. |

### Test and CI baseline

There were **zero test files and no test runner** at the audited commit.
`.github/workflows/ci.yml` runs `npm ci`, `prisma generate`, lint, typecheck, and
build — no tests. CI uses placeholder database credentials, has no
`pull_request_target`, and no script-injection sinks.

`next.config.ts` sets `eslint.ignoreDuringBuilds: true`, so lint findings do not
block a production build (CI still runs lint separately).

`npm install` reports 30 advisories across the dependency tree (1 low, 8 moderate,
16 high, 5 critical). These were surfaced incidentally and have **not** been
triaged; `npm audit` was not run as part of this read-only review.

---

## 2. Authentication and session architecture

Configured in `src/auth.ts`: NextAuth v4 with **`session: { strategy: "jwt" }`**,
a `PrismaAdapter` (so OAuth accounts persist), a Credentials provider, and Google
registered only when both client env vars are present. Apple is referenced in UI
metadata but disabled and not configured server-side.

Roles are read from the database **once** and then cached in the token:

```ts
// src/auth.ts:89-103
if (token.sub && token.roles == null) {
  const [roles, dbUser, profession] = await Promise.all([...]);
  token.roles = roles.map((r) => r.role);
}
```

### How revocation works today: it does not

- No `maxAge` is configured, so NextAuth's **30-day** default applies.
- `auth()` only decodes the cookie; it never confirms the user still exists.
- Role changes (admin demotion, mentor/instructor revocation) do not take effect
  until expiry or re-login. Both `src/middleware.ts` and `requireRole` read roles
  from the token.
- A deleted user retains access; `scripts/delete-user.ts` cannot invalidate a cookie.
- A password change does not terminate existing sessions, and there is no
  administrative force-logout.
- The `Session` table exists (`prisma/schema.prisma:154-163`) but is **unused**
  under the JWT strategy.

**This is the blocking constraint for Feature 3.** There is currently no revocable
server-side session object to bind a device to.

### Positive authentication controls

argon2id with explicit cost parameters; credentials login refuses unverified
emails; generic login failure messaging; `allowDangerousEmailAccountLinking` not
enabled; registration hardcodes `Role.LEARNER` (no role injection); verification
tokens use `randomBytes(32)` with 24-hour expiry and single use; ADMIN is granted
only via seed/CLI, with no HTTP self-promotion path.

---

## 3. Data model relevant to the five features

`User` holds `email`, `passwordHash`, `emailVerified`, `image`, `bio`, `skills`,
`country`. Roles live in `UserRole` (enum: LEARNER, INSTRUCTOR, MENTOR, ADMIN), so
one user may hold several roles.

Entitlement is expressed two ways and both are honoured by `hasActiveSubscription`:

- `Subscription` — `provider`, `status`, `currentPeriodEnd`.
- `Entitlement` — `product: ALL_ACCESS`, `status`, nullable `expiresAt`, unique on `(userId, product)`.
- `PaymentEvent` — unique on `(provider, providerEventId)`, intended for idempotent
  provider callbacks. **Never written to by application code at the audited commit.**

`SubscriptionProvider` already contains `STRIPE` and `PAYMOB`, so wiring Paymob
requires **no schema change**.

Content hierarchy: `Track → Course → Module → Lesson`, with `LessonVideo`
(one-to-one, `muxAssetId` + `muxPlaybackId`) and `LessonArticle`. Instructor
ownership is `CourseInstructor`, whose `instructorId` correctly references `User.id`.

`Thread` / `Message` / `ThreadParticipant` exist but have **no routes or UI** —
dormant schema, nothing to audit.

### Entitlement check correctness

```ts
// src/server/subscription/access.service.ts
prisma.subscription.findFirst({ where: { userId, status: "ACTIVE", currentPeriodEnd: { gt: now } } })
prisma.entitlement.findFirst({ where: { userId, product: "ALL_ACCESS", status: "ACTIVE",
  OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } })
```

Expired, canceled, past-due, trialing, and ended states are all correctly excluded.

---

## 4. Existing Mux implementation

Better than assumed. Phase 2 should extend and test, not rebuild.

- Both lesson upload paths request `playback_policy: ["signed"]`.
- `getSignedPlaybackForLesson` mints a Mux JWT **only after**
  `assertCanAccessLessonPlayback` passes, and fails closed with 503 when signing
  keys are missing.
- `AuthorizedHlsPlayer` fetches `/api/video/playback/[lessonId]` and never
  receives a raw playback ID. All four call sites use it (course-access, course
  preview, standalone lesson page, admin preview).
- The webhook verifies HMAC-SHA256 with a 300-second timestamp tolerance and
  `crypto.timingSafeEqual`, returns 500 when the secret is unset, and is
  idempotent via `VideoEvent`.
- The seven legacy lesson assets were migrated from public to signed playback and
  their public playback IDs deleted; a previously working public `.m3u8` URL now
  returns **404**. Intro/marketing videos remain deliberately public for catalog
  thumbnails via `image.mux.com`.

### Remaining Mux gaps (Phase 2 scope)

- The playback JWT is bound to the playback ID only — no user or device binding.
- Default TTL is one hour (`MUX_PLAYBACK_TOKEN_TTL ?? "1h"`), so a copied URL
  works for the remainder of the window.
- `watermarkText` is already returned by the API but **ignored by the player**,
  and it currently contains the student's **email address**, which conflicts with
  the Phase 4 privacy requirement.

### Player suitability for watermarking

`HlsPlayer` uses custom controls and calls `requestFullscreen()` on the
**container div**, so an HTML overlay survives desktop fullscreen. `playsInline`
keeps iOS playback inline. iOS Safari does not support fullscreen on a `div`, so
fullscreen behaviour there must be device-tested rather than assumed.

---

## 5. Protected resource inventory

50 route handlers under `src/app/api`, plus 11 files containing server actions.

Authorization is centralized in `src/server/auth/require.ts`
(`requireAuth`, `requireRole`), `src/server/auth/mentor-context.ts`, and
`src/server/subscription/require-subscription.ts`. `handleRoute` is
error-handling only and performs **no** auth.

Object-level ownership is correctly enforced in the service layer for mentor
grading (`mentorSubmissionWhere`), instructor learner lists (`CourseInstructor`
check), and submission file reads (`canAccessSubmissionFile`). Every admin server
action independently calls `requireRole(["ADMIN"])`, so nothing depends on hidden UI.

### Gaps found (Feature 1 scope)

| Resource | Gate at audit | Gap |
|---|---|---|
| `/api/learning/progress/lesson/[lessonId]` GET+PATCH | `requireAuth()` | No entitlement or lesson-access check |
| `/api/learning/progress/{course,track}/[id]` | `requireAuth()` | Same; user-scoped aggregates only |
| `course-access/[courseId]/actions.ts` | `auth()` | Server action completes lessons with no entitlement check |
| `/api/video/playback/[lessonId]` | Full check | INSTRUCTOR treated as privileged **platform-wide**, unscoped |
| `/api/learning/assignments/*` | `requireSubscription()` | Uses `redirect()`, so API clients get HTML not JSON 401/403 |
| `/api/admin/health` | Middleware only | No in-handler check (defense-in-depth) |

---

## 6. Confirmed vulnerabilities

1. **Critical — paid access is free.** `chooseSubscriptionPlan` called
   `createFreeEntitlement`, granting `ALL_ACCESS` to any authenticated user with
   no payment verification. No payment SDK existed anywhere and `PaymentEvent` was
   never written. *(Closed in Phase 1.)*
2. **High — student submission files are publicly served.** Uploads are written to
   `public/submission-files/`, which Next.js serves statically at
   `/submission-files/{fileKey}`, bypassing `canAccessSubmissionFile` entirely.
   The 64-bit random suffix resists brute force, but any URL leak grants
   permanent unauthenticated access to another student's work.
3. **High — no session revocation and stale roles** (section 2).
4. **High — instructor role bypassed entitlement for every lesson on the
   platform**, not just assigned courses. *(Closed in Phase 1.)*
5. **High — no rate limiting anywhere.** Login, registration,
   `resend-verification` (email bombing and Resend cost abuse), search,
   playback-token minting, and all uploads are unthrottled.
6. **High — database privilege and RLS.** `.env.example` documents connecting as
   Supabase's `postgres` role, which owns the schema and bypasses RLS; no
   migration enables RLS on any table. `/api/profile` executes
   `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` at runtime on a normal user request,
   confirming the application holds DDL rights.
7. **Medium** — no security headers or CSP; uploads validate only client-supplied
   `Content-Type` with no magic-byte check; verification tokens stored in
   plaintext and passed in URLs; registration reveals whether an email exists;
   `scripts/create-learner.ts` has a hardcoded default password and several
   scripts embed real personal email addresses; `.env.production` is not covered
   by `.gitignore`; `src/auth.ts` falls back to a hardcoded
   `"vercel-build-placeholder"` secret during the build phase; the Prisma
   pool-broken path silently returns empty results instead of erroring; no
   password reset flow exists; `eslint.ignoreDuringBuilds: true`; stale duplicate
   `frontend/` and `backend/` trees are still tracked in git; OAuth access and
   refresh tokens are stored unencrypted.
8. **Low / informational** — `requireSubscription` redirecting in API routes
   *(fixed in Phase 1)*; `/api/admin/health` protected by middleware only;
   `/api/profile` accepts an arbitrary `image` URL; `introVideoMuxPlaybackId`
   returned in catalog JSON; no security or audit logging; missing indexes on
   `Session.userId` and `VerificationToken.token`; no unique constraint on
   `(assignmentId, userId)` for submissions.

### Explicitly NOT vulnerable

- **No SQL injection.** All `$queryRawUnsafe` call sites use static SQL or bound
  `$1..$N` placeholders; `/api/profile` uses parameterized `Prisma.sql`.
- **No stored XSS via lesson content.** `dangerouslySetInnerHTML` does not appear
  anywhere; article bodies render as escaped React text. Article writes are
  admin-only.
- **No committed secrets.** `git ls-files` shows only `.env.example`, and git
  history is clean for `.env*`. No secret is exposed through `NEXT_PUBLIC_*`.
- **No mass assignment.** Role, `published`, `userId`, and price fields cannot be
  injected; URL params override body values where both exist.
- **No SSRF.** No server-side fetch of a user-supplied URL.
- **No Supabase client key in the browser.** The data path is Prisma-only.

### The "AI Mentor" audit area does not exist as a feature

The original audit brief listed AI Mentor as an area to review. There is **no LLM
integration anywhere in the codebase**: no OpenAI, Anthropic, Gemini, `@ai-sdk`,
LangChain, embeddings, pgvector, or chat-completion code in `src/`. "Mentor" here
means a **human** reviewer — the `Mentor` model, public mentor profiles, and
capstone submission grading.

So none of the usual concerns apply today: no prompt injection, no tool-permission
scoping, no RAG authorization boundary, no model API keys to leak, and no
per-request spend to cap. References to "ChatGPT courses" in `SiteFooter.tsx` are
marketing navigation labels, and the `LLM` mentions under `docs/` and the skill
folders are contributor documentation, not product code.

If an AI mentor is built later it needs its own threat model, because it would be
the first feature to combine untrusted student input with privileged data access.

---

## 7. Unverified risks (need staging, config access, or test accounts)

- **Whether file uploads work in production at all.** Vercel's filesystem is
  read-only outside `/tmp`, so `mkdir`/`writeFile` into `public/` likely throws
  `EROFS`. Supporting evidence: `public/avatars`, `public/submission-files`, and
  `public/instructor-photos` **do not exist in the repository**, and
  `public/mentor-photos` contains only 3 files that were committed to git rather
  than written at runtime. This changes Feature 1's attachment work from
  "secure the files" to "build storage", so it needs confirmation on a real
  deployment.
- Production values for `AUTH_SECRET`, the Mux signing keys, and the Postgres role
  actually in use.
- Whether the Supabase Data API is enabled and reachable with an anon key, which
  determines how urgent RLS is.
- Whether any CDN layer caches the playback-token response.
- iOS Safari fullscreen and overlay behaviour on real devices.
- Google OAuth `emailVerified` propagation and its interaction with the
  credentials-path verification requirement.
- Triage of the 30 dependency advisories reported by npm.

---

## 8. Dependency map — what each feature requires

| Feature | Required change | Blocked on |
|---|---|---|
| 1. Paid lesson authorization | Extend `playback-access.ts` into a shared decision module; gate progress routes and the course-access server action; scope instructors to `CourseInstructor`; JSON-throwing subscription guard for APIs | Nothing — **done in Phase 1** |
| 2. Signed Mux playback | Already implemented and migrated. Add user/device binding, configurable TTL plus refresh, `no-store` headers, remove email from watermark payload | Feature 3 for device binding |
| 3. One mobile + one computer | **Requires a revocable server-side session registry**, because JWT sessions cannot currently be invalidated | Design decision below |
| 4. Dynamic watermark | Reuse `HlsPlayer` overlay; server-provided pseudonymous marker; drop email | Feature 3 for the session marker |
| 5. Replacement + monitoring | Reuse Resend and the verification-token pattern, but store hashes; needs storage-backed rate limiting | Infrastructure decision (may incur cost) |

### Recommended approach for Feature 3

Keep the JWT strategy and add a `DeviceSession` table plus an opaque `sid` claim
minted at sign-in and validated against the database on protected requests.
Switching to database sessions would disturb existing cookies, OAuth account
linking, and every currently signed-in user; the `sid` approach delivers real
revocation with a far smaller blast radius.

---

## 9. Migration and deployment strategy

- **Additive schema only** — new tables and nullable columns, so rollback is an
  application revert with no data loss. Phase 1 required no migration at all.
- **Grandfather existing sessions.** A token with no `sid` claim means "register
  this device on the next protected request", never an immediate logout, so
  current students are not signed out during migration.
- **Staged enforcement behind flags** so authorization tightening can be observed
  before it becomes blocking.
- **No destructive resets**, no production migration, no Mux policy change on live
  assets, and no secret rotation without explicit approval.
- **Monitoring during rollout:** login failure rate, playback-token 401/403 rate,
  and incorrectly denied access reports.

---

## 10. Approvals still required

1. Storage backend choice for distributed rate limiting (Phase 5) — may introduce cost.
2. Private object storage for submission files and avatars (finding 2 / Feature 1).
3. Confirmation of production upload behaviour on a real deployment.
4. Any change to live Mux asset policies beyond the already-completed lesson migration.
