# Why localhost feels slow – diagnosis

## 1. No loading UI when navigating (main cause of “sluggish” feel)

**What happens:** When you click a link (e.g. “Watch course” or a lesson), the **current page stays on screen** until the server has finished all work and sent the new page. There is no skeleton or spinner, so it looks like nothing is happening.

**Where:** Learn routes (`/learn`, `/learn/[courseId]`, `/learn/[courseId]/lesson/[lessonId]`) and several others have **no `loading.tsx`**. Next.js only shows an instant loading state if that file exists.

**Fix:** Add `loading.tsx` (skeleton or spinner) next to the page for each slow route. The shell appears immediately; then content streams in.

---

## 2. Heavy server work before the page can render

**What happens:** Each learn page does **several steps in order** before any HTML is sent:

1. **Session** – `auth()` (getServerSession) runs.
2. **Subscription** – `requireSubscription()` then calls `hasActiveSubscription(userId)`.
3. **Subscription check** – That function does **two sequential DB queries**: first `subscription.findFirst`, then (if none) `entitlement.findFirst`. So 2 round-trips to the DB.
4. **Page data** – Then the page runs its own query (e.g. `getCourseForLearning(courseId)` or `getLessonForLearning(...)`).

So you have: **session resolution + 2 subscription queries + 1 course/lesson query**, mostly one after another. On localhost, each step adds latency (DB, cold start, etc.), so the total wait is long.

**Fix:**

- **Subscription:** Do the two checks in **one query** (e.g. one `findFirst` with an OR on subscription vs entitlement) or run both in **parallel** with `Promise.all` so you only wait for the slower of the two.
- **Parallelize with data:** Where possible, after you have `session.user.id`, run `hasActiveSubscription(userId)` and the course/lesson data fetch in **parallel** so the page doesn’t wait for subscription and then again for content.

---

## 3. Buttons (e.g. Save / Update) don’t show “in progress”

**What happens:** In admin, when you click “Update”, “Save module”, “Add lesson”, etc., the **button doesn’t change** (no “Saving…” or disabled state). The request is sent to the server and the UI only updates when the server action finishes. So it feels like the button “does nothing” for a while.

**Fix:** Use `useFormStatus()` from `react-dom` in the submit button (or a small wrapper component) and show `pending` (e.g. “Saving…” and `disabled`) while the server action is running. Only some admin forms use this today (e.g. `ConfirmDeleteButton`); others do not.

---

## 4. Development mode is slower than production

**What happens:** In `next dev`, Next.js compiles routes on demand, doesn’t minify, and adds dev tooling. So **every navigation can trigger work** that wouldn’t exist in production. Localhost will always feel slower than a deployed build.

**Fix:** Accept some baseline slowness in dev. The improvements above (loading UI, fewer/parallel DB calls, button pending state) will still make localhost feel much more responsive.

---

## Summary

| Cause                          | Impact   | Fix |
|--------------------------------|----------|-----|
| No `loading.tsx` on learn etc. | High     | Add loading skeletons for learn (and other slow) routes |
| 2 sequential subscription DB   | Medium   | One query or `Promise.all` in `hasActiveSubscription` |
| No parallel auth + data        | Medium   | Run subscription check and course/lesson fetch in parallel where possible |
| Buttons don’t show pending     | Medium   | Use `useFormStatus()` on admin form submit buttons |
| Dev mode overhead              | Baseline | Expect localhost to be slower than production |

Implementing the loading skeletons and the subscription/data parallelization will give the biggest perceived improvement on localhost.
