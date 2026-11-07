# Alwerash: improvements, roadmap and payments plan

What to improve next for speed, responsiveness and security; what to build in future versions; and how to finish Polar and add Paymob. Each item says why it matters and roughly how much work it is. The numbers come from the production build and the code as of November 2026.

Companion documents: `README.md` (setup and deployment) and `docs/CODEBASE_GUIDE.md` (what each file does).

## Contents

1. [Already done in this round](#1-already-done-in-this-round)
2. [Make the site faster](#2-make-the-site-faster)
3. [Make it more responsive (phone, tablet, Arabic)](#3-make-it-more-responsive-phone-tablet-arabic)
4. [Make it more secure](#4-make-it-more-secure)
5. [Future versions](#5-future-versions)
6. [Payments: Polar and Paymob](#6-payments-polar-and-paymob)

Effort scale: **S** = under a day, **M** = 1–3 days, **L** = a week or more.

---

## 1. Already done in this round

- Removed 25 unused components and modules, 36 dead functions and the unused `react-easy-crop` dependency: about 3,900 lines deleted from `src/`.
- Removed the unused public `/api/stats` endpoint, which ran several uncached aggregate queries per request.
- Lint is fully clean (0 warnings).
- **Security fix:** the signup form was sending anything typed into its placeholder card fields (card number, CVV), or autofilled by the browser, to the server. It now sends only name, email and password, and card autofill is off.
- Every staff area in the middleware now matches by whole path segment (the `/mentors` bug class can't recur).
- Tests went from 173 to 218: route-guard matrix, Polar webhook, checkout action, health endpoint.
- The catalog service reuses the shared database-error check.
- README corrected: row-level security is enabled on every table, so Supabase's public data API can't read the app's data.

---

## 2. Make the site faster

Production build, first-load JavaScript per page:

| Page | First-load JS |
|---|---|
| `/course/[courseId]` (public course page) | 314 KB |
| `/course-access/[courseId]` (course player) | 279 KB |
| `/lessons/[lessonId]` | 264 KB |
| `/` (guest landing) | 258 KB |
| `/home` | 215 KB |
| `/course` (catalog) | 202 KB |
| Shared by every page | 103 KB |

### 2.1 Shrink the font (biggest single win) · S–M

`public/fonts/FwTRIAL-PangeaVAR.woff2` is **792 KB** and every page downloads it before text can render in that font. That is more than all the JavaScript on most pages.

- When you buy the Fontwerk web licence (required anyway; this file is a trial), ask for the **web subset** or static weights (Regular, Medium, Bold). A Latin subset of 2–3 weights is typically 60–120 KB in total.
- Load only the weights the design uses, through `next/font/local` with an explicit `weight` list.
- Arabic text currently falls back to the system font. Choose an Arabic web font that pairs with Pangea (for example IBM Plex Sans Arabic or Noto Kufi Arabic, both free) and load it with `next/font`. It will look consistent and won't shift layout when it loads.

### 2.2 Optimise images · S–M

- **36 images use `unoptimized`**, so Next.js serves them at full size without resizing or converting to WebP/AVIF. Most are remote images from Supabase Storage or Mux. Add those hosts to `images.remotePatterns` in `next.config.ts` (`<project>.supabase.co`, `image.mux.com`) and remove `unoptimized`. Every card image then gets resized for the screen it's shown on.
- Add `images.formats: ["image/avif", "image/webp"]` to `next.config.ts`.
- Compress the large static files in `public/`: `library/` is 7.8 MB, and single files reach 730 KB (`student-projects/salma-nabil-project.jpg`, `library/books/book-detail-cover.png`). Converting to WebP at quality 80 usually cuts 60–80%.
- Give the first large image on each page `priority` (or `fetchPriority="high"`) so it loads first; it is usually the Largest Contentful Paint element.

### 2.3 Send less JavaScript · M

- **Load the video player only when needed.** `hls.js` (about 60 KB gzipped) ships with the public course page even before anyone presses play. Load it with `dynamic(() => import(...), { ssr: false })` in `HlsPlayer`, or start loading on hover or click of the play button.
- **Load carousels lazily.** Swiper is in every catalog bundle. Below-the-fold carousels can load with `next/dynamic` when they scroll into view.
- **Drop Lenis smooth scrolling on touch devices.** Phones already scroll smoothly, and Lenis adds JavaScript and main-thread work on every scroll.
- **Fewer client components.** 128 of 225 component files are `"use client"`. Many are client-side only because of small interactive parts (a toggle, a translation hook). Move the interactive part into a small client component and keep the rest server-rendered.
- Check bundles with `@next/bundle-analyzer` (one-time setup, S).

### 2.4 Database and server response time · M

- **Connection pool.** Production uses 1 database connection per server instance, so the `Promise.all` calls in pages run one query at a time. Turn on `PERF_TIMING=1` in a preview, measure `/course`, `/home` and `/course-access`, then try the Supabase **transaction pooler** (port 6543) with `DB_CONNECTION_LIMIT=3–5`. `docs/performance/00-measurement.md` explains the trade-off.
- **Roles re-read on every request.** The JWT callback queries `user_roles` on every `auth()` call so role changes apply immediately. Cache that lookup for about 60 seconds per user (or re-read only when the device session is checked) to save a query per request.
- **Indexes.** After a week of real traffic, look at Supabase → Database → Query performance and add indexes for the slowest queries.

### 2.5 Caching and the language cookie · M

Since Arabic is rendered on the server, every page reads the language cookie, so the landing page renders per request instead of being cached as a whole. Data is still cached for 60 s, so this is fine at launch. For more speed and **Arabic search engine results**, move the language into the URL (`/ar/...`, via middleware rewrites). Pages can then be cached per language and Google can index the Arabic pages. See 5.2.

### 2.6 Measure it · S

- Turn on **Vercel Speed Insights** (real-user Core Web Vitals) and check the LCP, INP and CLS of the landing, catalog and course pages.
- Add Lighthouse CI to GitHub Actions for `/`, `/course` and `/course/[id]` on the preview deployment, so regressions show up in pull requests.

---

## 3. Make it more responsive (phone, tablet, Arabic)

### Findings

- **27 files use fixed widths of 700 px or more** (for example `w-[1125px]`, `w-[1055px]`), copied from the desktop Figma frames. On smaller screens these sections either scroll sideways or are scaled down as one block (`ScaledCatalogShowcaseCard`), which makes text tiny on phones.
- **888 inline `style={{ ... }}` objects** carry fixed pixel sizes. Inline styles can't change by screen size, so each one blocks a responsive layout.
- Arabic layout is mirrored region by region (`LocaleMirror`) rather than for the whole page.

### Plan

1. **Pick the test sizes and screenshot them automatically · S.** 360, 390, 768, 1024, 1280 and 1440 px wide, in English and Arabic. A Playwright script that screenshots the key pages at each size on every preview deployment catches layout breaks before users do.
2. **Replace fixed widths with fluid ones · M per page.** `w-[1125px]` becomes `w-full max-w-[1125px]`. Fixed grids become `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Card rows become horizontal scrollers only on phones. Start with the pages people use most: `/course`, `/course/[id]`, `/home`, the course player.
3. **Move inline styles to Tailwind classes · ongoing.** Each time a component is touched, move its `style={{ fontSize: "36px" }}`-type values into classes with breakpoints (`text-2xl lg:text-4xl`). Put repeated values (brand colours, the Pangea font family) in `globals.css` tokens.
4. **Fluid type.** Use `clamp()` for headings (for example `text-[clamp(1.75rem,4vw,2.25rem)]`) so they scale smoothly between phone and desktop.
5. **Whole-page right-to-left · M.** Set `dir="rtl"` on `<html>` for Arabic (the layout already reads the cookie), use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) everywhere, and retire `LocaleMirror`. Carousels (Swiper) need `dir="rtl"` passed in too.
6. **Touch details · S.** Tap targets at least 44 × 44 px, `min-h-dvh` instead of `100vh` (mobile browser bars), no hover-only actions on touch screens.

---

## 4. Make it more secure

### Already in place

Argon2id passwords; email verification; no email enumeration; rate limits on sign-in, signup, emails, password reset, search, playback, uploads and checkout; device sessions with revocation; role checks in middleware and on the server; one central lesson-access rule; signed Mux playback with a per-viewer watermark; Polar and Mux webhook signature checks; payment events applied exactly once; uploads checked by real file type; private bucket for submissions; security headers; row-level security on every table; parameterised SQL; startup configuration check; security event log.

### Do next

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | **Remove the card fields from the signup design** | They no longer reach the server, but users may still type card numbers into a form that doesn't charge them. Payment happens on Polar or Paymob. Replace the section with "You'll choose a payment method after signing up". | S |
| 2 | **Enforce the content security policy** | It's report-only. Review the reports on a preview, then switch `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. Later, add nonces to drop `'unsafe-inline'` for scripts. | S then M |
| 3 | **Two-factor sign-in for admins and mentors** | One stolen admin password gives full control of content and users. Add TOTP (authenticator app), required for ADMIN. | M |
| 4 | **Shorter sessions for staff** | Sessions last 30 days (NextAuth default). Use 12–24 hours for ADMIN, or require re-entering the password for destructive admin actions. | S |
| 5 | **Keep Clarity out of private pages** | Clarity session replay runs on every page in production, including admin, profile and the course player. Load it only on public marketing pages, or add `data-clarity-mask="true"` on private areas. Mention it in the privacy policy. | S |
| 6 | **Least-privilege database user** | The app connects as `postgres`, which can drop tables. Run `scripts/sql/create-app-role.sql` and point the runtime `DATABASE_URL` at that role; keep `postgres` for migrations only. | S |
| 7 | **Error tracking and alerts** | Add Sentry (or similar) so server errors, webhook failures and 503s alert you instead of waiting for a user report. Add an uptime monitor on `/api/health`. | S |
| 8 | **Automatic dependency updates** | Turn on Dependabot or Renovate for weekly pull requests, and `npm audit --omit=dev` in CI. 10 advisories remain inside Next's build-time postcss, the Prisma CLI and the `@auth/core` copy bundled with next-auth v4; they go away with the major upgrades in 5.4. | S |
| 9 | **Vercel Firewall rules** | The rate limiter allows requests if its database is unavailable (deliberately, so sign-in never locks everyone out). Add a Vercel Firewall rate rule on `/api/auth/*`, `/api/search` and `/register` as a second layer. | S |
| 10 | **Backups proven** | Turn on Supabase point-in-time recovery and restore into a scratch project once. | S |
| 11 | **Scan uploaded submission files** | Students upload files that mentors download. File types are checked; adding malware scanning (for example ClamAV through a queue, or a scanning service) protects mentors. | M |
| 12 | **Privacy basics** | Privacy policy and cookie notice (Clarity, language cookie), a "delete my account" option, and a data export on request. Egypt's Personal Data Protection Law and the GDPR (for EU visitors) both expect these. | M |

---

## 5. Future versions

### 5.1 Version 1.1: launch polish (next 2–4 weeks)

- Finish payments (section 6): Polar decision, Paymob for EGP.
- Account basics: **change password** (the page is a placeholder), delete account, email preferences.
- Certificates: "Share on LinkedIn" button and a downloadable PDF.
- Admin dashboard: sign-ups, active members, revenue, completion rates (data exists in `entitlements`, `lesson_progress`, `user_learning_days`).
- Emails: welcome, membership receipt, renewal reminder 7 days before expiry, "you haven't watched in a week".

### 5.2 Version 1.2: growth

- **Arabic URLs and SEO:** `/ar/...` routes, `hreflang` tags, Arabic sitemap. Most of your audience searches in Arabic.
- **Recurring subscriptions** (monthly and yearly) instead of only a one-time yearly purchase (section 6.3).
- **Coupons, referrals and gift memberships.**
- **Course reviews and ratings** from learners (the course page shows a rating field today).
- **Better search:** Postgres full-text search with Arabic support, or Meilisearch or Typesense for typo-tolerant search.
- **Library from the database:** library books, articles and podcasts are hard-coded in `library-books.ts`; move them into Prisma models with an admin editor.

### 5.3 Version 2: learning experience

- **Quizzes and practice exercises** per lesson, with progress tied to passing.
- **Community:** comments per lesson, a course discussion board, and mentor Q&A (the `threads` / `messages` tables already exist).
- **Live sessions and events:** Mux Live or Zoom for live workshops, with recordings added to courses; give `/events` its own content.
- **Learning paths and streaks:** guided track progression, weekly goals, streak reminders.
- **Downloadable resources** per lesson (project files, brushes, templates) in the private bucket.
- **Mobile app or installable web app:** start with a PWA (manifest, icons, offline-friendly shell); consider React Native later. Mux supports downloads for offline viewing in native apps.
- **Teams / B2B plans:** one invoice, many seats, for studios and universities.

### 5.4 Platform upgrades

| Upgrade | Why | Effort |
|---|---|---|
| Next.js 16 | Newer caching model (`use cache`), Turbopack builds, clears remaining Next advisories | M |
| Auth.js v5 or Better Auth | next-auth v4 is in maintenance; v5 removes the vulnerable bundled `@auth/core` | M |
| Prisma 7 | Faster client, clears CLI advisories | M |
| React Compiler | Automatic memoisation, fewer re-renders in the heavy player and home components | S |
| Split large files | `ActivityScheduleCard` (1,395 lines), `public.service.ts` (1,280), `HomeTrackExplorerSection` (1,342), `FullCourseLearningExperience` (1,250), `ContinueLearningSection` (1,028): split into data hooks and small components when next touched | M each |
| Remove migration fallbacks | `public.service.ts` / `admin.service.ts` still handle columns missing from old migrations; delete once production is confirmed up to date | S |
| End-to-end tests | Playwright against a seeded staging database: register → verify → sign in → pay (Polar sandbox) → watch | M |

---

## 6. Payments: Polar and Paymob

### 6.1 Where things stand

| Piece | Status |
|---|---|
| Polar checkout (USD card) | **Built.** `requestCheckout` creates a hosted Polar checkout tied to the user (`external_customer_id`) and redirects there |
| Polar webhook | **Built and tested.** `order.paid` grants 12 months of `ALL_ACCESS`, stacked onto any remaining time; `order.refunded` takes it back; each event is applied once |
| Success page | **Built.** Waits for the webhook; the redirect alone never grants access |
| Paymob (EGP) | **Not built.** The button only records interest (`checkout_attempts`) |
| Stripe | **Not built.** Button only records interest; can be removed (Polar already covers USD cards) |
| Plans | Studio, Starter and Pro share one price (1,000 EGP / 50 USD) and one Polar product |
| Database | Ready: `SubscriptionProvider` enum (`STRIPE`, `PAYMOB`, `POLAR`), `payment_events` for idempotency, `entitlements`, `checkout_attempts` |

The design is provider-agnostic: any provider only has to verify its webhook and call `grantEntitlementForVerifiedPayment` / `reverseEntitlementForRefund` (`src/server/subscription/entitlement.service.ts`). Adding Paymob doesn't touch access control.

### 6.2 Decisions to make first

1. **One payment model or two?** Recommended: **Polar for international USD cards, Paymob for Egypt in EGP** (cards, wallets such as Vodafone Cash, Fawry or kiosk payments, installments). Show Paymob first to visitors in Egypt or with Arabic selected, and Polar first to everyone else; let either choose the other.
2. **One-time yearly or recurring?** Today it's a one-time yearly purchase. Recurring is better for revenue but needs more work (6.3, 6.5). It's reasonable to launch one-time and add recurring in 1.2.
3. **One plan or three?** The three cards currently sell the same thing. Either show one "Membership" card, or create three Polar products (and three Paymob prices) with different durations or features.
4. **Check that Polar can pay you out.** Polar is the merchant of record (it collects the money and handles sales tax and VAT), then pays sellers through **Stripe Connect Express**, which only covers certain countries. **Before launch, confirm that your company's country is on Polar's payout list.** I couldn't open Polar's list from this session, and Egypt was not mentioned in any search result. Check https://polar.sh/docs/merchant-of-record/supported-countries. If Egypt isn't supported, options are a company or bank account in a supported country (for example the UAE), or using Paymob for all payments.

### 6.3 Polar: finishing work

**For launch (one-time yearly) · S**

1. In Polar **production**: create the product (one-time, 50 USD), copy its ID into `POLAR_PRODUCT_ID`.
2. Create an organisation access token with `checkouts:write` → `POLAR_ACCESS_TOKEN`.
3. Add the webhook `https://www.alwerash.com/api/webhooks/polar` with events `order.paid` and `order.refunded` → copy the secret into `POLAR_WEBHOOK_SECRET`.
4. Set `POLAR_SERVER=production`, redeploy, and check that `[env] Configuration warnings` no longer mentions payments.
5. Buy once with a real card, confirm access appears, refund it in Polar, confirm access is removed.
6. Hide the Stripe button in `src/app/subscription/checkout/page.tsx`.

**Polar improvements · S–M each**

- **Customer portal:** a "Manage billing / receipts" link on the profile, using Polar's customer session API to create a portal link for the signed-in user.
- **Renewal reminder:** a daily Vercel Cron job (`vercel.json` → `crons`) that emails members 7 days before `entitlements.expires_at`, with a link back to checkout.
- **Recurring (version 1.2):** create monthly and yearly *subscription* products, and handle `subscription.active`, `subscription.updated`, `subscription.canceled` and `subscription.revoked` in the webhook. Set `entitlements.expires_at` to the subscription's current period end on each renewal, and keep access until the period ends after cancellation. The existing `subscriptions` table already has `status`, `plan` and `currentPeriodEnd`.

### 6.4 Paymob: how to integrate it

Paymob's current flow is the **Intention API** with **Unified Checkout** (a hosted payment page), confirmed by Paymob's documentation overview:

1. Your server creates a *payment intention* (amount, currency, allowed payment methods, your own order reference, customer details).
2. Paymob returns a **client secret**.
3. You redirect the customer to Paymob's hosted Unified Checkout using your **public key** and that client secret.
4. Paymob calls your **transaction-processed callback** (webhook). The callback, not the redirect, is the source of truth, and must be verified with **HMAC**.

> **Verify against Paymob's docs before coding.** I couldn't open `developers.paymob.com` from this session. The exact endpoint, field names, HMAC field order and the regional base URL (Egypt `accept.paymob.com`; KSA, UAE and Oman use their own hosts) must come from your Paymob dashboard and the official API reference. The names below are the commonly documented ones and are marked as such.

**Step 1: Paymob account set-up · S**

- In the Paymob dashboard, get the **secret key**, **public key** and **HMAC secret**, and the **integration IDs** for each payment method you'll offer (card, mobile wallet, Fawry/kiosk, installments). Start with test-mode keys.
- Set the **transaction processed callback** URL to `https://www.alwerash.com/api/webhooks/paymob` and the **response (redirect) URL** to `https://www.alwerash.com/subscription/success`.

New environment variables (add to `.env.example`, `src/server/env.ts` as a "Payments (Paymob)" feature group, and Vercel):

```
PAYMOB_BASE_URL="https://accept.paymob.com"   # region host, from your dashboard
PAYMOB_SECRET_KEY="..."
PAYMOB_PUBLIC_KEY="..."
PAYMOB_HMAC_SECRET="..."
PAYMOB_INTEGRATION_IDS="123456,123457"        # card, wallet, ... (comma-separated)
```

**Step 2: store an order before redirecting · S**

Paymob's callback identifies the payment by your own reference, so the app needs to remember which user and plan each reference belongs to. Add a model and migration (with `ENABLE ROW LEVEL SECURITY` like every table):

```prisma
model PaymentOrder {
  id          String               @id @default(cuid())   // sent to Paymob as special_reference
  userId      String               @map("user_id")
  provider    SubscriptionProvider
  planId      String               @map("plan_id")
  amount      Int                  // smallest unit: piastres for EGP (1,000 EGP = 100000)
  currency    String
  status      String               @default("PENDING")    // PENDING, PAID, FAILED, REFUNDED
  providerRef String?              @map("provider_ref")   // Paymob intention / transaction id
  createdAt   DateTime             @default(now()) @map("created_at")
  updatedAt   DateTime             @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("payment_orders")
}
```

**Step 3: create the intention and redirect · M**

New file `src/server/payments/paymob.ts` (shape only; confirm field names in Paymob's reference):

```ts
export async function createPaymobCheckoutUrl(input: {
  orderId: string; amountPiastres: number;
  user: { email: string; name: string | null };
}): Promise<string> {
  const res = await fetch(`${process.env.PAYMOB_BASE_URL}/v1/intention/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPiastres,
      currency: "EGP",
      payment_methods: integrationIds(),           // from PAYMOB_INTEGRATION_IDS
      items: [{ name: "Alwerash yearly membership", amount: input.amountPiastres, quantity: 1 }],
      billing_data: billingDataFor(input.user),     // name, email; Paymob requires the fields to exist
      special_reference: input.orderId,             // our PaymentOrder id
      notification_url: `${baseUrl()}/api/webhooks/paymob`,
      redirection_url: `${baseUrl()}/subscription/success`,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Paymob intention failed: ${res.status}`);
  const { client_secret } = await res.json();
  return `${process.env.PAYMOB_BASE_URL}/unifiedcheckout/?publicKey=${encodeURIComponent(
    process.env.PAYMOB_PUBLIC_KEY!
  )}&clientSecret=${encodeURIComponent(client_secret)}`;
}
```

In `src/app/subscription/checkout/actions.ts`, replace the Paymob placeholder branch: create a `PaymentOrder` (`provider: "PAYMOB"`, amount from `MEMBERSHIP_PRICE.egp × 100`, never from the form), call `createPaymobCheckoutUrl`, record the checkout attempt as `REDIRECTED`, and redirect. The same rate limit already applies.

**Step 4: the webhook · M**

New route `src/app/api/webhooks/paymob/route.ts`:

1. Read the body and the `hmac` value Paymob sends (query string for the transaction callback).
2. **Verify the HMAC**: build the string from the fields and order Paymob specifies for transaction callbacks, compute HMAC-SHA512 with `PAYMOB_HMAC_SECRET`, compare in constant time (`crypto.timingSafeEqual`). Reject with 403 on mismatch.
3. Find the `PaymentOrder` by `special_reference` / merchant order reference. Ignore unknown orders.
4. Check that the transaction succeeded and isn't pending, voided or refunded (`success === true`, `pending === false`), that the **amount and currency match the order**, and that the order's user exists.
5. Call `grantEntitlementForVerifiedPayment({ provider: "PAYMOB", providerEventId: \`txn:${transactionId}\`, eventType: "TRANSACTION", userId: order.userId, durationMonths: 12 })` and mark the order `PAID`. Idempotency is already handled.
6. For refunds (a callback with `is_refunded`, or a refund transaction), call `reverseEntitlementForRefund` with `providerEventId: \`refund:${transactionId}\`` and mark the order `REFUNDED`.
7. Return 200 quickly; return 500 only for errors a retry can fix (copy the pattern from the Polar webhook).

Add the route to the CSP `form-action` / `connect-src` if needed (`accept.paymob.com` for the redirect), and add tests modelled on `src/app/api/webhooks/polar/route.test.ts`: valid HMAC grants, bad HMAC 403, amount mismatch ignored, duplicate callback applied once, refund reverses.

**Step 5: test end to end · S**

With Paymob test keys on a preview deployment: pay with a test card and a test wallet, check access appears and the order is `PAID`, refund from the dashboard, check access is removed, replay a callback and check nothing changes.

**Step 6: Paymob recurring (later) · L**

Paymob offers saved-card tokens and a subscription module. Recurring charges need extra integrations enabled on your account (third-party implementations mention a MOTO integration for merchant-initiated charges and 3-D Secure for enrolment). Ask Paymob support which your account has, then charge the saved card from a Vercel Cron job before `expires_at`, using the same webhook to extend access.

### 6.5 Checkout page once both are live

- One page, two clear options: "Pay in EGP (cards, wallets, Fawry) – Paymob" and "Pay in USD (international cards) – Polar". Pre-select by Arabic language or Egyptian location (Vercel sets the `x-vercel-ip-country` header).
- Show the price in the selected currency only.
- After payment, both return to `/subscription/success`, which already waits for the webhook.
- Admin: add a "Payments" admin page listing `payment_orders` and `payment_events`, so support can see what happened when someone says "I paid but have no access".

### 6.6 Tax and legal notes

- With **Polar** (merchant of record), Polar charges and remits sales tax and VAT on your behalf, and the invoice comes from Polar.
- With **Paymob**, *you* are the merchant: Egyptian VAT and e-invoicing obligations apply to you. Check with your accountant before going live.
- Update the terms of service and refund policy pages to name both providers and the refund rules.

---

Sources consulted for this section: [Paymob developer docs overview](https://developers.paymob.com/paymob-docs/integration-paths/apis), [Paymob Egypt developer docs](https://developers.paymob.com/egypt/error-codes), [Polar supported countries](https://polar.sh/docs/merchant-of-record/supported-countries), [Polar payouts](https://polar.sh/docs/features/finance/payouts.md), [laravel-paymob (third-party reference implementation)](https://packagist.org/packages/ahmed-abd0/laravel-paymob).
