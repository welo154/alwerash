# 04 — Dynamic Student Watermark (Phase 4)

**Branch:** `security/phase0-architecture-review`
**Database migration required:** none.
**Visibility:** subtle, slowly repositioning (per approval).

---

## 1. What this control is for

Phases 1–3 stop unauthorized viewers: paid content requires an entitlement, URLs
are signed and short-lived, and a student is limited to one phone and one computer.
None of that stops a student from screen-recording content **they are legitimately
entitled to watch**.

Watermarking does not prevent that either. It makes it **attributable**: a leaked
recording carries a marker that identifies the account it came from. That changes
the incentive, which is the realistic goal.

This should not be oversold. A determined technical user can remove a client-side
overlay with devtools before recording. Preventing that would require server-side
burn-in during transcoding, which Mux does not offer on the current plan — and
which would not work anyway, since one encoded rendition serves every viewer and a
per-viewer mark by definition cannot be baked into a shared encode.

## 2. What was already in place

Phase 2 already derived the marker and returned it from the playback endpoint:

- `viewerWatermarkMarker(userId)` in `src/server/video/watermark.ts` produces a
  stable, non-reversible `XXXXX-XXXXX` code via HMAC-SHA256.
- `/api/video/playback/[lessonId]` returns it as `watermarkText`.

Before Phase 2 that field contained the student's **email address and raw user
id**, and before this phase nothing rendered it. So Phase 4 is the rendering half
of work whose server side already existed.

## 3. Design

### Placement

`VideoWatermark` renders inside `HlsPlayer`'s inner frame, positioned between the
`<video>` element and the custom control bar. That position matters for three
reasons:

1. It is inside the element passed to `requestFullscreen()`, so **the marker
   survives desktop fullscreen**. An overlay outside that element would vanish
   exactly when a recording is most likely.
2. It is inside the `overflow-hidden` frame, so it can never spill outside the
   video.
3. It is before the control bar in DOM order, so it paints under the controls and
   never obscures them.

The overlay is `pointer-events: none` and `aria-hidden`, so it cannot intercept
clicks (the video element handles play/pause on click) and is not announced to
screen readers.

### Movement

Six anchor points are used, all clear of the bottom control strip and of dead
centre. The marker moves to the next anchor every 25 seconds with a 2-second
ease transition.

The reason to move it is cropping: a fixed corner marker is trivially removed by
cropping that corner. Cycling means a crop that removes the marker in one position
retains it in the next, so a clean recording requires either cropping most of the
frame or editing every cycle.

The starting anchor is derived from the marker text itself, so two students
watching the same lesson do not carry the marker in the same place at the same
time. This matters if two people compare recordings to work out how to crop it.

`prefers-reduced-motion: reduce` disables the transition. The marker still
repositions, it simply jumps rather than drifting, since slow drifting text is
uncomfortable for some viewers.

### Appearance

White at 32% opacity with a dark text shadow, so it stays legible over both bright
and dark frames without being distracting; `clamp(9px, 1vw, 13px)` so it scales
with the player and stays readable in fullscreen; tabular numerals and wide letter
spacing so a code read off a compressed recording is unambiguous. That pairs with
the server-side alphabet choice, which omits `I`, `L`, `O`, and `U`.

### Guests

`watermarkText` is null for anonymous free-preview viewers, so no overlay renders.
There is no account to attribute a leak to, and marking a public preview would add
friction with no benefit.

## 4. Files added

| File | Purpose |
|---|---|
| `src/components/video/VideoWatermark.tsx` | Overlay component, anchors, movement, staggering |
| `src/components/video/VideoWatermark.test.ts` | 4 tests for anchor staggering |

## 5. Files modified

| File | Change |
|---|---|
| `src/components/video/HlsPlayer.tsx` | New `watermark` prop, rendered inside the fullscreen container above the video and below the controls |
| `src/components/video/AuthorizedHlsPlayer.tsx` | Stores `watermarkText` from the playback response and passes it down |

## 6. Tests and actual results

Command: `npm test`

```
 ✓ src/server/video/watermark.test.ts              (9 tests)
 ✓ src/server/auth/device-classification.test.ts  (14 tests)
 ✓ src/server/auth/device-session.test.ts         (22 tests)
 ✓ src/server/authz/lesson-access.test.ts         (16 tests)
 ✓ src/components/video/VideoWatermark.test.ts     (4 tests)
 ✓ src/server/subscription/entitlement.service.test.ts (9 tests)
 ✓ src/server/video/mux.test.ts                    (9 tests)

 Test Files  7 passed (7)
      Tests  83 passed (83)
```

New coverage:

| Case | Covered |
|---|---|
| Starting anchor is always a valid index, including for empty input | Yes |
| Staggering is deterministic for the same marker | Yes |
| Different markers spread across anchors rather than collapsing to one | Yes |
| Hash is order-sensitive (a character-sum hash would collide on all anagrams) | Yes |

The server-side marker properties — stability, opacity, absence of PII, and
refusal to derive without a secret — are covered by the 9 Phase 2 tests in
`src/server/video/watermark.test.ts`.

### Not covered by automated tests

The rendered overlay itself: fullscreen survival, actual legibility over real
video, and the reduced-motion branch. These need a browser and a live asset, so
they belong to the Phase 6 Playwright suite. **Fullscreen behaviour on iOS is the
item most likely to differ from expectation** — see below.

## 7. Manual verification required

1. **Desktop fullscreen.** Play a lesson, go fullscreen, and confirm the marker is
   still visible and still moving.
2. **iOS.** iOS Safari cannot fullscreen a `div`, so it uses the native video
   player, which renders **no HTML overlay**. Confirm the actual behaviour on a
   real device and decide whether that gap is acceptable. It is the one platform
   where the watermark can be bypassed with no tooling at all.
3. **Legibility.** Check the marker is readable over both a very bright and a very
   dark scene, then confirm the code matches the student via
   `matchesWatermarkMarker`.
4. **Non-intrusiveness.** Watch several minutes and confirm it does not distract
   or overlap the controls.
5. **Guest preview.** Confirm no overlay appears for an anonymous viewer on a free
   preview lesson.

## 8. Remaining limitations

- **Client-side only**, so removable via devtools by a technical user.
- **No overlay in iOS native fullscreen**, as above.
- **Not in the video stream**, so a leak recorded from a modified client carries no
  marker at all.
- **No enforcement of screen-recording detection.** Browsers do not expose this
  reliably, and attempts to detect it are trivially bypassed.
- **Marker resolution is manual.** `matchesWatermarkMarker` requires checking a
  candidate user id; there is no reverse index from marker to account. For a
  platform this size that is a short script, but it is not a tool yet, and it must
  stay server-side — exposing it over HTTP would create an account-enumeration
  oracle.
