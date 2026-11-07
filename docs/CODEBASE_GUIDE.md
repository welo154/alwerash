# Alwerash codebase guide

What every part of the code is responsible for, and the technologies behind it. Read the root `README.md` first for setup, commands, environment variables and deployment. This guide is the map of the code.

Last reviewed: November 2026 (416 files under `src/`).

## Contents

- [Technologies](#technologies)
- [How a request flows through the app](#how-a-request-flows-through-the-app)
- [Top-level files and folders](#top-level-files-and-folders)
- [`src/` root files](#src-root-files)
- [`src/app`: routes and pages](#srcapp-routes-and-pages)
- [`src/app/api`: HTTP endpoints](#srcappapi-http-endpoints)
- [`src/components`: user interface](#srccomponents-user-interface)
- [`src/lib`: shared helpers](#srclib-shared-helpers)
- [`src/server`: business logic and data access](#srcserver-business-logic-and-data-access)
- [`src/types`](#srctypes)
- [`prisma/` and `scripts/`](#prisma-and-scripts)
- [Tests](#tests)

---

## Technologies

| Area | Technology | Version | Used for |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.4 | Routing, server rendering, server actions, API routes, proxy (route guards), image optimisation |
| UI library | React | 19.3 | Components; server components by default, client components where marked `"use client"` |
| Language | TypeScript | 5 | Whole codebase, strict type checking |
| Styling | Tailwind CSS | 4 | Utility classes; design tokens and custom `en:` / `ar:` variants in `src/app/globals.css` |
| Database | PostgreSQL on Supabase | — | All application data (34 Prisma models) |
| ORM | Prisma + `@prisma/adapter-pg` (node-postgres) | 7.10 | Typed database access through a driver adapter; migrations (`prisma/migrations`) |
| Authentication | NextAuth (Auth.js v4) | 4.24 | Email and password sign-in, optional Google sign-in, JWT session cookie |
| Password hashing | argon2 (argon2id); bcrypt | 0.41; 6 | New passwords use argon2id; bcrypt only verifies old hashes |
| Validation | Zod | 4 | Request bodies, forms, environment checks |
| Video | Mux (`@mux/mux-node`) + hls.js | 12; 1.6 | Direct uploads, signed HLS streaming, adaptive playback in the browser |
| Payments | Polar (`@polar-sh/sdk`) | 1.x | Hosted USD card checkout and order webhooks |
| Email | Resend | 6 | Verification, password reset and notification emails |
| File storage | Supabase Storage (REST) | — | Profile, mentor and student-project images (public bucket); assignment submissions (private bucket) |
| Animation | GSAP + ScrollTrigger; custom reveal system | 3.14 | Guest landing animations; site-wide scroll reveals (`src/components/motion`) |
| Carousels | Swiper | 12 | Course, track and library carousels |
| Smooth scroll | Lenis | 1.3 | Smooth page scrolling |
| Icons | lucide-react | 0.575 | UI icons |
| Analytics | Microsoft Clarity | — | Heatmaps and session replays (production only) |
| Tests | Vitest | 3.2 | Unit and route tests (`*.test.ts`) |
| Linting | ESLint (flat config) + `eslint-config-next` | 9; 16.4 | Code quality, React and React Compiler rules |
| Hosting | Vercel (region `dub1`, Dublin) | — | Builds and serves the app; preview deploy per branch |
| CI | GitHub Actions | — | Lint, typecheck, tests and build on every pull request |

## How a request flows through the app

```
Browser
  │
  ▼
src/proxy.ts ──────── reads the JWT cookie, redirects by role
  │                   (guests → /login, learners kept out of /admin, admins kept in staff areas)
  ▼
src/app/layout.tsx ── reads the language cookie, sets <html lang>, wraps every page
  │                   with session, language, motion, smooth-scroll and layout providers
  ▼
Page (src/app/**/page.tsx)  or  API route (src/app/api/**/route.ts)  or  server action
  │   checks the session with src/server/auth/* and lesson access with src/server/authz/*
  ▼
Service (src/server/**)  ─── business rules, Zod validation
  │
  ▼
src/server/db/prisma.ts  ─── Prisma client → Supabase Postgres
```

External services call back into the app through webhooks: Mux at `/api/webhooks/mux` (video ready) and Polar at `/api/webhooks/polar` (payment received or refunded). Both verify a signature before trusting anything.

---

## Top-level files and folders

| Path | Responsibility |
|---|---|
| `README.md` | Developer guide: setup, commands, environment variables, deployment, launch checklist |
| `package.json` / `package-lock.json` | Dependencies and npm scripts (`dev`, `build`, `test`, `db:*`, `scripts:*`) |
| `next.config.ts` | Security headers, content security policy (report-only), image hosts, packages kept out of the bundle |
| `tsconfig.json` | TypeScript settings; `@/*` points at `src/*` |
| `vitest.config.ts` | Test runner: runs `src/**/*.test.ts` in Node |
| `postcss.config.mjs` | Tailwind 4 through PostCSS |
| `eslint.config.mjs` | Lint rules (flat config: `eslint-config-next/core-web-vitals`, React Compiler rules as warnings) |
| `prisma.config.ts` | Prisma CLI settings: schema, migrations folder, seed command and the migration database URL (`DIRECT_URL`) |
| `vercel.json` | Pins the Vercel region to `dub1` |
| `.env.example` | Every environment variable, documented |
| `.github/workflows/ci.yml` | CI: install, lint, typecheck, test, build |
| `prisma/` | Database schema, migrations, admin seed |
| `scripts/` | Command-line tools for support tasks and one-off data imports |
| `public/` | Static files: fonts, images, catalog covers, library artwork |
| `docs/` | Security reviews, performance measurements, this guide, the improvements and payments plan |
| `skills/`, `.claude/skills`, `.agents/skills` | Supabase guidance for AI coding assistants (not part of the app) |

## `src/` root files

| File | Responsibility |
|---|---|
| `proxy.ts` | Next.js 16 "proxy" (formerly middleware). Runs before every page and API request. Reads the session cookie and enforces who may enter each area: redirects guests to log in, sends learners away from staff areas, keeps admins inside staff areas, redirects legacy `/learn` URLs |
| `proxy.test.ts` | 26 tests covering every role against every protected area |
| `auth.ts` | NextAuth configuration: credentials and Google sign-in, login rate limits, security event logging, JWT callback that re-reads roles on every request and registers device sessions |
| `auth.test.ts` | Tests that device sessions are only registered where the cookie can actually be saved |
| `instrumentation.ts` | Runs once when the server starts: checks configuration (`server/env.ts`) and warms up the database client |

---

## `src/app`: routes and pages

Next.js maps folders to URLs. `page.tsx` is the page, `layout.tsx` wraps its children, `loading.tsx` shows while the page loads, `error.tsx` shows on errors. Folders in parentheses, like `(auth)`, group files without appearing in the URL.

### App shell

| File | Responsibility |
|---|---|
| `layout.tsx` | Root HTML for every page: reads the language cookie, sets `<html lang>`, Arabic or English metadata, the motion boot script, and wraps pages in toast, session, language, motion, smooth-scroll and layout providers |
| `globals.css` | Tailwind setup, design tokens (colours, fonts, easing), `en:`/`ar:` variants, motion and reveal styles, custom component styles |
| `page.tsx` | `/`: guest landing page (signed-in users are redirected by the proxy) |
| `error.tsx` | Error screen for a failing page |
| `global-error.tsx` | Last-resort error screen when the root layout itself fails |
| `not-found.tsx` | 404 page |
| `robots.ts` | `robots.txt`: allows public pages, blocks private areas |
| `sitemap.ts` | `sitemap.xml`: static pages plus published tracks, courses and mentors (refreshed hourly) |
| `403/page.tsx` | "Forbidden" page for users without the right role |

### Sign-in and account `(auth)`, `auth`, `verify-email`

| File | Responsibility |
|---|---|
| `(auth)/layout.tsx` | Shared wrapper for the auth pages |
| `(auth)/login/page.tsx` | `/login`: sign-in page |
| `(auth)/register/page.tsx` | `/register`: sign-up page and its server action (creates the account, sends the verification email) |
| `(auth)/register/check-email/page.tsx` | Legacy URL; reopens the "check your email" modal on the register page |
| `(auth)/forgot-password/page.tsx` | `/forgot-password`: request a reset link (rate limited) |
| `(auth)/reset-password/page.tsx` | `/reset-password`: set a new password from the emailed link |
| `auth/continue/page.tsx` | Post-sign-in hop that sends the user to where they were going, with a "Signed in" toast |
| `verify-email/page.tsx` | `/verify-email`: confirms the emailed verification token |

### Public catalog and marketing

| File | Responsibility |
|---|---|
| `course/page.tsx` | `/course`: course catalog (featured tracks, popular classes, all courses, mentors) |
| `course/loading.tsx` | Loading skeleton for the catalog |
| `course/[courseId]/page.tsx` | `/course/:id`: public course page (intro video, curriculum, mentor, requirements, student work, related classes) |
| `course/[courseId]/CoursePreviewExperience.tsx` | Free-preview player and curriculum on the public course page |
| `course/[courseId]/CourseContentAccordion.tsx` | Expandable list of modules and lessons |
| `course/[courseId]/CourseBreadcrumb.tsx` | Breadcrumb trail on the course page |
| `course/[courseId]/DesktopLeftColumn.tsx` | Desktop left column (instructor card and course facts) |
| `course/[courseId]/RelatedClassesSection.tsx` | "Related classes" carousel |
| `course/[courseId]/course-page-helpers.ts` | Formatting helpers for the course page (initials, ratings, durations, requirements) |
| `course/[courseId]/loading.tsx` | Loading skeleton |
| `courses/[courseId]/page.tsx` | Legacy `/courses/:id`; redirects to `/course/:id` |
| `courses/loading.tsx` | Loading skeleton for the legacy route |
| `tracks/page.tsx` | `/tracks`: list of published tracks |
| `tracks/[slug]/page.tsx` | `/tracks/:slug`: one track and its courses |
| `tracks/loading.tsx` | Loading skeleton |
| `events/page.tsx` | `/events`: currently shows the tracks page |
| `mentors/page.tsx` | `/mentors`: mentor directory |
| `mentors/[id]/page.tsx` | `/mentors/:id`: mentor profile and their courses |
| `mentors/[id]/loading.tsx` | Loading skeleton |
| `library/page.tsx` | `/library`: library home (featured book, categories, tracks, books) |
| `library/books/[id]/page.tsx` | `/library/books/:id`: book detail |
| `library/categories/page.tsx` | `/library/categories`: all categories |
| `library/categories/[slug]/page.tsx` | One category's materials |
| `library/search/page.tsx` | Library search results |
| `certificates/[code]/page.tsx` | `/certificates/:code`: public certificate verification |

### Membership and payment

| File | Responsibility |
|---|---|
| `subscription/page.tsx` | `/subscription`: pricing plans |
| `subscription/actions.ts` | `chooseSubscriptionPlan`: sends the chosen plan to checkout (or to login first) |
| `subscription/checkout/page.tsx` | `/subscription/checkout`: payment options (Polar live; Paymob and Stripe placeholders) |
| `subscription/checkout/actions.ts` | `requestCheckout`: validates the plan, rate-limits, creates the Polar checkout and redirects to it |
| `subscription/success/page.tsx` | Return page after Polar; shows "you're in" once the webhook has granted access |
| `subscription/success/RefreshUntilActive.tsx` | Refreshes the success page until access appears |

### Learner area

| File | Responsibility |
|---|---|
| `home/page.tsx` | `/home`: signed-in dashboard (continue learning, weekly activity, track explorer) |
| `home/loading.tsx` | Loading skeleton |
| `course-access/[courseId]/page.tsx` | `/course-access/:id`: the paid course player (requires membership) |
| `course-access/[courseId]/FullCourseLearningExperience.tsx` | The course player: video, lesson list, articles, assignments, progress, completion |
| `course-access/[courseId]/actions.ts` | `completeLessonAndGetProgress`: marks a lesson complete after checking device and lesson access |
| `course-access/[courseId]/loading.tsx` | Loading skeleton |
| `lessons/[lessonId]/page.tsx` | `/lessons/:id`: standalone lesson player (requires membership) |
| `lessons/[lessonId]/loading.tsx` | Loading skeleton |
| `profile/page.tsx` | `/profile`: profile, photo, projects and activity |
| `profile/certificates/page.tsx` | The learner's certificates |
| `profile/change-password/page.tsx` | Placeholder ("coming soon") |
| `settings/page.tsx` | Settings hub (points to the profile page) |

### Staff areas

| File | Responsibility |
|---|---|
| `admin/layout.tsx` | Admin shell; re-checks the ADMIN role on the server |
| `admin/page.tsx` | `/admin`: redirects to content management |
| `admin/error.tsx`, `admin/loading.tsx` | Admin error and loading screens |
| `admin/analytics/page.tsx` | Watch time by course |
| `admin/certificates/page.tsx` | Issued certificates |
| `admin/users/page.tsx` | Learner list |
| `admin/users/[userId]/activity/page.tsx` | One learner's watch activity |
| `admin/submissions/page.tsx` | Assignment submissions queue |
| `admin/submissions/[id]/page.tsx` | One submission |
| `admin/submissions/SubmissionStatusBadge.tsx` | Coloured status label for submissions |
| `admin/content/page.tsx` | Content management home |
| `admin/content/loading.tsx` | Loading skeleton |
| `admin/content/tracks/page.tsx`, `AdminTracksPage.tsx`, `CreateTrackForm.tsx` | Track list and creation |
| `admin/content/tracks/[trackId]/page.tsx` | Edit one track |
| `admin/content/courses/page.tsx`, `AdminCoursesPage.tsx`, `AdminCourseCard.tsx`, `CreateCourseForm.tsx` | Course list, cards and creation |
| `admin/content/courses/[courseId]/page.tsx` | Edit one course: details, cover, intro video, featured flags, tags, requirements, assignment |
| `admin/content/modules/[moduleId]/page.tsx` | Edit a module and its lessons; upload lesson videos |
| `admin/content/mentors/page.tsx`, `AdminMentorCard.tsx`, `MentorsAddCard.tsx` | Mentor list |
| `admin/content/mentors/new/page.tsx`, `AddMentorForm.tsx` | Create a mentor |
| `admin/content/mentors/[id]/page.tsx`, `MentorAccountClient.tsx` | Edit a mentor; create their login account |
| `admin/content/instructors/page.tsx`, `InstructorsAdminClient.tsx` | Instructor accounts and course assignment |
| `admin/content/students/page.tsx`, `new/page.tsx`, `[id]/page.tsx`, `StudentStoryForm.tsx` | "Why students love us" stories |
| `admin/content/components/*` | Shared admin widgets: `AddCard`, `Modal`, `ConfirmDeleteButton`, `DeleteLessonButton`, `DeleteModuleButton`, `ArabicNameField`, `ArticleEditor`, `CourseAssignmentEditor`, `AdminVideoPreview`, `MuxUploadButton` (lesson video upload), `ReplaceVideoButton`, `CourseIntroUploadButton`, `MentorPhotoUpload`, `MentorSignatureUpload` |
| `instructor/layout.tsx`, `page.tsx` | Instructor shell and dashboard (assigned courses) |
| `instructor/courses/[courseId]/page.tsx` | Learner roster and progress for one course |
| `mentor/layout.tsx`, `page.tsx` | Mentor shell and dashboard |
| `mentor/courses/[courseId]/page.tsx` | Learners and submissions for one course |
| `mentor/submissions/page.tsx` | Review queue |
| `mentor/submissions/[submissionId]/page.tsx`, `MentorReviewForm.tsx` | Review one submission and give feedback |
| `mentor/messages/page.tsx` | Notifications that link to submissions |

## `src/app/api`: HTTP endpoints

Each `route.ts` exports functions named after HTTP methods. All admin routes are also protected by the proxy.

| Route | Methods | Responsibility |
|---|---|---|
| `auth/[...nextauth]` | GET, POST | NextAuth sign-in, sign-out, session, OAuth callbacks |
| `auth/register` | POST | JSON registration (same response for new and existing emails) |
| `auth/resend-verification` | POST | Resend the verification email (rate limited) |
| `me` | GET | Current user |
| `profile`, `profile/photo` | PATCH, POST | Update profile fields; upload profile photo |
| `search` | GET | Catalog search (rate limited) |
| `health` | GET | Uptime check: 200 or 503 |
| `catalog/tracks`, `catalog/tracks/[slug]`, `catalog/courses/[courseId]`, `catalog/courses-menu` | GET | Public catalog data; the courses menu feeds the header mega-menu |
| `learning/progress/lesson/[lessonId]` | GET, PATCH | Read and save video position (checks lesson access) |
| `learning/progress/course/[courseId]`, `learning/progress/track/[trackId]` | GET | Course and track completion |
| `learning/courses/[courseId]/assignment` | GET | The course assignment and the learner's submission |
| `learning/assignments/[assignmentId]/submissions`, `.../submit` | POST | Save a draft; submit for review |
| `learning/submissions/[submissionId]/files`, `learning/submissions/files/[fileKey]` | POST, GET | Upload and download submission files (private bucket) |
| `video/playback/[lessonId]` | GET | Signed Mux playback token after the access check (rate limited) |
| `webhooks/mux` | POST | Mux events: upload finished, asset ready (signature verified) |
| `webhooks/polar` | POST | Polar events: grant or reverse membership (signature verified) |
| `instructor/courses`, `instructor/courses/[courseId]/learners` | GET | Instructor's courses and rosters |
| `mentor/stats`, `mentor/courses`, `mentor/submissions`, `mentor/submissions/[id]` | GET, PATCH | Mentor dashboard data and reviews |
| `admin/tracks`, `admin/tracks/[trackId]` | GET, POST, PATCH, DELETE | Track management |
| `admin/courses`, `admin/courses/[courseId]` | GET, POST, PATCH, DELETE | Course management |
| `admin/courses/[courseId]/assignment` | GET, POST, PUT, DELETE | Course assignment management |
| `admin/courses/[courseId]/instructor-photo` | POST, DELETE | Course instructor photo |
| `admin/courses/[courseId]/intro-video/upload`, `.../sync` | POST | Intro video upload to Mux and status sync |
| `admin/modules`, `admin/modules/[moduleId]` | GET, POST, PATCH, DELETE | Module management |
| `admin/lessons`, `admin/lessons/[lessonId]` | GET, POST, PATCH, DELETE | Lesson management |
| `admin/lessons/[lessonId]/upload`, `admin/video/uploads`, `admin/lessons/[lessonId]/video/sync` | POST, GET | Lesson video upload and status sync |
| `admin/mentors`, `admin/mentors/[id]`, `.../account`, `.../photo`, `.../signature` | various | Mentor profiles, login accounts, photo, certificate signature |
| `admin/instructors`, `admin/course-instructors` | GET, POST | Instructor accounts and course assignment |
| `admin/student-stories`, `.../[id]`, `.../[id]/project` | various | Student stories and their project images |
| `admin/submissions/[id]`, `admin/submissions/pending-count` | GET, PATCH | Review submissions; pending badge count |

---

## `src/components`: user interface

| Folder / file | Responsibility |
|---|---|
| `SessionProvider.tsx` | Makes the NextAuth session available to client components |
| `Toast.tsx` | Toast notification system (`useToast`) |
| `ToastFromUrl.tsx` | Shows a toast from a `?toast=` URL parameter, then removes it |
| `analytics/MicrosoftClarity.tsx` | Loads Clarity in production |
| `analytics/MicrosoftClarityIdentify.tsx` | Tags Clarity sessions with a pseudonymous user id |
| **`auth/`** | Login, register and password-reset screens: `AuthPageShell` (page frame), `AuthLoginPanel`, `AuthRegisterPanel`, `AuthPasswordResetPanels`, `CheckEmailModal`, `AuthBrandingAside` and `AuthGreenPanel` (decorative side), `AuthLocaleButton` (language switch), `auth-form-ui.tsx` (shared fields and styles), `auth-oauth-icons.ts` (Google button), `auth-theme.ts` (colours and spacing) |
| **`cards/`** | Catalog cards: `CatalogShowcaseCard` (the large track/course card), `catalog-showcase-map.ts` (turns database rows into card props), `landing-showcase-cards.ts` (static landing cards), `index.ts` (exports) |
| `certificates/CertificateDocument.tsx`, `Certificate.module.css`, `PrintCertificateButton.tsx` | Printable certificate and its print button |
| `course/CourseComingSoonPanel.tsx` | "Coming soon" panel on a course page |
| `gsap/GsapAnimationLayer.tsx` | GSAP animations on the guest landing (hero entrance, reveals, hover) |
| **`home/`** | Signed-in home: `LoggedInHome` (page composition), `ContinueLearningSection`, `TrackActivitySection`, `ActivityScheduleCard` (weekly schedule), `ActivityProgressMobileCard`, `WeeklyActivityBarCard`, `HomeTrackExplorerSection` (track filter and carousel, also on the landing), `LibraryPopularsSection` |
| `i18n/Tr.tsx`, `i18n/LocalizedText.tsx` | Client translation helpers: `useT`/`<Tr>` for UI strings, `LocalizedText` for authored English/Arabic content |
| **`landing/`** | Guest landing page: `GuestLanding` (composition), `HeroSection`, `LandingCurrentMostsSection` (popular mentors), `LandingEverythingInOneSection`, `LandingFaqSection`, `LandingGetStartedCtaSection`, `LandingMentorCard`, `LandingMentorModal`, `LandingMobileFooter`, `LandingSocialSignInRow`, `index.ts` |
| **`layout/`** | Site chrome: `ConditionalLayout` (picks the shell by route), `SiteLayout`, `SiteMain`, `SiteHeader` (picks guest or signed-in header), `GuestSiteHeader`, `LoggedInAppHeader`, `MobileSiteNavBar`, `MobileNavDrawer`, `CoursesMegaMenu`, `SearchBar`, `UserMenu`, `HeaderLanguageToggle`, `SiteFooter`, `ConditionalSiteFooter`, `AdminLayout`, `RouteLoading` |
| **`learn/`** | Course catalog page: `LearnFeaturedCoursesPanel`, `LearnPopularClassesSection`, `LearnPopularFigmaTile`, `LearnAllCoursesSection`, headings (`LearnAllCoursesHeading`, `LearnClassesCarouselHeading`, `LearnPopularClassesHeading`), filters (`LearnCoursesSidebar`, `LearnCoursesSidebarAside`, `LearnCoursesPageFilterBar`, `CoursesPageExpandableNav`, `course-filter-actions.ts`), carousel helpers (`LearnCarouselEdgeNav`, `ScaledCatalogShowcaseCard`, `learn-carousel-swiper-config.ts`, `useLearnCarouselSwiper`, `useCourseCarouselMetrics`, `useBleedRightToViewport`), types (`learn-all-courses-types.ts`, `learn-popular-types.ts`) |
| `learning/AssignmentSubmissionPanel.tsx` | Assignment brief, file upload and submit, inside the course player |
| **`library/`** | Library section (content is static, from `library-books.ts` and `library-categories.ts`): header, featured book, welcome, category grid and cards, track tags, book grid and detail views, articles, podcasts, search form and results, material cards, sorting, `library-card-copy.ts` (card text) |
| `motion/MotionProvider.tsx`, `motion/motion-boot.ts` | Site-wide scroll reveals, card hover lift, page fade; the boot script that enables them before first paint |
| **`profile/`** | Profile page: `ProfileHeader`, `ProfileInfoPanel`, `ProfilePhotoFrame`, `ProfileEditModal`, `ProfileProjectsSection`, `ProfileSectionTabs` |
| `providers/LocaleProvider.tsx` | Client language state: starts from the server's cookie, switches language, saves the cookie |
| `providers/LenisProvider.tsx` | Smooth scrolling |
| `students/StudentsRatingWorkSection.tsx`, `StudentProjectThumb.tsx`, `student-rating-types.ts` | "Why students love us" section with project thumbnails |
| `subscription/SubscriptionPricingCard.tsx`, `SubscriptionMobileCards.tsx`, `ChoosePlanForm.tsx` | Pricing cards (desktop and mobile) and the plan form |
| `tracks/TrackCoursesSection.tsx` | Course grid on a track page |
| `ui/ProgressBar.tsx` | Generic progress bar |
| **`video/`** | `HlsPlayer` (hls.js player), `AuthorizedHlsPlayer` (fetches a signed token and refreshes it), `ProgressTracker` (saves watch position), `VideoWatermark` (moving per-viewer watermark) |

## `src/lib`: shared helpers

Code safe to use on both server and client.

| File | Responsibility |
|---|---|
| `auth/signOutToHome.ts` | Signs out with a full page reload so protected pages are not re-rendered without a session |
| `catalog-cover-images.ts` | Picks a cover image for a track or course, with static fallbacks |
| `static-course-covers.ts` | Built-in cover images keyed by course title |
| `content/course-card-stats.ts` | Lesson count, duration and level labels for course cards |
| `content/course-type-badge.ts` | Picks the one type badge shown on a course card |
| `course-access.ts` | Free preview lesson rules and course URLs (public vs paid) |
| `fonts/pangea.ts` | Loads the Pangea variable font |
| `i18n/dictionary.ts` | English → Arabic UI dictionary and `translateUi` |
| `i18n/locale.ts` | Language cookie name, parsing, direction (`rtl`/`ltr`) |
| `learning-activity.ts` | Activity types and formatting (hours:minutes, Arabic digits) |
| `route-match.ts` | `isUnder`: segment-exact path matching for the proxy |
| `safe-internal-path.ts` | Accepts only same-site paths for `?next=` redirects (prevents open redirects) |
| `site-url.ts` | The site's public URL |
| `subscription-plans.ts` | Plans and the membership price (EGP and USD, 12 months) |
| `subscription-routes.ts` | Pricing and checkout URLs |

## `src/server`: business logic and data access

Server-only code. Pages, API routes and server actions call into these modules; they talk to the database, Mux, Polar, Resend and Supabase Storage.

### `auth/`: identity and sessions

| File | Responsibility |
|---|---|
| `auth.service.ts` | Registration: password rules, argon2 hashing, verification email, no email enumeration |
| `password.ts` | Hash and verify passwords (argon2id, legacy bcrypt), constant-time dummy check |
| `password-reset.service.ts` | Request, check and complete password resets |
| `one-time-token.ts` | Generates emailed tokens and stores only their SHA-256 hash |
| `require.ts` | `requireAuth`, `requireRole`, `requirePageRole` guards |
| `live-session.ts` | Reads the session and confirms the device session is still active (`requirePageSession`, `requireApiSession`) |
| `device-session.ts` | One active session per device kind; signing in on a second phone signs out the first |
| `device-classification.ts` | Classifies phone / tablet / desktop from the User-Agent; hashes IP addresses |
| `mentor-context.ts` | Resolves the mentor profile for a signed-in mentor |
| `adminUsers.service.ts` | Admin creation of instructor accounts and course assignment |
| `post-auth-next.ts` | Remembers where to send the user after OAuth sign-in (http-only cookie) |

### `authz/`, `subscription/`, `payments/`: access and money

| File | Responsibility |
|---|---|
| `authz/lesson-access.ts` | The single rule for lesson access: free preview, admin, assigned instructor, or active membership |
| `subscription/access.service.ts` | `hasActiveSubscription`: active subscription or entitlement |
| `subscription/require-subscription.ts` | Page and API guards that require membership |
| `subscription/entitlement.service.ts` | Grants and reverses membership from verified payments, exactly once per event; the gated dev self-grant |
| `subscription/subscribe.service.ts` | Membership status for display; legacy self-grant entry point |
| `subscription/checkout-attempt.ts` | Logs which payment option a learner chose |
| `payments/polar.ts` | Polar client and checkout creation |

### `content/`: catalog and admin CMS

| File | Responsibility |
|---|---|
| `public.service.ts` | All public catalog reads (tracks, courses, mentors, home explorer, course page), cached for 60 s |
| `admin.service.ts` | Admin create, read, update and delete for schools, tracks, courses, modules and lessons |
| `content.schemas.ts` | Zod schemas for admin content input |
| `learn.service.ts` | Course with modules, lessons and videos for the course player |
| `assignment.service.ts` | Course assignment management |
| `admin-submissions.service.ts` | Submission queue and review for admins |
| `admin-analytics.service.ts` | Watch time by course |
| `mentor.service.ts` | Mentor dashboard, courses, learners and reviews |
| `instructor.service.ts` | Instructor courses and learner rosters |
| `student-stories.service.ts` | Student stories (public list cached; admin CRUD) |
| `course-catalog-tags-sql.ts`, `course-requirements-sql.ts`, `featured-mentor-sql.ts`, `featured-trending-sql.ts`, `landing-popular-mentor-sql.ts` | Raw SQL for catalog tags, course requirements and featured ordering (fixed column names, parameterised values) |
| `revalidate-public-paths.ts` | Clears cached catalog pages after admin edits |

### `learning/`, `progress/`, `home/`, `certificates/`: learning data

| File | Responsibility |
|---|---|
| `learning/progress.service.ts` | Saves video position; completes a lesson at 90% or the last 30 s; course and track progress |
| `learning/progress.schemas.ts` | Request schema for saving progress |
| `learning/submission.service.ts` | Learner drafts, submission and files |
| `progress/course-progress.service.ts` | Ordered lessons, completed lessons, marking a lesson complete |
| `home/continue-learning.service.ts` | "Continue learning" cards |
| `home/learning-activity.service.ts` | Weekly activity and watch-time aggregates (capped per request to stop inflation) |
| `home/user-learning-progress.service.ts` | Overall learning progress percentage |
| `certificates/certificate.service.ts` | Issues certificates for approved submissions; readable codes |

### `video/`, `mux/`: video

| File | Responsibility |
|---|---|
| `video/mux.ts` | Mux client, playback URLs, token lifetimes, upload CORS origin |
| `video/video.service.ts` | Lesson upload creation and signed playback for a lesson |
| `video/playback-access.ts` | Wraps lesson access for playback |
| `video/webhook.ts` | Verifies Mux webhook signatures |
| `video/watermark.ts` | Pseudonymous viewer marker for the watermark (no personal data) |
| `mux/config.ts` | Reads and validates Mux settings |
| `mux/mux.service.ts` | Direct uploads (lessons and intro videos) and asset syncing |
| `mux/playback-id.ts` | Prefers signed playback IDs |

### `storage/`, `security/`, `email/`, platform

| File | Responsibility |
|---|---|
| `storage/object-storage.ts` | Upload, read and delete files in Supabase Storage (local disk in development) |
| `storage/upload.ts` | Validates an upload's size and real file type |
| `storage/file-signature.ts` | Detects file type from the first bytes, not the browser's claim |
| `storage/submission-files.ts` | Storage keys for submission files |
| `security/rate-limit.ts` | Postgres-backed rate limits for sign-in, signup, email, search, playback, uploads and checkout |
| `security/request-context.ts` | Client IP and user agent, and keyed hashing of identifiers |
| `security/security-events.ts` | Append-only security log (sign-ins, rate limits, device replacements) |
| `email/resend.client.ts` | Sends emails through Resend; the app's base URL |
| `email/verification.service.ts` | Creates and checks email verification tokens |
| `db/prisma.ts` | Prisma client through the Postgres driver adapter; retry on pool exhaustion, 503 when the pool stays exhausted |
| `db/connection.ts` | Turns `DATABASE_URL` into pool settings: size, timeouts, TLS (verified with `DATABASE_CA_CERT`), schema |
| `env.ts` | Startup configuration check (fatal only for database, auth secret or self-grant) |
| `i18n.ts` | Server-side language (`getLocale`) and translation (`getServerT`) |
| `lib/errors.ts` | `AppError`: expected errors with an HTTP status |
| `lib/route.ts` | `handleRoute`: turns `AppError` into JSON responses |
| `observability/query-timing.ts` | Optional per-request database timing (`PERF_TIMING`) |
| `user/readProfile.ts`, `user/readProfession.ts` | Profile fields read with raw SQL (tolerates older database schemas) |

## `src/types`

| File | Responsibility |
|---|---|
| `next-auth.d.ts` | Adds `id`, `roles`, `country`, `profession` and the device session id to the NextAuth types |
| `course-catalog-tags.ts` | Catalog filter tags an admin can toggle per course |
| `home-track-explorer.ts` | Types for the home track explorer |
| `landing-mosts-mentor.ts` | Types for the popular-mentor cards |

## `prisma/` and `scripts/`

| Path | Responsibility |
|---|---|
| `prisma/schema.prisma` | The data model: 34 models (users and roles, sessions and devices, schools → tracks → courses → modules → lessons, video, progress, subscriptions, entitlements, payment events, mentors, assignments, submissions, certificates, messages, security, rate limits, student stories) |
| `prisma/migrations/` | Database migrations, applied with `npm run db:deploy` |
| `prisma/seed.ts` | Creates or updates the admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `scripts/test-*.ts` | Connection checks for the database, Mux and Resend |
| `scripts/ensure-user-can-login.ts`, `reset-user-password.ts`, `verify-user-email.ts`, `create-learner.ts` | Account support tasks |
| `scripts/grant-subscription.ts`, `subscribe-user.ts` | Give membership by hand (respects the self-grant guard) |
| `scripts/delete-user.ts`, `remove-admin-role.ts` | Account administration |
| `scripts/lib/prisma-client.ts` | Prisma client for scripts and the seed, with the same connection settings as the app |
| `scripts/import-*.ts`, `apply-*.ts`, `assign-*.ts`, `mark-*.ts`, `migrate-*.ts`, `scripts/catalog/`, `scripts/lib/catalog-import.ts` | One-off content imports and data fixes; check before running |
| `scripts/apply-instructor-columns.sql` | Hand-written SQL used during an earlier migration |
| `scripts/sql/create-app-role.sql` | Creates a restricted Postgres role for the app (see `docs/security/`) |

## Tests

20 test files, 218 tests, run with `npm test` (no database needed). They sit next to the code they test.

| Area | Test files |
|---|---|
| Route protection | `proxy.test.ts` |
| Sign-in and sessions | `auth.test.ts`, `server/auth/device-session.test.ts`, `device-classification.test.ts`, `password-reset.test.ts` |
| Lesson access | `server/authz/lesson-access.test.ts` |
| Payments | `app/api/webhooks/polar/route.test.ts`, `app/subscription/checkout/actions.test.ts`, `server/subscription/entitlement.service.test.ts`, `checkout-attempt.test.ts`, `lib/subscription-routes.test.ts` |
| Video | `server/video/mux.test.ts`, `watermark.test.ts`, `components/video/VideoWatermark.test.ts` |
| Platform | `server/env.test.ts`, `server/security/rate-limit.test.ts`, `server/storage/storage.test.ts`, `server/observability/query-timing.test.ts`, `app/api/health/route.test.ts`, `lib/i18n/locale.test.ts` |

Not yet covered: an end-to-end browser test of the full journey (register → verify → sign in → pay → watch). See `docs/IMPROVEMENTS_AND_PAYMENTS.md`.
