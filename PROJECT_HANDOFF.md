# Alwerash — Project Handoff

Last updated: June 2026  
Primary app root: `src/` (Next.js App Router)

---

## Product goal

**Alwerash** is a subscription-based online learning platform focused on **design and creative skills**, positioned for the **MENA** region.

**Core value proposition:** learners subscribe once and get access to structured video courses taught by industry mentors. Content is organized as **Schools → Tracks → Courses → Modules → Lessons**.

**Current stage:** functional foundation with real Prisma/Postgres data, admin CMS, learner home, catalog (`/learn`), video playback (Mux), progress tracking, weekly activity analytics, and mentor profiles. Payment integrations (Stripe/Paymob) exist in the schema but subscription checkout currently grants **free entitlements** for development.

**Key journeys:**
- **Guest** — browse landing, catalog, mentors, tracks; register and subscribe
- **Student (learner)** — `/home` dashboard, continue learning, watch lessons, track weekly activity
- **Instructor** — view assigned courses and learner rosters
- **Admin** — full content hierarchy CMS, user management, video uploads, mentor/instructor management

---

## User types

| Type | Role enum | How assigned | Default landing | Access |
|------|-----------|--------------|-----------------|--------|
| **Guest** | (no account) | — | `/` | Public catalog, marketing pages, auth pages |
| **Student** | `LEARNER` | Self-registration at `/register` | `/home` | Protected learning routes; requires active subscription or entitlement for lesson playback |
| **Instructor** | `INSTRUCTOR` | Admin creates via `/admin/content/instructors` | `/instructor` | Assigned courses + learner progress rosters |
| **Admin** | `ADMIN` | Seeded via `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `/admin` | Full CMS, user activity, all instructor capabilities |

**Notes:**
- A user can hold multiple roles (`user_roles` join table), but middleware treats **ADMIN** as highest privilege.
- **Mentors** (`mentors` table) are marketing profiles linked to courses — not login accounts.
- **Course instructors** (`course_instructors`) are `User` records with `INSTRUCTOR` role assigned to specific courses.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Language | TypeScript 5 |
| Database | PostgreSQL (Supabase) + Prisma 6 |
| Auth | NextAuth v4, Credentials provider, JWT sessions |
| Password hashing | argon2 (primary), bcrypt (legacy verify) |
| Email | Resend (verification emails) |
| Video | Mux (`@mux/mux-node`), hls.js playback, signed playback URLs |
| Animation / carousels | GSAP, Swiper |
| Validation | Zod |
| Image cropping | react-easy-crop |
| Dev server | Port **3002** (`npm run dev`) |

**Env essentials:** see `.env.example` — `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`, `RESEND_*`, `MUX_*`, `ADMIN_*`.

---

## Routing map

Route groups in parentheses (e.g. `(auth)`) do not appear in the URL.

### Public / marketing

| Route | Purpose |
|-------|---------|
| `/` | Guest landing; signed-in users redirected by role |
| `/learn` | Course catalog (featured, popular, mentors) — **public** |
| `/course` | Alias → `/learn` |
| `/tracks`, `/tracks/[slug]` | Published track list and detail |
| `/events`, `/library` | Aliases → `/tracks` |
| `/courses/[courseId]` | Course marketing/detail page |
| `/mentors`, `/mentors/[id]` | Mentor directory and profile |
| `/subscription` | Subscription plans (free entitlement grant for now) |

### Auth `(auth)`

| Route | Purpose |
|-------|---------|
| `/login` | Credentials sign-in |
| `/register` | Self-registration |
| `/register/check-email` | Post-registration verification prompt |
| `/verify-email` | Email verification token handler |

### Student (learner)

| Route | Purpose | Guard |
|-------|---------|-------|
| `/home` | Member dashboard: continue learning, weekly activity, mentors | Login + non-admin |
| `/profile`, `/settings` | Profile editor, settings hub | Page-level `auth()` |
| `/profile/change-password` | Placeholder (coming soon) | Login |
| `/profile/certificates` | Placeholder | Login |
| `/dashboard` | Dev/debug session viewer | Soft gate |
| `/learn/[courseId]` | Course hub with curriculum | Login + subscription |
| `/learn/[courseId]/lesson/[lessonId]` | Lesson player with sidebar | Login + subscription |
| `/lessons/[lessonId]` | Standalone HLS lesson page | Login + subscription |

### Admin `/admin`

Redirects `/admin` → `/admin/content/tracks`.

| Route | Purpose |
|-------|---------|
| `/admin/content` | Content admin home |
| `/admin/content/schools`, `/schools/[schoolId]` | School CRUD |
| `/admin/content/tracks`, `/tracks/[trackId]` | Track CRUD |
| `/admin/content/courses`, `/courses/[courseId]` | Course CRUD + intro video |
| `/admin/content/modules/[moduleId]` | Module + lesson CRUD + Mux upload |
| `/admin/content/mentors`, `/mentors/new`, `/mentors/[id]` | Mentor CRUD |
| `/admin/content/instructors` | Instructor accounts + course assignment |
| `/admin/users` | Learner list |
| `/admin/users/[userId]/activity` | Per-user watch time analytics |

**Content hierarchy:** School → Track → Course → Module → Lesson

### Instructor `/instructor`

| Route | Purpose |
|-------|---------|
| `/instructor` | Dashboard: assigned courses + learner counts |
| `/instructor/courses/[courseId]` | Learner roster for a course |

### Utility

| Route | Purpose |
|-------|---------|
| `/403` | Forbidden (wrong role) |

### Middleware summary (`src/middleware.ts`)

Uses JWT `getToken` (edge-safe). Key rules:

- `/learn` (exact) — public
- `/learn/*`, `/lessons/*` — login required
- `/home` — login required; admins redirected to `/admin`
- `/admin`, `/api/admin` — `ADMIN` only
- `/instructor`, `/api/instructor` — `INSTRUCTOR` or `ADMIN`
- `/api/video/playback/*` — login required
- Signed-in admins confined to `/admin` and `/instructor` areas
- Matcher excludes `/api/auth/*`, static assets, `/_next/*`

Many routes (profile, catalog APIs, progress APIs) rely on **page/API-level** auth instead of middleware.

---

## Component structure

Root: `src/components/`

```
components/
├── landing/          # Guest marketing: hero, tracks, mentors, FAQ, CTA, modals
├── layout/           # SiteHeader, footer, AdminLayout, ConditionalLayout
├── home/             # Logged-in learner dashboard sections
├── learn/            # Catalog UI: featured panel, popular classes, carousels
├── cards/            # CatalogShowcaseCard + catalog-showcase-map.ts
├── video/            # HlsPlayer, ProgressTracker, watermark overlay
├── learning/         # CourseProgressBar
├── gsap/             # GsapAnimationLayer (scroll/entrance animations)
├── ui/               # Generic ProgressBar
├── SessionProvider.tsx
├── Toast.tsx
└── ToastFromUrl.tsx
```

**Patterns:**
- **Server orchestrators** — pages fetch data, compose presentational sections (e.g. `GuestLanding.tsx`, `learn/page.tsx`)
- **Barrel exports** — `landing/index.ts`, `cards/index.ts`
- **Layout routing** — `ConditionalLayout.tsx` switches admin vs public shell by pathname
- **Server vs client** — marketing sections are server components; interactivity in headers, modals, GSAP, video player
- **Figma-to-code** — fixed pixel widths (`w-[1125px]`) mixed with Tailwind responsive utilities
- **Animation** — `data-gsap-reveal`, `data-gsap-hero`, `data-gsap-stagger-group` attributes

**Legacy note:** a partial duplicate tree exists at `frontend/src/` — treat `src/` as canonical.

---

## API endpoints

### Auth

| Method | Path | Purpose |
|--------|------|---------|
| GET, POST | `/api/auth/[...nextauth]` | NextAuth handler |
| POST | `/api/auth/register` | Register user (**stub — returns 501**; use server action instead) |
| POST | `/api/auth/resend-verification` | Resend verification email |

### Current user

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/me` | Current session user |
| PATCH | `/api/profile` | Update name, profession, country, image |
| POST | `/api/profile/photo` | Upload profile photo |

### Public catalog

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/catalog/tracks` | List published tracks |
| GET | `/api/catalog/tracks/[slug]` | Track by slug |
| GET | `/api/catalog/courses/[courseId]` | Public course detail |
| GET | `/api/search?q=&limit=` | Content search |
| GET | `/api/stats` | Platform stats for landing |

### Learning progress (authenticated)

| Method | Path | Purpose |
|--------|------|---------|
| GET, PATCH | `/api/learning/progress/lesson/[lessonId]` | Get/save lesson progress |
| GET | `/api/learning/progress/course/[courseId]` | Course completion stats |

### Video

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/video/playback/[lessonId]` | Signed Mux playback URL (subscription required) |
| POST | `/api/webhooks/mux` | Mux webhook (signature verified) |

### Instructor (`INSTRUCTOR` or `ADMIN`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/instructor/courses` | Assigned courses |
| GET | `/api/instructor/courses/[courseId]/learners` | Learner roster + progress |

### Admin (`ADMIN`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/admin/health` | DB connectivity check (**unauthenticated**) |
| GET, POST | `/api/admin/schools` | List / create schools |
| GET, PATCH, DELETE | `/api/admin/schools/[schoolId]` | School CRUD |
| GET, POST | `/api/admin/tracks` | List / create tracks |
| PATCH, DELETE | `/api/admin/tracks/[trackId]` | Update / delete track |
| GET, POST | `/api/admin/courses` | List / create courses |
| PATCH, DELETE | `/api/admin/courses/[courseId]` | Update / delete course |
| GET, POST | `/api/admin/modules` | List / create modules |
| PATCH, DELETE | `/api/admin/modules/[moduleId]` | Update / delete module |
| GET, POST | `/api/admin/lessons` | List / create lessons |
| PATCH, DELETE | `/api/admin/lessons/[lessonId]` | Update / delete lesson |
| GET, POST | `/api/admin/mentors` | List / create mentors |
| GET, PUT, DELETE | `/api/admin/mentors/[id]` | Mentor CRUD |
| GET, POST | `/api/admin/instructors` | Instructor user management |
| POST | `/api/admin/course-instructors` | Assign instructor to course |
| POST | `/api/admin/video/uploads` | Mux direct upload for lesson |
| POST | `/api/admin/lessons/[lessonId]/upload` | Mux upload (legacy path) |
| GET | `/api/admin/lessons/[lessonId]/video/sync` | Sync lesson video from Mux |
| POST | `/api/admin/courses/[courseId]/intro-video/upload` | Course intro video upload |
| POST | `/api/admin/courses/[courseId]/intro-video/sync` | Sync intro video |
| POST, DELETE | `/api/admin/courses/[courseId]/instructor-photo` | Course instructor photo |
| POST, DELETE | `/api/admin/mentors/[id]/photo` | Mentor photo upload |

---

## Auth flow

### Registration

```
/register (RegisterForm + server action)
  → registerUser() in server/auth/auth.service.ts
  → hashPassword (argon2id)
  → prisma.user.create (role: LEARNER, emailVerified: null)
  → createAndSendVerificationToken() via Resend
  → redirect /register/check-email
```

Password rules: min 10 chars, uppercase, lowercase, digit.

### Email verification

```
Email link → /verify-email?token=...
  → verifyToken() in server/email/verification.service.ts
  → 24h expiry; sets user.emailVerified, deletes token
  → redirect /login?verified=1
```

Login is **blocked** until `emailVerified` is set.

### Sign-in

```
/login (LoginForm)
  → signIn("credentials", { email, password })
  → authorize() in src/auth.ts:
      1. Validate email/password (Zod)
      2. Find user + roles
      3. Require passwordHash
      4. verifyPassword (argon2 or legacy bcrypt)
      5. Require emailVerified
  → JWT callback: load roles into token
  → Session callback: attach id, roles, name, image, country, profession
  → Client redirect: ADMIN → /admin, INSTRUCTOR → /instructor, else /home
```

### Session

- **Strategy:** JWT (`session: { strategy: "jwt" }`) — not DB sessions
- **PrismaAdapter** wired for future OAuth; `Account`/`Session` tables exist
- **Server:** `auth()` → `getServerSession(authOptions)`
- **Client:** session hydrated from root `layout.tsx` via `SessionProvider`
- **Secrets:** `AUTH_SECRET` (or `NEXTAUTH_SECRET`), `AUTH_URL` (must match browser origin)

### Server-side guards

- `requireAuth()` — `src/server/auth/require.ts`
- `requireRole(["ADMIN"])` — admin pages and APIs
- `requireSubscription()` — `src/server/subscription/require-subscription.ts` (admins bypass)

### Utility scripts

| Script | Purpose |
|--------|---------|
| `npx prisma db seed` | Create/update admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `npx tsx scripts/create-learner.ts` | Create learner account |
| `npx tsx scripts/ensure-user-can-login.ts` | Set password + verify email for existing user |
| `npx tsx scripts/reset-user-password.ts` | Reset password |

---

## Database tables

PostgreSQL via Supabase. Schema: `prisma/schema.prisma`.

### Auth & users

| Table | Model | Key fields |
|-------|-------|------------|
| `users` | User | email, passwordHash, emailVerified, name, profession, country, image |
| `user_roles` | UserRole | userId, role (LEARNER, INSTRUCTOR, ADMIN, GUEST) |
| `accounts` | Account | OAuth provider fields (Auth.js adapter) |
| `sessions` | Session | sessionToken, userId, expires |
| `verification_tokens` | VerificationToken | identifier (userId), token, expires |

### Content hierarchy

| Table | Model | Key fields |
|-------|-------|------------|
| `schools` | School | title, slug, order, published |
| `tracks` | Track | schoolId, title, slug, coverImage, published |
| `courses` | Course | trackId, mentorId, title, summary, cover, Mux intro video, featured ordering, published |
| `course_instructors` | CourseInstructor | courseId, instructorId (M2M) |
| `modules` | Module | courseId, title, order |
| `lessons` | Lesson | moduleId, title, type (VIDEO/ARTICLE/RESOURCE), order, published |

### Video (Mux)

| Table | Model | Key fields |
|-------|-------|------------|
| `lesson_video` | LessonVideo | lessonId (1:1), muxAssetId, muxPlaybackId |
| `video_uploads` | VideoUpload | lessonId, muxUploadId, status |
| `course_intro_video_uploads` | CourseIntroVideoUpload | courseId, muxUploadId, status |
| `video_events` | VideoEvent | muxEventId, type, status (webhook log) |

### Learning progress

| Table | Model | Key fields |
|-------|-------|------------|
| `lesson_progress` | LessonProgress | (userId, lessonId) PK, watchSeconds, lastPositionSeconds, completedAt |
| `user_learning_days` | UserLearningDay | userId, day (UTC), watchSecondsTotal |
| `user_course_learning_days` | UserCourseLearningDay | userId, courseId, day, watchSecondsTotal |

### Commerce

| Table | Model | Key fields |
|-------|-------|------------|
| `subscriptions` | Subscription | userId, provider (STRIPE/PAYMOB), status, plan, currentPeriodEnd |
| `entitlements` | Entitlement | userId, product (ALL_ACCESS), status, expiresAt |
| `payment_events` | PaymentEvent | provider, providerEventId (webhook idempotency) |

### Mentors, assignments, messaging

| Table | Model | Key fields |
|-------|-------|------------|
| `mentors` | Mentor | name, photo, certificateName, aboutMe |
| `assignments` | Assignment | lessonId, title, instructions, rubricJson |
| `submissions` | Submission | assignmentId, userId, status, feedback, grade |
| `submission_files` | SubmissionFile | submissionId, fileKey, mime, size |
| `threads` | Thread | type (DM/COURSE), courseId |
| `thread_participants` | ThreadParticipant | threadId, userId |
| `messages` | Message | threadId, senderId, body |

---

## Known bugs

### Critical / operational

| Issue | Symptom | Cause / status |
|-------|---------|----------------|
| **Supabase DB unreachable** | Login shows "Invalid email or password"; Prisma `tenant/user not found` or P1001 | Wrong/paused/deleted Supabase project or incorrect `DATABASE_URL`/`DIRECT_URL`. Use Session pooler on IPv4. Test: `npx tsx scripts/test-db-connection.ts` |
| **Login masks DB errors** | Generic credential error when DB is down | `authorize()` returns `null` on any Prisma failure — no distinct "service unavailable" message |
| **Migration drift** | `migrate deploy` fails or schema mismatches | DB may have migrations with different timestamps than repo (e.g. `20260407101300` vs `20260410120000`). Resolve via `prisma migrate resolve` or align migration history |

### Functional gaps

| Issue | Location | Detail |
|-------|----------|--------|
| Register API stub | `src/app/api/auth/register/route.ts` | Returns HTTP 501 with TODO. Registration works via server action on `/register` page only |
| Subscription is free | `src/app/subscription/actions.ts` | `subscribeWithBundle` calls `createFreeEntitlement` — no Stripe/Paymob integration wired |
| Stats watch time placeholder | `src/app/api/stats/route.ts` | `watchTime = completedCount * 10` — not real aggregated watch time |
| Change password / certificates | `/profile/change-password`, `/profile/certificates` | Placeholder pages ("coming soon") |
| `create-learner.ts` missing emailVerified | `scripts/create-learner.ts` | Created users cannot log in until `ensure-user-can-login.ts` sets `emailVerified` |
| Course detail page | `/courses/[courseId]` | Figma-style static layout; route params may be underused |
| README port mismatch | `README.md` | Says port 3000; `package.json` dev script uses **3002** |

### Resilience fallbacks (not bugs, but watch for)

- `public.service.ts` and `admin.service.ts` catch missing columns/tables and fall back to raw SQL or empty results when migrations are behind
- `guest-landing-data.service.ts` returns empty data on DB failure so `/` does not 500
- Session callback in `auth.ts` tolerates missing DB columns

### Legacy duplicate tree

- `frontend/src/` contains an older partial copy of routes/components — do not edit unless intentionally syncing

---

## Responsive design rules

### Breakpoints (Tailwind v4 defaults — not customized)

| Prefix | Min width |
|--------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Config lives in `src/app/globals.css` via `@theme` — no separate `tailwind.config.*`.

### Design tokens (`src/app/globals.css`)

```css
:root {
  --color-primary: rgb(234 179 8);      /* yellow accent */
  --color-accent: rgb(37 99 235);       /* blue */
  --color-text: rgb(15 23 42);
  --color-header-bg: rgb(0 0 0);
  --shadow-card: ...;
  --ease-out-smooth: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Fonts: **DM Sans** (`--font-dm-sans`), **Playfair Display** italic for logo (`--font-logo`).

