# 02 — Signed Mux Playback (Phase 2)

**Branch:** `security/phase0-architecture-review`
**Database migration required:** none.

---

## 1. Existing implementation discovered

Signed playback was **already implemented** before this phase, and correctly:

- Both lesson upload paths request `playback_policy: ["signed"]`.
- `getSignedPlaybackForLesson` mints a Mux JWT only after authorization passes.
- The player fetches `/api/video/playback/[lessonId]` and never receives a raw
  playback ID; no `muxPlaybackId` reaches the browser.
- Signing is fail-closed: a missing `MUX_SIGNING_KEY_ID` / `MUX_PRIVATE_KEY`
  yields 503 rather than an unsigned URL.
- The seven legacy public lesson assets were migrated to signed playback and
  their public playback IDs deleted; a previously working public `.m3u8` URL now
  returns 404.

So this phase hardened what existed rather than building it.

## 2. What Mux can and cannot enforce

**This constraint shaped the whole design and is worth stating plainly.**

A Mux signed playback token is validated only against:

- the signature (your signing key),
- `exp` (expiry),
- `aud` (video / thumbnail / gif / storyboard),
- `sub` (the playback ID).

Mux **does not validate custom JWT claims**. There is no supported way to make
Mux reject a request because it came from the wrong user, the wrong device, or
the wrong IP address. Embedding a user id in the token would be decorative.

Therefore "binding playback to a student" is enforced in three layers we do control:

1. **At issuance.** Only an authorized session can obtain a token. From Phase 3,
   only a registered device session will be able to obtain one.
2. **By lifetime.** A copied URL stops working when the token expires, so the
   token lifetime *is* the sharing window. This is the main lever, and this phase
   is mostly about making it short without breaking playback.
3. **By attribution.** Watermarking (Phase 4) deters the residual case of a
   student screen-recording content they are legitimately watching.

Anyone claiming a signed Mux URL can be cryptographically locked to one viewer is
mistaken; the honest control is a short lifetime plus attribution.

## 3. Security gaps closed

| # | Gap | Severity | Change |
|---|---|---|---|
| 1 | `watermarkText` returned the student's **email address** and raw user id to the browser | Medium (privacy) | Replaced with an opaque HMAC-derived marker |
| 2 | Token lifetime defaulted to **1 hour**, so a copied URL worked for up to an hour | Medium | Default reduced to 30 minutes, rolled during playback, clamped to a sane range |
| 3 | A misconfigured env var could mint effectively permanent URLs | Medium | Lifetime clamped to 60 s – 12 h with validated parsing |
| 4 | The token was usable for thumbnails, gifs, and storyboards of the same asset | Low | Restricted to `type: "video"` |
| 5 | Authorization was checked once per page view | Low | Each token roll re-runs authorization, so revoked access halts playback |
| 6 | Playback response had no explicit anti-cache headers | Low | `private, no-store` + `force-dynamic` (landed in Phase 1) |

## 4. Design

### Pseudonymous watermark marker

`src/server/video/watermark.ts` derives a stable, non-reversible marker:

```
HMAC-SHA256(secret, "watermark:v1:" + userId) → 10 chars → "XXXXX-XXXXX"
```

- Uses a Crockford-style alphabet with no `I`, `L`, `O`, or `U`, so a code read
  off a screenshot is unambiguous.
- Stable per user, so repeat leaks are attributable to one account.
- Opaque: the browser never receives an email, name, or user id.
- `matchesWatermarkMarker` resolves a marker seen in a leaked recording back to a
  user. **Server/CLI only — it must never be exposed over HTTP**, or it becomes
  an account-enumeration oracle.
- Secret resolution: `WATERMARK_SECRET`, else `AUTH_SECRET`, else
  `NEXTAUTH_SECRET`. Throws when none is set rather than falling back to a
  constant. Setting a dedicated `WATERMARK_SECRET` is recommended so rotating the
  auth secret does not invalidate historical markers.

### Rolling short-lived tokens

The player now keeps the stream alive while the credential underneath it changes:

1. `/api/video/playback/[lessonId]` returns `playbackUrl`, `token`, and
   `expiresAt` (epoch millis).
2. `AuthorizedHlsPlayer` stores the token in a ref and schedules a refresh at 60 %
   of the remaining lifetime.
3. The refresh re-fetches a fresh token and updates the ref **without touching
   `src`**, so hls.js keeps its buffer and the learner sees no interruption.
4. `HlsPlayer` accepts a `resolveUrl` hook wired into the hls.js `xhrSetup`
   config, which swaps the `token` query parameter on every manifest and segment
   request for the current one.

Because each refresh calls the authorizing endpoint, a learner whose entitlement
is revoked mid-lesson receives 401/403 on the next roll and playback stops with a
reason. This turns a one-time check into a continuous one.

### Browser support, stated honestly

`HlsPlayer` uses native HLS on Safari and iOS (`video.src = src`) and hls.js
elsewhere. **Native HLS exposes no request hook**, so token rewriting is
impossible there. On those browsers an expired token surfaces as a fatal media
error, and the component now reloads with a fresh token and resumes from the
observed playback position instead of giving up after one attempt. Reloads are
capped at 5 with a 3-second floor between attempts so a genuinely broken stream
cannot spin.

