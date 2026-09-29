# 01 — Paid Lesson Authorization (Phase 1)

**Branch:** `security/phase0-architecture-review`
**Database migration required:** none.
**Approved decisions applied:** instructors scoped to assigned courses; payment gate
designed now, shaped for Paymob.

---

## 1. Existing implementation discovered

`assertCanAccessLessonPlayback` in `src/server/video/playback-access.ts` was already
a correct, centralized authorization chokepoint for **video playback**: it loaded the
lesson and its real parent course from the database, enforced publication rules,
honoured first-module free previews, and called `hasActiveSubscription` for everyone
else. `hasActiveSubscription` correctly requires both an `ACTIVE` status and an
unexpired period.

The problem was **coverage and scope**, not the core logic:

- Only the playback route used it. Progress endpoints and the course-access server
  action authorized with `requireAuth()` / `auth()` alone.
- `INSTRUCTOR` was treated as privileged platform-wide, with no `CourseInstructor` check.
- `requireSubscription()` used `redirect()`, so API callers received HTML.
- Paid access could be self-granted with no payment (see section 3).

## 2. Security gaps confirmed

| # | Gap | Severity | Status |
|---|---|---|---|
| 1 | Any authenticated user could grant themselves `ALL_ACCESS` with no payment | Critical | Closed |
| 2 | `INSTRUCTOR` bypassed entitlement for every lesson on the platform | High | Closed |
| 3 | Progress read/write accepted any lesson ID from any free account | Medium | Closed |
| 4 | `completeLessonAndGetProgress` server action had no entitlement check | Medium | Closed |
| 5 | Assignment APIs redirected instead of returning JSON 401/403 | Low | Closed |
| 6 | Playback-token response had no explicit anti-cache headers | Low | Closed |

## 3. Design

### Central decision module

`src/server/authz/lesson-access.ts` exposes:

```ts
authorizeLessonAccess({ lessonId, action, viewer }): Promise<LessonAccessGrant>
```

`action` is one of `VIEW_METADATA`, `VIEW_CONTENT`, `PLAY_VIDEO`, `WRITE_PROGRESS`.
The function throws `AppError` 401/403/404 and never redirects, so it is safe in
route handlers, server actions, and server components alike.

Rules, evaluated against database state on every call:

1. Lesson must exist, else 404 (no existence oracle for unauthorized callers).
2. Unpublished lesson, course, or track is visible only to an admin or an
   instructor **assigned to that course**.
3. Admin → granted.
4. Instructor with a matching `CourseInstructor` row → granted.
5. First-module free preview → granted, including guests.
6. Otherwise authentication is required (401), then a fresh entitlement check (403).
7. `PLAY_VIDEO` additionally requires a ready `muxPlaybackId`, else 404.

Instructor scoping is done inside the same query using the **session** user id:

```ts
instructors: { where: { instructorId: viewerUserId ?? "" }, take: 1, select: { instructorId: true } }
```

A guest yields an empty string and therefore never matches. No client-supplied
role, user id, or course id influences the decision.

`playback-access.ts` is now a thin adapter over this module, so the four existing
player call sites are untouched and playback behaviour is unchanged apart from the
intended instructor scoping.

### Payment gate

`src/server/subscription/entitlement.service.ts` introduces the only path that
should activate paid access in production:

```ts
grantEntitlementForVerifiedPayment({ provider, providerEventId, eventType, userId, durationMonths })
```

- **Idempotent.** The `PaymentEvent` row (unique on `(provider, providerEventId)`)
  is claimed first, so duplicate provider deliveries collide there rather than
  extending access twice. A replay returns `applied: false`.
- **Additive expiry.** Remaining time is stacked, never truncated.
- **Server-trusted only.** Duration comes from the server-side plan table; amounts
  and plan data from a client request are never trusted. Callers must verify the
  provider signature (HMAC for Paymob) *before* calling.
- **Validated.** Unknown user, blank event id, and out-of-range duration are rejected.

The historical self-grant is preserved for development but gated:

```ts
isSelfServeGrantEnabled()  // explicit env wins; otherwise NODE_ENV !== "production"
```

`SUBSCRIPTION_SELF_GRANT_ENABLED` defaults to **off in production**. With it off,
`chooseSubscriptionPlan` redirects to `?error=payment_required` instead of granting
access, and `grantSelfServeEntitlement` throws 403. Local and staging flows keep
working unchanged, so no developer or QA workflow breaks.

`createFreeEntitlement` still exists and forwards to the gated path, so existing
callers keep compiling while the unsafe behaviour is removed.

## 4. Files added

| File | Purpose |
|---|---|
| `src/server/authz/lesson-access.ts` | Central lesson authorization decision |
| `src/server/subscription/entitlement.service.ts` | Idempotent payment-gated entitlement writer + self-grant flag |
| `src/server/authz/lesson-access.test.ts` | 16 authorization / bypass tests |
| `src/server/subscription/entitlement.service.test.ts` | 9 payment-gate tests |
| `vitest.config.ts` | Test runner config (none existed) |

## 5. Files modified

