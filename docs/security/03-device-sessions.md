# 03 — Device Sessions (Phase 3)

**Branch:** `security/phase0-architecture-review`
**Database migration:** `prisma/migrations/20260921120000_add_device_sessions` — **additive only**.
**Default state after deploy:** registration on, enforcement **off**. See section 7.

Goal: one active mobile device and one active laptop/desktop per student.

---

## 1. The blocking constraint

The app uses NextAuth's **JWT session strategy**. A signed cookie is
self-contained: `auth()` decodes it and never asks the database whether the user
still exists, is still an admin, or is still allowed in. With no `maxAge`
configured, NextAuth's 30-day default applied.

So before this phase there was **nothing to attach a device to, and no way to
sign a device out**. Revoking a role, deleting a user, or changing a password had
no effect on an issued cookie. The `Session` table existed in the schema but was
dead code under the JWT strategy.

Device limits are meaningless without revocation, so revocation had to be built
first.

## 2. Design decision: `sid` claim over database sessions

Two options were available.

**Switch to `strategy: "database"`.** This is the idiomatic NextAuth answer and
gives revocation for free. It was rejected because it invalidates every existing
cookie (signing out all current students), changes how OAuth account linking
behaves, and rewrites the session read path that every page and route depends on.
That is a large blast radius for a feature that can be delivered without it.

**Keep JWT and add a session registry (chosen).** Each sign-in creates a
`DeviceSession` row, and its id travels in the cookie as an opaque `sid` claim.
Protected requests confirm the row is still `ACTIVE`. This delivers real
revocation, keeps every existing cookie working, and touches only the auth
callbacks and the request guards.

### Why `sid` is not hashed

The `sid` is only meaningful inside a cookie signed with `AUTH_SECRET`. An
attacker holding the value cannot mint a usable session without the signing
secret, so hashing would add storage and lookup complexity for no attacker-facing
benefit. Storing it as the row's primary key also keeps the admin device list and
any future audit trail directly joinable.

### Why enforcement lives in the guards, not middleware

`src/middleware.ts` runs on the Edge runtime, where Prisma cannot run, so the
registry cannot be consulted there. The check therefore lives in `requireAuth`,
`requireRole`, `requireSubscription`, `requireSubscriptionApi`, the playback
token endpoint, and the course-access server action — the paths that actually
gate protected data.

## 3. Schema

```prisma
model DeviceSession {
  id            String              @id @default(cuid())  // == the `sid` claim
  userId        String              @map("user_id")
  kind          DeviceKind                                // MOBILE | COMPUTER
  status        DeviceSessionStatus @default(ACTIVE)       // ACTIVE | REVOKED
  label         String?                                    // "Chrome on Windows"
  userAgent     String?             @map("user_agent")
  ipHash        String?             @map("ip_hash")        // HMAC, never a raw IP
  createdAt     DateTime            @default(now())
  lastSeenAt    DateTime            @default(now())
  revokedAt     DateTime?
  revokedReason String?

  @@index([userId, status])
  @@index([userId, kind, status])
}
```

The migration creates two enums and one table with `IF NOT EXISTS` / duplicate-safe
`DO` blocks, matching the repository's existing migration style. **No existing
table or column is altered**, so rolling back is an application revert with no
data loss.

The one-per-kind rule is enforced in application code inside a transaction rather
than by a partial unique index, because `REVOKED` rows must be retained as history
for the same `(userId, kind)` pair.

## 4. Behaviour

**Sign-in.** The `jwt` callback deletes any inherited `sid`, then calls
`registerDeviceSession`, which reads the request's `User-Agent` and
`X-Forwarded-For` via `next/headers`, classifies the device, revokes any other
`ACTIVE` session of the same kind (when enforcement is on), and creates the new
row. Registration failure is logged and never blocks sign-in.

**Grandfathering.** With the JWT strategy the `jwt` callback runs on every session
read and re-encodes the cookie, which is how the existing role-hydration
(`token.roles == null`) works. The same mechanism mints a `sid` for cookies issued
before this feature shipped. **No current student is signed out**, and a legacy
cookie becomes a registered device on its next request.

**Enforcement.** A displaced device keeps a validly signed cookie, so it is only
stopped by the registry check, which returns `401 DEVICE_SESSION_REVOKED`. The
video player recognizes that code and shows "This device was signed out because
the account was used on another device" rather than a generic sign-in prompt.

**Video specifically.** The playback endpoint asserts the device session before
minting a token. Combined with Phase 2's rolling tokens, a displaced device stops
receiving fresh tokens and playback halts within the token lifetime. This is where
"one phone and one computer" becomes real for paid content, because Mux itself
cannot check who is asking.