Net effect: seamless on Chrome/Firefox/Edge/Android, a brief rebuffer at most
once per 30 minutes on Safari/iOS for lessons longer than the token lifetime.

### Why 30 minutes

Short enough that a URL pasted into a group chat is usually dead before anyone
opens it; long enough that Safari users rarely hit a reload. Tunable per
environment via `MUX_SIGNED_PLAYBACK_TTL_SECONDS` (preferred) or
`MUX_PLAYBACK_TOKEN_TTL` (Mux duration string). Values are clamped to 60 s–12 h,
so a typo cannot produce a long-lived URL.

## 5. Files added

| File | Purpose |
|---|---|
| `src/server/video/watermark.ts` | Pseudonymous viewer marker derivation and lookup |
| `src/server/video/watermark.test.ts` | 9 tests: stability, opacity, no PII, secret handling |
| `src/server/video/mux.test.ts` | 9 tests: lifetime parsing, clamping, URL shape |

## 6. Files modified

| File | Change |
|---|---|
| `src/server/video/mux.ts` | `playbackTTLSeconds()` with duration parsing, clamping, 30-minute default |
| `src/server/video/video.service.ts` | Returns `token` + `expiresAt`; `type: "video"`; opaque watermark marker |
| `src/app/api/video/playback/[lessonId]/route.ts` | Returns `token` + `expiresAt` |
| `src/components/video/HlsPlayer.tsx` | New `resolveUrl` prop wired into hls.js `xhrSetup` |
| `src/components/video/AuthorizedHlsPlayer.tsx` | Token refresh scheduling, URL rewriting, position-preserving reload |

## 7. Tests and actual results

Command: `npm test`

```
 ✓ src/server/video/watermark.test.ts (9 tests)
 ✓ src/server/authz/lesson-access.test.ts (16 tests)
 ✓ src/server/subscription/entitlement.service.test.ts (9 tests)
 ✓ src/server/video/mux.test.ts (9 tests)

 Test Files  4 passed (4)
      Tests  43 passed (43)
```

New coverage in this phase:

| Case | Covered |
|---|---|
| Marker stable for the same user | Yes |
| Marker differs between users | Yes |
| Marker contains no user id and no `@` | Yes |
| Marker changes with the secret (not guessable) | Yes |
| Derivation refuses to run with no secret configured | Yes |
| Leaked-marker lookup matches its owner, case/whitespace tolerant | Yes |
| Leaked-marker lookup rejects another user's marker | Yes |
| Malformed marker rejected without throwing | Yes |
| Default lifetime is 30 minutes | Yes |
| Seconds value preferred over duration string | Yes |
| `90s` / `15m` / `2h` parsed correctly | Yes |
| Excessive lifetime clamped to 12 h | Yes |
| Implausibly short lifetime raised to 60 s | Yes |
| Unparseable or zero input falls back to the default | Yes |
| Signed URL shape and token parameter | Yes |

`npx tsc --noEmit` and `npm run lint`: no errors or warnings in any file changed
by this phase.

### Not covered by automated tests

- The browser-side refresh loop and `xhrSetup` rewriting. These need a real
  `MediaSource`, a live Mux asset, and a running browser, so they belong to a
  Playwright suite (Phase 6) rather than a jsdom unit test.
- Whether Mux accepts a segment request signed with a *different but valid* token
  than the one used to fetch the manifest. The design depends on this, and it is
  consistent with how Mux validates each request independently, **but it must be
  confirmed against a live asset before this ships.** See the verification steps below.

## 8. Manual verification required before deploy

Run these against a staging deployment with a real signed asset:

1. **Rolling token works.** Set `MUX_SIGNED_PLAYBACK_TTL_SECONDS=90`, play a
   lesson longer than 3 minutes in Chrome, and confirm playback continues past
   the 90-second mark with no stall. In the network panel, segment requests should
   show a changing `token` parameter.
2. **Copied URLs expire.** Copy the `.m3u8` URL from the network panel, wait past
   the lifetime, then request it in a private window. Expect 403 from Mux.
3. **Revocation stops playback.** While a lesson is playing, revoke the learner's
   entitlement in the database. At the next refresh the player should stop and
   show the subscription message.
4. **Safari/iOS.** Play a lesson longer than the lifetime on iOS and confirm it
   recovers at the token boundary and resumes near the same position.
5. **No PII in responses.** Inspect the playback response body and confirm
   `watermarkText` is an opaque `XXXXX-XXXXX` code with no email address.

## 9. Remaining limitations

- A signed URL is still shareable for up to the token lifetime. This is inherent
  to Mux signed playback and is mitigated, not eliminated.
- Tokens are not yet tied to a device; that arrives with Phase 3, which gates the
  issuing endpoint on a registered device session.
- The watermark marker is returned but **not yet rendered** — Phase 4.
- There is still no audit record of who requested playback for which lesson, so a
  leaked marker can be attributed to an account but not to a specific session or
  time. Planned for Phase 5 alongside security-event logging.
- No rate limit on token minting, so the endpoint can be called repeatedly by an
  authorized account.

## 10. Recommended environment settings

```
# Preferred: explicit seconds. Clamped to 60..43200.
MUX_SIGNED_PLAYBACK_TTL_SECONDS=1800

# Dedicated watermark secret so rotating AUTH_SECRET does not change
# historical markers.
WATERMARK_SECRET=<32+ random bytes, base64>
```
