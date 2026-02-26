# Full application diagnosis

This document summarizes findings across **performance**, **security**, **reliability**, **SEO & accessibility**, **code quality**, and **configuration**. Each section lists issues and recommended fixes.

---

## 1. Performance

### 1.1 Navigation feels slow (partially addressed)

- **Cause:** No loading UI on many routes; subscription check was two sequential DB calls; heavy server work before first byte.
- **Status:** Loading skeletons added for learn + lesson routes; `hasActiveSubscription()` now runs subscription + entitlement checks in **parallel** (`Promise.all`).
- **Remaining:** Admin form buttons (Save, Update, Add Lesson) still don’t show pending state — use `useFormStatus()` for “Saving…” / disabled. Some routes (e.g. `/courses/[courseId]`, `/profile`, `/settings`) still have no `loading.tsx`; add where needed.

### 1.2 Possible N+1 and heavy queries

- **Observation:** Content services use `findMany`/`findFirst`/`findUnique` with nested `select`/`include`. No obvious N+1 in the current patterns (courses with modules/lessons are loaded in one query).
- **Recommendation:** As you add more list/detail pages, keep using single queries with nested relations or `include`; avoid loops that do one query per item.

### 1.3 Development vs production

- **Observation:** `next dev` (with or without Turbopack) compiles on demand and is slower than production.
- **Recommendation:** Treat dev slowness as baseline; rely on loading UI and parallel DB work for perceived speed. Run `next build && next start` locally occasionally to compare.

---

## 2. Security

### 2.1 Secrets in `.env.example` (critical if present)

- **Risk:** If `.env.example` (or any committed file) contains **real** secrets (DB URL with password, Mux token/secret, signing keys, AUTH_SECRET), anyone with repo access can abuse them.
- **Check:** Ensure `.env.example` has **placeholders only** (e.g. `DATABASE_URL="postgresql://user:password@host:5432/db"` with a note to replace). Never commit real passwords or API keys.
- **Recommendation:** Rotate any secret that may have been committed; use a secret scanner (e.g. GitGuardian, TruffleHog) in CI.

### 2.2 TypeScript build errors ignored

- **Location:** `next.config.ts`: `typescript: { ignoreBuildErrors: true }`.
- **Risk:** Type errors don’t fail the build; bugs and security issues (e.g. wrong types in auth) can ship.
- **Recommendation:** Remove `ignoreBuildErrors`, fix type errors, and keep the build strict.

### 2.3 Auth and authorization

- **Good:** JWT session strategy; middleware protects `/admin` and `/api/admin`; `requireRole`/`requireAuth`/`requireSubscription` used on server; webhook signature verification (Mux) with constant-time compare.
- **Gaps:** No rate limiting on login, register, or password reset (if added). Consider rate limiting for auth and sensitive API routes in production.

### 2.4 Input validation

- **Good:** Registration and key APIs use Zod (`RegisterInput.safeParse`, content schemas); server actions often validate via schemas.
- **Gaps:** Some API routes accept `params`/body without schema validation (e.g. only checking `lessonId` presence). Validate all external input with Zod (or similar) and return 400 on failure.

### 2.5 Webhook and error handling

- **Good:** Mux webhook verifies signature and timestamp; `handleRoute` centralizes `AppError` and returns 500 for unexpected errors.
- **Note:** Webhook handler uses `JSON.parse(rawBody)`; if body is invalid, the error is caught by `handleRoute` and returns 500. Optional: wrap in try/catch and return 400 with a clear message for invalid JSON.

---

## 3. Reliability and errors

### 3.1 No React error boundaries

- **Observation:** No `error.tsx` (or `global-error.tsx`) in the app. Uncaught errors in server or client components can show the default Next.js error or a blank screen.
- **Recommendation:** Add `app/error.tsx` (and optionally `app/global-error.tsx`) to show a friendly “Something went wrong” and a way to retry or go home. Add segment-level `error.tsx` for critical segments (e.g. `learn`, `admin`).

### 3.2 Logging and monitoring

- **Observation:** Errors are often logged with `console.error` only; no structured logging or error reporting service.
- **Recommendation:** For production, add a logger (e.g. Pino) and/or an error reporting service (e.g. Sentry). Ensure stack traces and request context (without secrets) are captured.

### 3.3 Database and migrations

- **Observation:** Prisma with Supabase; `directUrl` used for migrations. Schema has indexes on common filters (e.g. `userId`, `courseId`, `status`).
- **Recommendation:** Run migrations in CI/CD; avoid committing `db push` as the only way to apply changes. Periodically check for missing indexes on columns used in `where`/`orderBy`.

---

## 4. SEO and metadata

### 4.1 Missing default metadata