### Layout conventions

| Pattern | Usage |
|---------|-------|
| Container | `max-w-7xl`, `max-w-[1600px]`, `max-w-[1400px]` |
| Horizontal padding | `px-4 sm:px-6 lg:px-8` |
| Grids | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Flex direction | `flex-col lg:flex-row` |
| Show/hide | `hidden xl:flex` for side columns |
| Overflow | `html { overflow-x: hidden }`, `overflow-x-hidden` on layouts |
| Full-bleed sections | `w-screen max-w-[100vw] ml-[calc(50%-50vw)]` |

### Figma-first sections

Many learn/landing sections use **fixed desktop widths** (`w-[1055px]`, `w-[1125px]`, `rounded-[50px]`) with `max-w-full` — on mobile this **scrolls horizontally** rather than reflowing. Carousels (Swiper) handle overflow on smaller viewports.

### Motion

- `prefers-reduced-motion` respected in `GsapAnimationLayer.tsx` and `StatsSection.tsx`
- GSAP attributes: `data-gsap-reveal`, `data-gsap-hero`, `data-gsap-stagger-group`

### Images

Use Next.js `Image` with explicit `sizes` on mentor grids, track cards, and modals.

---

## Security concerns

### Authorization model

- **No Postgres RLS** — all access control is application-layer (Prisma + NextAuth)
- **JWT sessions** — roles stored in token; refreshed on sign-in and JWT callback
- **Edge middleware** — route-level role checks; not all APIs are middleware-protected

