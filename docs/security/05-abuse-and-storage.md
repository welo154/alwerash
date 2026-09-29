# Phase 5 — Abuse controls, account recovery, storage, and database privilege

Closes the remaining findings from `00-architecture-review.md` except payments.
Branch: `security/phase5-hardening`, stacked on `perf/measurement`.

## 1. What changed

| Finding (review §6) | Change |
|---|---|
| 5. No rate limiting | Postgres fixed-window limiter on sign-in, registration, verification and reset emails, reset submissions, search, playback-token minting, and uploads |
| 2. Submissions publicly served | Uploads go to object storage; submissions to a private bucket read only through the authorized route |
| 7. Uploads trust client `Content-Type` | Type is detected from the file's bytes; HTML/SVG and anything unrecognised is rejected |
| 7. Verification tokens stored in plaintext | Stored as SHA-256; the raw value exists only in the emailed link |
| 7. Registration reveals existing emails | Same response for new and existing addresses; the existing owner is emailed a sign-in / reset notice |
| 7. No password reset | `/forgot-password` and `/reset-password`; completing a reset signs out every device |
| 7. No security headers | nosniff, frame DENY, referrer, permissions, HSTS; CSP in **report-only** |
| 7. Hardcoded password / real emails in scripts | Scripts take arguments; no defaults |
| 7. `.env.production` not ignored | `.gitignore` covers `.env.*` except `.env.example` |
| 8. No audit logging | `security_events` table: sign-in success/failure/limited, registration, verification, reset, device displacement |
| 8. `/api/profile` accepts any image URL | Only the user's own uploads, their Google avatar, or their current value |
| 6. Runtime DDL in `/api/profile` | Removed; the columns exist through a migration |
| 6. RLS disabled, app holds DDL rights | Migration enables RLS everywhere and revokes Data API roles; script for a least-privilege runtime role |
| Phase 3 bug | Device row inserted on every server-rendered request for legacy cookies (fixed in PR #2) |

## 2. Rate limiting

`src/server/security/rate-limit.ts`. One upsert per check into
`rate_limit_buckets`; keys are `<rule>:<HMAC(identifier)>`, so no raw email or IP
is stored. Rows older than a day are pruned opportunistically.

| Rule | Limit |
|---|---|
| Sign-in per email | 10 / 15 min |
| Sign-in per IP | 60 / 15 min |
| Registration per IP | 20 / hour |
| Emails per address (verify, reset, account-exists) | 3 / hour |
| Emails per IP | 30 / hour |
| Reset submissions per IP | 20 / 15 min |
| Search per IP | 120 / min |
| Playback tokens per viewer | 60 / min |
| Uploads per user | 30 / hour |

Per-IP limits are loose on purpose: Egyptian mobile carriers put many subscribers
behind one address (carrier-grade NAT). The per-account limits do the real work.

**Fails open.** If the table is missing or the database errors, requests are
allowed and one error is logged. A broken limiter must not lock students out.
A limited sign-in looks like a wrong password to the client.

## 3. Password reset

- Link valid 1 hour, single use, and requesting again invalidates the previous one.
- Reset tokens share `verification_tokens` under the `password-reset:` identifier
  prefix; each flow refuses the other's tokens.
- Completing a reset sets the password, marks the email verified (the link proves
  ownership), and revokes every device session.
- The page removes the token from the address bar on load so Clarity session
  recording and browser history do not capture a working link.

### Revocation now always applies

`DEVICE_SESSION_ENFORCEMENT` previously disabled the revocation check entirely,
which would have made "reset signs you out everywhere" untrue. It now controls
only whether a new sign-in displaces an older device. Explicit revocations are
always enforced. Cost: one primary-key lookup per protected request.

A revoked device is sent to `/login?error=device_revoked`. Middleware lets that
URL through despite the (still validly signed) cookie, and the page clears it.

**Limitation:** a cookie issued before device sessions existed has no `sid` and
survives a reset until it next reaches `/api/auth/session`, where it is registered
fresh. After deploy, every active browser gets a `sid` on its first page load, so
this window closes quickly for real users.

## 4. Storage

`src/server/storage/object-storage.ts` talks to Supabase Storage over REST with the
service-role key (server-only).

| Bucket | Visibility | Contents |
|---|---|---|
| `private-uploads` | Private | `submissions/<file>` — served only by `/api/learning/submissions/files/[fileKey]` after `canAccessSubmissionFile` |
| `public-images` | Public | `avatars/`, `mentor-photos/`, `instructor-photos/` |

Object names carry a random suffix, so a replaced photo gets a new URL and no CDN
serves the old one. Without Supabase configuration, `next dev` writes to `.data/`
(private) and `public/uploads/` (public); production refuses rather than writing to
a read-only disk.

Downloads are served with the type detected from the bytes, `nosniff`, and
`private, no-store`.

## 5. Database privilege

- `prisma/migrations/20260929130000_enable_rls_lock_data_api` enables RLS on every
  `public` table and revokes `anon`/`authenticated` privileges. The app connects as
  the table owner, which bypasses RLS, so app behaviour is unchanged. **New tables
  in later migrations need `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` added by
  hand.**
- `scripts/sql/create-app-role.sql` (run manually, not a migration) creates
  `alwerash_app`, which can read and write rows but cannot change schema. The
  runtime `DATABASE_URL` switches to it; migrations keep using `postgres` via
  `DIRECT_URL`.

## 6. Deployment steps (require approval)

1. Apply migrations: `npx prisma migrate deploy`. Adds `rate_limit_buckets`,
   `security_events`, a token index, then RLS. Additive; rollback is a code revert.
   Until applied, rate limiting and event logging are inactive but nothing breaks.
2. Create the two Supabase Storage buckets (`private-uploads` private,
   `public-images` public), then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   on Vercel. **Uploads do not work in production until this is done.**
3. Optionally run `create-app-role.sql` and switch the runtime `DATABASE_URL`.
4. After a week of real traffic, review CSP violation reports in the browser
   console, adjust hosts, then rename the header to `Content-Security-Policy`.

Existing verification links (sent before deploy, stored in plaintext) stop working;
users can request a new one.

## 7. Remaining limitations

- Pages that call `auth()` directly (e.g. `/home`, `/profile`) still render for a
  revoked device; protected content, playback, and every guarded API reject it.
- Roles are read from the JWT, so removing a role takes effect when the user's
  sessions are revoked, not immediately.
- Sign-in with an unknown email skips the password hash, so response timing can
  still distinguish unknown emails. The per-IP limit bounds how fast that can be
  probed.
- The CSP allows `'unsafe-inline'` scripts, because Next.js inlines its bootstrap
  script and no nonce is plumbed through.
- No new-device email confirmation. The event log records displacements, which
  gives an admin the data to spot account sharing.

## 8. Tests

38 new tests (149 total): rate-limit windows, hashing, case-insensitivity,
fail-open, and 429; file-type detection including HTML/SVG disguised as images;
storage key traversal; profile image allow-list; reset single-use, expiry,
supersession, cross-flow token rejection, device revocation; hashed verification
tokens; identical registration result for new and existing emails; and the
device-registration regression.
