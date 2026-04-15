# Alwerash — platform brief

## One-line definition

**Alwerash** is a **subscription-based online learning platform** focused on **design and creative skills**, positioned for the **MENA** region. Learners pay for access (subscription model); the product emphasizes **tracks, courses, and video-led lessons**, with **admin-managed content**, **mentors**, and **progress tracking**.

---

## Product positioning (from app metadata)

- **Tagline framing:** “Subscription education for **design & creative**.”
- **Value proposition (marketing copy):** Learn from industry experts; **subscribe once**, get access to **courses** in design, motion, and related creative skills.
- **README positioning:** Subscription education platform (**MENA**, **design/creative**); described as early foundation / “Week 1 foundation” in repo docs.

---

## Who uses the system (roles)

The data model defines `Role` enum values used for authorization:

| Role | Purpose (as implemented in patterns) |
|------|--------------------------------------|
| **GUEST** | Unauthenticated / minimal access concept in schema. |
| **LEARNER** | Default signed-in student; consumes courses, tracks progress. |
| **INSTRUCTOR** | Can be assigned to courses (`CourseInstructor`); participates in assignments/messaging patterns where applicable. |
| **ADMIN** | Full content hub: schools, tracks, courses, modules, lessons, mentors; redirects to `/admin` from learner home when applicable. |

Users can hold multiple roles via `UserRole` (unique per user+role).

---

## Information architecture (content hierarchy)

Canonical hierarchy in Prisma comments and relations:

**School → Track → Course → Module → Lesson**

- **School**  
  - Top-level organizational bucket (e.g. “schools” of creative disciplines).  
  - Fields: title, unique **slug**, description, **order**, **published** (defaults false).  
  - Has many **tracks**. Deleting a school **cascades** to its tracks.

- **Track**  
  - Belongs to a **school**.  
  - Fields: title, unique **slug**, description, optional **coverImage**, **order**, **published** (defaults false).  
  - Public marketing and `/tracks/[slug]` flows typically filter **`published: true`**.  
  - Has many **courses**.

- **Course**  
  - Optional `trackId` (if track removed, course can remain with track unset per `onDelete: SetNull`).  
  - Optional **mentor** (`mentorId`, `onDelete: SetNull`).  
  - Fields: title, summary, cover, instructor display fields, intro video (Mux), **order**, **published**, **featured** ordering for “New” / “Most played” sections, **totalDurationMinutes**, **rating**.  
  - Has **modules**, **threads** (course messaging), intro video uploads, **instructors** (many-to-many with `User`).

- **Module**  
  - Ordered container inside a course; deleting a module cascades to lessons.

- **Lesson**  
  - Types: **VIDEO**, **ARTICLE**, **RESOURCE**.  
  - **published** flag, ordering.  
  - VIDEO lessons tie to **Mux** (`LessonVideo` with asset/playback IDs) and **VideoUpload** pipeline.  
  - Can have **assignments** and learner **progress**.

---

## Mentors (distinct from “instructor” display fields)

- **`Mentor`** model: name, optional photo URL, optional **certificateName** (used as a short professional label on cards), optional **aboutMe**.  
- Linked to **courses** as the “face” mentor; separate from `CourseInstructor` (platform users assigned to teach/manage a course).

---

## Learning, assignments, and communication

- **LessonProgress** per user+lesson: watch time, last position, optional **completedAt**.  
- **Assignment** / **Submission** / **SubmissionFile**: structured homework with statuses (draft → submitted → reviewed, etc.), instructor feedback, optional grade.  
- **Thread** / **Message** / **ThreadParticipant**: messaging; threads can be tied to a **course** (or DM type in enum).

---

## Commerce and access control (data model)

- **Subscription**: ties a user to **Stripe** or **Paymob** (`SubscriptionProvider`), external subscription id, **status** (active, canceled, past_due, trialing, etc.), plan, currency, billing period end.  
- **Entitlement**: product enum includes **ALL_ACCESS**; status active/expired/revoked; optional expiry—models “what the user is allowed to use” alongside or derived from billing.  
- **PaymentEvent**: idempotent-ish webhook/event log for payment providers.

(Exact checkout UX and enforcement points live in app routes/services; schema encodes the billing/subscription concepts.)

---

## Video and media