**Sign-out.** `events.signOut` revokes the row so the slot is freed immediately.

**Last-seen tracking** is throttled to one write per 5 minutes per session, and a
failed write never fails the request.

## 5. Device classification

`classifyDeviceKind` is a hand-written matcher over the `User-Agent` string. No
new dependency was added: a UA-parsing library would pull a large regex database
to answer a two-way question.

- Phones, tablets, e-readers → `MOBILE`. **Tablets count as mobile**, so a phone
  plus an iPad cannot occupy both slots.
- Windows, macOS, Linux, ChromeOS → `COMPUTER`.
- Unknown or missing → `COMPUTER`, deliberately. Mobile is the more commonly
  shared slot, and defaulting unknown clients to mobile would let a scripted
  client squat it.

**The `User-Agent` is client-controlled, so this is a usability heuristic, not a
security boundary.** A student can spoof it to choose which slot they occupy. What
they cannot do is exceed the cap, because the count is enforced server-side
regardless of what the header claims. Worst case, a determined user holds two
sessions by spoofing one as a computer — which is exactly the two devices the
feature grants them anyway.

### Known classification gap

iPadOS 13+ Safari requests desktop sites by default and reports
`Macintosh; Intel Mac OS X` with **no iPad token**, so such an iPad is classified
`COMPUTER`. There is no reliable server-side signal to distinguish it from a real
Mac. Client hints would not help, since Safari does not send them. This is
accepted: the student still gets two devices total.

## 6. IP handling

Raw IP addresses are never stored. `hashClientIp` keeps a 128-bit HMAC prefix so
Phase 5 can compare sign-in locations without holding personal data, keyed by
`DEVICE_IP_HASH_SECRET` (falling back to `AUTH_SECRET`).

## 7. Rollout — enforcement is OFF by default

`DEVICE_SESSION_ENFORCEMENT` must be explicitly set to `true` or `1`. Until then:

- Device sessions **are** created and tracked, including for grandfathered cookies.
- A new sign-in never displaces an older device.

> **Changed in Phase 5.** The flag originally disabled the revocation check as well.
> It now controls displacement only: a session revoked explicitly (sign-out, password
> reset) is rejected whatever the flag says, because a password reset that leaves the
> attacker signed in is not a reset. See `05-abuse-and-storage.md`.
>
> **Fixed in Phase 5.** Legacy-cookie registration ran inside every server-component
> `auth()` call, whose re-encoded cookie Next.js discards, so each page load inserted
> another row. Registration now happens only in the NextAuth route handler, which
> `/api/auth/session` reaches on every client page load.

This is deliberate. It lets the registry fill with real data and be inspected
before any student can be signed out. Recommended sequence:

1. Deploy with the flag unset. Confirm `device_sessions` fills and that the
   `MOBILE`/`COMPUTER` split matches expectations.
2. Query for users with several active sessions of one kind to size the impact.
3. Set `DEVICE_SESSION_ENFORCEMENT=true` and watch the `401 DEVICE_SESSION_REVOKED`
   rate.

Rollback is unsetting the flag; the table can stay.

## 8. Files added

| File | Purpose |
|---|---|
| `prisma/migrations/20260921120000_add_device_sessions/migration.sql` | Additive migration |
| `src/server/auth/device-classification.ts` | UA classification, labels, IP hashing |
| `src/server/auth/device-session.ts` | Registry: register, check, assert, revoke, list |
| `src/server/auth/device-classification.test.ts` | 14 tests |
| `src/server/auth/device-session.test.ts` | 22 tests |

## 9. Files modified

| File | Change |
|---|---|
| `prisma/schema.prisma` | `DeviceSession` model, `DeviceKind` / `DeviceSessionStatus` enums, `User.deviceSessions` |
| `src/auth.ts` | Mints `sid` on sign-in and for legacy cookies; revokes on sign-out |
| `src/types/next-auth.d.ts` | `JWT.sid`, `Session.user.deviceSessionId` |
| `src/server/auth/require.ts` | `requireAuth` asserts the device session |
| `src/server/subscription/require-subscription.ts` | API variant throws 401; page variant redirects to `/login?error=device_revoked` |
| `src/server/video/video.service.ts` | Playback tokens require an active device session |
| `src/app/api/video/playback/[lessonId]/route.ts` | Passes `deviceSessionId` |
| `src/app/course-access/[courseId]/actions.ts` | Asserts the device session |
| `src/server/lib/errors.ts` | New `DEVICE_SESSION_REVOKED` error code |
| `src/components/video/AuthorizedHlsPlayer.tsx` | Reads the error code and shows the device message |

## 10. Tests and actual results

Command: `npm test`