### Gaps to address before production

| Concern | Detail |
|---------|--------|
| Progress APIs without subscription check | `/api/learning/progress/*` requires auth but not `requireSubscription()` — lesson metadata could leak to non-subscribers |
| Unauthenticated admin health | `/api/admin/health` exposes DB connectivity without auth |
| Register API stub | If exposed publicly, returns 501 rather than being removed or secured |
| Free entitlement grant | `/subscription` bypasses payment — must wire Stripe/Paymob before launch |
| DB credentials in `.env` | Rotate if exposed; URL-encode special chars in connection strings |
| Session DB hits | Every session fetch queries DB for user profile — consider caching or trimming fields |
| Mux webhook | Signature verified in webhook handler — ensure `MUX_WEBHOOK_SECRET` is set in production |
| Signed playback | Mux JWT playback tokens limit direct URL sharing — watermark overlay adds deterrence, not DRM |
| File uploads | Profile/course/mentor photos — verify MIME/size limits and storage path sanitization |
| Raw SQL fallbacks | `$queryRawUnsafe` in admin.service bypasses Prisma safeguards — audit inputs |

### What's done well

- argon2 password hashing with bcrypt legacy support
- Email verification required before login
- Role checks on admin/instructor routes (middleware + `requireRole`)
- Subscription gate on video playback API and lesson pages
- Mux webhook signature verification
- Progress abuse guard: `MAX_WATCH_DELTA_PER_PATCH = 300` seconds in activity ingestion