| File | Change |
|---|---|
| `src/server/video/playback-access.ts` | Now delegates to `authorizeLessonAccess` |
| `src/server/subscription/subscribe.service.ts` | `createFreeEntitlement` routes through the gate; shared expiry logic extracted |
| `src/server/subscription/require-subscription.ts` | Added `requireSubscriptionApi()` that throws `AppError` |
| `src/app/subscription/actions.ts` | Refuses to grant without payment when the flag is off |
| `src/app/course-access/[courseId]/actions.ts` | Authorizes the lesson before writing progress |
| `src/app/api/learning/progress/lesson/[lessonId]/route.ts` | Authorization on GET and PATCH; `private, no-store` |
| `src/app/api/learning/courses/[courseId]/assignment/route.ts` | Uses `requireSubscriptionApi()` |
| `src/app/api/learning/assignments/[assignmentId]/submit/route.ts` | Uses `requireSubscriptionApi()` |
| `src/app/api/learning/assignments/[assignmentId]/submissions/route.ts` | Uses `requireSubscriptionApi()` |
| `src/app/api/video/playback/[lessonId]/route.ts` | `force-dynamic` + `private, no-store` |
| `package.json` | `test` / `test:watch` scripts, Vitest dev dependency |

Also carried from the preceding Mux hardening: `src/server/content/admin.service.ts`,
`src/app/admin/content/modules/[moduleId]/page.tsx`, and
`src/app/course/[courseId]/CourseCurriculumSidebar.tsx` stop sending
`muxPlaybackId` to the browser (presence-only `hasVideo`), and
`scripts/migrate-mux-lesson-playback-to-signed.ts` gained a `--dry-run` audit mode.

## 6. Database changes

**None.** `Entitlement`, `PaymentEvent`, and the `PAYMOB` provider enum value all
already existed, so no Prisma migration was needed and no production data is affected.

## 7. Tests and actual results

Command: `npm test`

```
 ✓ src/server/subscription/entitlement.service.test.ts (9 tests) 14ms
 ✓ src/server/authz/lesson-access.test.ts (16 tests) 19ms

 Test Files  2 passed (2)
      Tests  25 passed (25)
```

Coverage of the Phase 1 Step 4 matrix:

| Required case | Covered |
|---|---|
| Anonymous user requesting paid lesson | Yes — 401 |
| Free learner requesting paid lesson | Yes — 403 |
| Student accessing owned course | Yes — grant reason `SUBSCRIPTION` |
| Expired / revoked entitlement | Yes — grant then deny after revocation |
| Preview lesson | Yes — guest granted, entitlement never consulted |
| Non-first module not treated as preview | Yes |
| Instructor accessing own course | Yes — `COURSE_INSTRUCTOR` |
| Instructor cross-course access | Yes — 403 |
| Manipulated / non-existent lesson ID | Yes — 404 |
| Client-supplied role ignored | Yes — decision uses session roles only |
| Instructor lookup bound to session user id | Yes — asserts the query filter |
| Unpublished lesson / course / track hidden | Yes — 403 |
| `PLAY_VIDEO` without a ready video | Yes — 404 |
| Payment replay idempotency | Yes — `applied: false`, no second write |
| Self-grant refused in production | Yes — 403, no entitlement write |

`npx tsc --noEmit`: no errors in any file changed by this phase. Seven pre-existing
errors remain in `next.config.ts` and `src/components/learn/useCourseCarouselMetrics.ts`,
neither of which this work touches.

### Not yet covered

- Refunded payments. There is no refund event handling anywhere in the codebase and
  no provider integration to model it against; this needs a product decision on
  whether a refund revokes access immediately or at period end.
- Private attachment access, because submission files are still served statically
  from `public/` (architecture review finding 2). Securing them requires the
  storage decision, not an authorization change.
- Route-level integration tests. The 25 tests are unit tests over the decision
  module with Prisma mocked; end-to-end HTTP tests belong to Phase 6 and need a
  test database.

## 8. Potential regressions to watch

1. **Instructors lose platform-wide content access.** This is the intended change,
   but any instructor who relied on browsing unassigned courses will now get 403.
   Assign them via `CourseInstructor` or grant ADMIN.
2. **Progress endpoints now return 403** for users without entitlement. If any UI
   calls them on public pages for non-subscribers, it must tolerate 403. Course and
   track progress routes were deliberately left on `requireAuth()` because they are
   user-scoped aggregates that expose no paid content and no cross-user data.
3. **Assignment APIs now return JSON 401/403** instead of an HTML redirect. Clients
   that followed the redirect and parsed a 200 need to handle status codes.
4. **Subscribing is disabled in production** until Paymob is wired or
   `SUBSCRIPTION_SELF_GRANT_ENABLED=true` is set deliberately. This is the point of
   the change, but it is user-visible and must be communicated before deploy.

## 9. Remaining vulnerabilities and limitations

- Submission files remain publicly reachable at `/submission-files/{fileKey}`.
- Sessions still cannot be revoked; a demoted or deleted user keeps a working token
  for up to 30 days. Authorization now re-reads entitlement on every decision, so
  **entitlement** revocation is immediate, but **role** revocation is not.
- No rate limiting on any endpoint.
- Signed Mux URLs remain shareable for the token lifetime (Phase 2).
- No Paymob webhook route exists yet; the entitlement writer is ready for one.

## 10. Requires developer approval before proceeding

1. Private storage choice for submission files and avatars.
2. Refund and cancellation policy (immediate revocation vs end of period).
3. Confirmation that disabling production self-subscribe is acceptable now, or a
   decision to set `SUBSCRIPTION_SELF_GRANT_ENABLED=true` until Paymob is live.