```
 ✓ src/server/auth/device-classification.test.ts (14 tests)
 ✓ src/server/auth/device-session.test.ts        (22 tests)
 ✓ src/server/authz/lesson-access.test.ts        (16 tests)
 ✓ src/server/video/watermark.test.ts             (9 tests)
 ✓ src/server/video/mux.test.ts                   (9 tests)
 ✓ src/server/subscription/entitlement.service.test.ts (9 tests)

 Test Files  6 passed (6)
      Tests  79 passed (79)
```

New coverage in this phase:

| Case | Covered |
|---|---|
| Phones classified MOBILE; tablets also MOBILE | Yes |
| Desktop platforms classified COMPUTER | Yes |
| Unknown/missing UA defaults to COMPUTER | Yes |
| Edge preferred over the Chrome token it contains | Yes |
| IP hashed, never stored raw; stable; secret-dependent | Yes |
| First entry of an `X-Forwarded-For` chain used | Yes |
| Registration records the kind from the request UA | Yes |
| Registering revokes the existing same-kind session | Yes |
| Registration only inspects the same kind (phone does not displace a laptop) | Yes |
| Nothing revoked while enforcement is disabled, but rows still created | Yes |
| Registration survives being called with no request headers | Yes |
| Missing `sid` reports LEGACY without a database read | Yes |
| Revoked session reports REVOKED with its reason | Yes |
| Another user's `sid` reports UNKNOWN (no existence oracle) | Yes |
| Non-existent `sid` reports UNKNOWN | Yes |
| Last-seen write throttled when recent, performed when stale | Yes |
| Failed last-seen write does not fail the request | Yes |
| Revoked session raises 401 | Yes |
| Legacy cookie allowed through (no forced sign-out) | Yes |
| Enforcement disabled skips the database entirely | Yes |
| Revoke scoped to the owning user; cross-user revoke reports false | Yes |
| Revoke-all returns the affected count | Yes |

`npx tsc --noEmit` and `npm run lint`: no errors or warnings in any file changed
by this phase.

### Not covered by automated tests

- The NextAuth `jwt` callback integration, including grandfathering. This needs a
  real sign-in with cookie round-tripping, so it belongs to the Phase 6
  end-to-end suite. **The grandfathering path is the highest-risk untested area
  and must be verified on staging** — see step 1 below.
- Concurrent sign-ins from two devices racing on the same slot. The revoke and
  create run in one transaction, but the isolation behaviour under real
  concurrency is unverified.
- The `next/headers` read inside the `jwt` callback. It works because the NextAuth
  route handler runs in a request scope, and it fails closed to
  `COMPUTER`/`null`, but it is not exercised against a live request.

## 11. Manual verification required before enabling enforcement

1. **Grandfathering.** With an existing signed-in session from before deploy,
   load any protected page. Confirm the student is **not** signed out and that a
   `device_sessions` row now exists for them.
2. **Classification.** Sign in from a phone and a laptop; confirm one `MOBILE`
   and one `COMPUTER` row with sensible labels.
3. **Displacement.** With `DEVICE_SESSION_ENFORCEMENT=true`, sign in on a second
   phone. The first phone should receive the device message on its next protected
   request, and the laptop should keep working.
4. **Video halt.** Start a lesson on phone A, sign in on phone B, and confirm
   playback on A stops within the token lifetime with the device message.
5. **Sign-out frees the slot.** Sign out on the laptop, sign in on a different
   laptop, and confirm no displacement message appears.

## 12. Remaining limitations

- **Replacement is silent and immediate.** A new same-kind sign-in displaces the
  old device with no verification, which is Phase 5's job. Until then, an attacker
  who has a student's password can displace the legitimate device without a
  second factor. Note this is not a regression: today they would simply share the
  session.
- **No device list UI.** `listActiveDeviceSessions` exists but nothing renders it,
  so students cannot see or revoke their own devices yet.
- **Password changes do not revoke sessions.** `revokeAllDeviceSessions` exists
  and is unused, because there is still no password reset flow.
- **Role revocation is still stale.** Roles remain cached in the JWT; this phase
  makes *sessions* revocable, not *roles*. Demoting an admin still requires the
  cookie to expire or the device to be revoked explicitly.
- **Admin-initiated revocation** is not exposed anywhere.
- **No audit events.** Displacements are recorded only as `revokedReason` on the
  row, not as queryable security events. Phase 5.
- **Enforcement adds one indexed query** to protected requests. This should be
  monitored after enabling the flag.

## 13. Environment

```
# Enable only after confirming the registry fills correctly (section 7).
DEVICE_SESSION_ENFORCEMENT=false

# Optional: dedicated secret for IP hashing. Falls back to AUTH_SECRET.
DEVICE_IP_HASH_SECRET=<32+ random bytes, base64>
```