---

## Scaling concerns

### Database

- **Connection pooling** delegated to Supabase Session pooler (`DATABASE_URL` / `DIRECT_URL`) — no app-level pool tuning
- **Prisma singleton** in `src/server/db/prisma.ts` — one client per server instance; fine for serverless if pooler handles connections
- **IPv4 networks** must use Session pooler (`aws-0-REGION.pooler.supabase.com:5432`, user `postgres.PROJECT_REF`) — direct `db.*.supabase.co` often fails

### Query hotspots

| Location | Concern |
|----------|---------|
| `/learn` page | 5 parallel `publicList*` calls; each does `findMany` + raw student-count SQL |
| `public.service.ts` | Nested `_count` on modules/lessons for every course card |
| `instructor.service.ts` | N+1: per-course `lessonProgress.findMany` in roster |
| `auth.ts` session callback | DB query on every session read (user + profession) |
| `/home` page | 4 parallel queries including full landing track bundle |
| `/api/stats` | 5+ aggregate queries per landing load |
| `continue-learning.service.ts` | Multi-step progress resolution per user |

### Caching

- **No `unstable_cache`** usage
- Most API routes: `dynamic = "force-dynamic"` or `revalidate = 0`
- Admin mutations use `revalidatePath` for public catalog invalidation
- Opportunity: cache public catalog, stats, and mentor lists with short TTL

### Frontend

- GSAP + Swiper on landing/learn — significant client JS
- Fixed-width carousels may hurt mobile UX and Lighthouse scores
- Dev/build scripts set `--max-old-space-size=2048/4096` — large bundle/memory footprint

### Positive patterns already in place

- `Promise.all` for parallel independent reads
- `getStudentCountsByCourseId` batches counts in one raw SQL query
- `hasActiveSubscription` runs subscription + entitlement checks in parallel
- Progress updates use `prisma.$transaction`
- Guest landing degrades gracefully on DB failure

---

## Quick start for new developers

```bash
cd e:\alwerash
npm install
npx prisma generate
cp .env.example .env   # fill DATABASE_URL, DIRECT_URL, AUTH_SECRET, AUTH_URL, etc.
npx tsx scripts/test-db-connection.ts   # must return OK
npm run db:deploy
npx prisma db seed
npm run dev            # http://localhost:3002
```

**Admin login:** credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` (set by seed).

**Key docs:** `README.md`, `.env.example`, `alwerash.md`, `prisma/schema.prisma`.