- **Observation:** Root `layout.tsx` does not export `metadata` or `generateMetadata`. Default title/description may be missing or generic.
- **Recommendation:** Export `metadata` in the root layout (e.g. `title`, `description`, `openGraph`) and use `generateMetadata` on important pages (course, track, lesson) for dynamic titles and descriptions.

### 4.2 Semantic HTML and headings

- **Observation:** Pages use headings (`h1`, `h2`) and links; structure is generally reasonable.
- **Recommendation:** Ensure each page has one main `h1`; use heading levels in order (no skipping). Add canonical URLs if you have duplicate or alternate URLs.

---

## 5. Accessibility (a11y)

### 5.1 Current state

- **Good:** Some `aria-*` and `role` usage (e.g. Modal, SearchBar, UserMenu); HlsPlayer has `aria-label` on quality select; images use `alt` where checked.
- **Gaps:** Not every interactive element has an accessible name or focus handling; form errors may not be announced; no systematic a11y audit.

### 5.2 Recommendations

- Add `aria-live` (or similar) for dynamic messages (toasts, form errors).
- Ensure focus is managed in modals and after redirects where needed.
- Run an automated a11y check (e.g. eslint-plugin-jsx-a11y, Lighthouse) and fix critical issues.
- Test with keyboard-only and one screen reader (e.g. NVDA, VoiceOver).

---

## 6. Code quality and structure

### 6.1 Duplicate or legacy code

- **Observation:** Repo contains `frontend/` and `backend/` (or similar) with overlapping paths (e.g. auth, content, admin routes). This can cause confusion and drift.
- **Recommendation:** Decide which tree is canonical (likely `src/` at root). Archive or remove the other, or document clearly which is used and which is legacy.

### 6.2 Server actions and forms

- **Good:** Server actions used for forms; some use `useFormStatus` (e.g. ConfirmDeleteButton).
- **Gaps:** Many submit buttons don’t show pending state; optional to add a small “SubmitButton” wrapper using `useFormStatus()` and reuse it across admin forms.

### 6.3 Centralized error handling

- **Good:** `AppError` and `handleRoute` give consistent API error shape.
- **Recommendation:** Use the same error codes and shapes in server actions (e.g. return `{ error: "BAD_REQUEST", message }`) so the client can show consistent messages.

---

## 7. Configuration and environment

### 7.1 Environment variables

- **Observation:** `.env` is in `.gitignore`; `.env.example` documents variables. If `.env.example` ever contained real secrets, treat them as compromised and rotate.
- **Recommendation:** Keep `.env.example` with placeholders and short comments; document required vs optional vars (e.g. Mux signing keys optional for public playback).

### 7.2 Build and scripts

- **Observation:** `package.json` uses `tsx` for scripts; Prisma and DB scripts present; `ignoreBuildErrors: true` weakens type safety.
- **Recommendation:** Remove TypeScript ignore; add a `scripts:subscribe-user` (or similar) if you rely on it; document one-off scripts in a README or `docs/scripts.md`.

---

## 8. Testing and quality assurance

### 8.1 Automated tests

- **Observation:** No `*.test.ts` or `*.spec.ts` found. No Jest, Vitest, or Playwright config in the checked files.
- **Recommendation:** Add unit tests for critical logic (auth helpers, subscription check, content services); add a few API route tests (e.g. register, admin upload); consider E2E for login → open course → play lesson.

---

## 9. Summary table

| Area            | Severity  | Finding                                      | Action |
|-----------------|-----------|----------------------------------------------|--------|
| Security        | Critical  | Ensure no real secrets in `.env.example`     | Audit; rotate if needed |
| Security        | High      | `ignoreBuildErrors: true` hides type errors   | Remove; fix types |
| Reliability     | High      | No `error.tsx` / error boundaries             | Add app/error.tsx (and segment-level) |
| Performance     | Medium    | Some routes still without loading UI          | Add loading.tsx where needed |
| Performance     | Medium    | Admin buttons no pending state                | useFormStatus() on submit buttons |
| Security        | Medium    | No rate limiting on auth endpoints            | Add rate limit in production |
| Input validation| Medium    | Some APIs don’t validate body/params with Zod | Add schemas and safeParse |
| SEO             | Medium    | No default/dynamic metadata                  | Add metadata in layout and key pages |
| A11y            | Medium    | No systematic a11y audit                     | Add a11y lint; fix critical issues |
| Code structure  | Low       | Duplicate frontend/backend trees             | Clarify or remove legacy tree |
| Testing         | Low       | No tests                                     | Add unit + API + optional E2E |
| Logging         | Low       | Only console.error                           | Add structured logging / error reporting |

---

## 10. References

- Performance details: `docs/PERFORMANCE-DIAGNOSIS.md`
- Next.js: [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling), [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- Auth.js: [Session](https://authjs.dev/concepts/session), [JWT](https://authjs.dev/concepts/jwt)