- **Mux** is the primary video stack: lesson videos, uploads, webhooks/events (`VideoEvent`), course intro uploads.  
- Env and ops: README references **Supabase** for DB (`DATABASE_URL` / `DIRECT_URL`), **NextAuth** secret/URL, optional **Mux** tokens for uploads (see server mux README in repo).

---

## Technology stack (repository facts)

- **Framework:** **Next.js 15** (App Router), **React 19**.  
- **Language:** **TypeScript**.  
- **ORM / DB:** **Prisma 6** + **PostgreSQL** (Supabase in docs).  
- **Auth:** **NextAuth v4** with **Prisma adapter** (sessions, accounts, verification tokens). Password hashing appears in dependencies (argon2/bcrypt in package.json).  
- **UI:** Tailwind-style utility classes in components; custom marketing typography (e.g. Pangea trial + DM Sans). **GSAP** for landing animations. **Swiper** for carousels.  
- **Video:** **Mux** Node SDK, **hls.js** for playback.  
- **Dev server:** configured in `package.json` to run on **port 3002** (`next dev -p 3002`).

---

## Main user journeys (routes / behavior)

### Guest (signed out)

- **`/`** — Marketing **guest landing**: hero driven by **published tracks**; catalog-style **track** tiles with links to **`/tracks/[slug]`**; mentor “current mosts” strip from **DB mentors**; FAQ/CTA; instructors typically redirected away.  
- **`/learn`** — Course discovery section (**HomeCoursesSection**): “New” and “Most played” driven by **featured** course ordering + fallbacks; **fields** sidebar from **track titles** when available.  
- **`/tracks`**, **`/tracks/[slug]`** — Public track library and track detail with published courses.  
- **`/mentors`**, **`/mentors/[id]`** — Public mentor directory and profile.  
- **Auth:** `/login`, `/register`.

### Signed-in learner

- **`/home`** — Personalized home: welcome, **continue learning** cards, topic tag placeholders, **“What to learn next”** carousel using **track showcase data** from admin (published tracks), **current mosts** mentors, etc.  
- **Admins** hitting `/home` redirect to **`/admin`**.

### Admin

- **`/admin`** and **`/admin/content/...`** — CRUD for **schools, tracks, courses, modules, lessons**, **mentors**, instructor-related admin UI; delete actions where implemented; **revalidation** of public paths after some mutations so marketing pages refresh.

### Instructor

- Separate **instructor** portal routes (under app) for assigned teaching workflows (exact scope evolves in repo).

---

## Publishing rules (critical for “why doesn’t X show?”)

- **Schools**, **tracks**, **courses**, and **lessons** use **`published`** booleans (default **false** in schema for several entities).  
- Public listings and landing sections generally query **`published: true`** only.  
- Creating content in admin without enabling **Published** keeps it **draft** and off public surfaces.

---

## Branding / naming in codebase

- Project name: **Alwerash** (spelling as in repo and metadata).  
- Marketing strings sometimes use **“ElWerash”** in FAQ copy—treat as same product name variant in UI text unless product team standardizes one spelling.

---

## Operations & local development (from README)

- Install deps, `prisma generate`, copy **`.env.example` → `.env`**, fill DB + `AUTH_SECRET` + `AUTH_URL`, seed admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).  
- Common scripts: `dev`, `build`, `lint`, `typecheck`, Prisma migrate/deploy/studio, several **content maintenance scripts** (mentors, featured courses, etc.).

---

## What the platform is *not* (bounded scope in this repo snapshot)

- Not a generic MOOC-only catalog without subscriptions—the **subscription + entitlement** models are first-class.  
- Not limited to a single course format: lessons support **video, article, resource**.  
- Not “static marketing only”: **guest and home surfaces are wired to real Prisma data** for tracks and mentors where implemented.

---

## Elevator pitch (copy-ready)

> **Alwerash** is a Next.js–based subscription learning platform for **design and creative skills**, aimed at the **MENA** market. Organizations run **schools** and **tracks** of **published courses** made of **modules** and **lessons** (often **Mux** video). Learners subscribe (e.g. **Stripe/Paymob**), watch with **progress tracking**, can complete **assignments**, and use **course messaging**; **mentors** and **instructors** model real teaching relationships. **Admins** manage the catalog and media; **guest** and **member** home experiences highlight live **tracks** and **mentors** from the database.

---

*Derived from README.md, prisma/schema.prisma, src/app/layout.tsx metadata, and implemented app routes.*
