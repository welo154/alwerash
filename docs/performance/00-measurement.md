# 00 — Performance measurement

**Status:** instrumentation landed; the baseline measurement is **blocked** because
the database is currently unreachable (see §4).

---

## 1. Why measure before fixing

A read of the code produced a ranked list of suspected causes (§5). The top
suspect — that a Prisma pool of 1 serializes the `Promise.all` concurrency in our
pages — is a claim about runtime behaviour, and a code read cannot confirm it.
The instrumentation here exists to answer that one question with a number.

## 2. How to run it

```bash
# One summary line per request.
PERF_TIMING=1 npm run dev

# Add a line per query.
PERF_TIMING=verbose npm run dev

# Reproduce the production pool size locally (dev defaults to 5, production to 1).
PERF_TIMING=verbose DB_CONNECTION_LIMIT=1 npm run dev
```

Output goes to **stdout**, because `silencePoolErrors` filters stderr and
`console.error`. It is off unless `PERF_TIMING` is set.

## 3. Reading the output

```
[perf]   q1 +0ms took 41ms Track.count rows=1
[perf]   q2 +41ms took 38ms Course.count rows=1
[perf] /home | 14 queries | db-sum 578ms | db-wall 561ms | concurrency 1.03x (peak 1) SERIALIZED
        slowest: Track.findMany 84ms rows=12, Course.count 61ms
        repeated: Course.findUnique x4 (96ms)
```

| Field | Meaning |
|---|---|
| `db-sum` | Sum of every query's duration |
| `db-wall` | Wall-clock time with **at least one** query in flight |
| `concurrency` | `db-sum / db-wall`. **~1.00 means fully serialized** |
| `peak` | Most queries in flight at once |
| `repeated` | Same query shape more than once — candidate for caching or a join |
| `EMPTY-RESULTS` | Queries that returned fake-empty data because the pool latch had tripped |

`concurrency` is the number that matters. Our pages issue reads concurrently, so
a healthy `/home` should show a concurrency well above 1 and a peak matching the
number of parallel service calls. A value of 1.00 with a peak of 1 proves the
pool is the bottleneck and that the page-level concurrency is wasted.

### Where the numbers come from

`beginQuery` is called from the single `$allOperations` Prisma extension in
`src/server/db/prisma.ts`, so every query is covered with no per-call-site work.
Per-request grouping uses React's `cache()`, which gives request-scoped storage
without an `AsyncLocalStorage` of our own; outside a request scope it degrades to
"not measuring" rather than throwing.

Pages call `markPage("/home")` so the summary is labelled. It is optional — an
unlabelled request still reports, as `unknown`. Currently labelled: `/`, `/home`,
`/course`, `/profile`, `/course-access/[courseId]`.

The interval maths (`mergeIntervals`, `unionDurationMs`, `maxInFlight`) is pure
and covered by 28 tests in `query-timing.test.ts`, because the whole diagnosis
rests on it being right.

## 4. What the first run actually found

The baseline could not be captured. **Every query fails before it runs.**

```
[perf]   q1 +0ms took 4619ms Track.count FAILED
[perf]   q2 +1ms took 4619ms $queryRawUnsafe FAILED
[perf]   q3 +4623ms took 3768ms Track.findMany FAILED
[perf] unknown | 3 queries | db-sum 13005ms | db-wall 8387ms | failed 3
```

The underlying error, which `silencePoolErrors` normally hides:

```
Error querying the database: FATAL: (ENOTFOUND) tenant/user postgres.<ref> not found
```

Established by elimination:

| Check | Result |
|---|---|
| DNS for the pooler host | Resolves, three IPv4 addresses |
| TCP `:5432` and `:6543` | Both open, ~70 ms |
| Prisma on the configured `:5432` | Same `tenant/user not found` |
| Prisma on the rewritten `:6543` | Same `tenant/user not found` |
| `prisma migrate deploy` on 2026-09-21 | Succeeded against this same URL |

So it is not the network, not the port, and not a password (a bad password gives
`password authentication failed`, not a tenant error). Supavisor reports
`tenant/user not found` when the project behind the ref is **paused or no longer
exists**. A free-tier Supabase project pauses after about 7 days idle, and the
last successful use was 7 days earlier.

### The behaviour this produces is worse than an outage

With the database unreachable the app does not fail — it renders **empty pages,
slowly, with no error**:

- Each query waits ~4 s for the connection attempt, so a warm `/` took **8.6 s**.
- Every catalog function catches its own error and returns `[]`
  (`logCatalogError` then an empty fallback), so the page renders successfully
  with no content.
- `silencePoolErrors` strips the Prisma error from stderr and `console.error`.

This is very likely what "the site is slow" actually is. A site whose database is
gone should return 500 in 50 ms, not 200 OK in 8 s with an empty catalog.

Note that this particular error does **not** trip the `prismaPoolBroken` latch —
all three queries were recorded as `FAILED` rather than `EMPTY-RESULTS` — so each
request pays the full connection timeout again instead of failing fast.

## 5. Suspected causes, from reading the code

Ranked by expected impact. Everything below **1** is unverified until the
database is reachable and a baseline exists.

| # | Suspected cause | Evidence |
|---|---|---|
| 1 | Production Prisma pool is 1, serializing all `Promise.all` reads | `prisma.ts`, `resolveConnectionLimit` |
| 2 | `catalogRequiresPublished` runs 4 sequential `COUNT`s before any catalog read | `public.service.ts:106` |
| 3 | Only 2 `unstable_cache` call sites in the whole app, despite tag plumbing existing | `public.service.ts:460,1218` |
| 4 | No `loading.tsx` on `/home`, `/course`, `/library`, `/profile`, `/course-access` | navigation appears frozen |
| 5 | `LenisProvider` destroys and rebuilds smooth scroll on every navigation | `LenisProvider.tsx:57` |
| 6 | Root layout branches on `usePathname()` in a client component | `ConditionalLayout.tsx:20` |
| 7 | 25 raw `<img>` tags bypass `next/image`, 7 in one home section | `HomeTrackExplorerSection.tsx` |
| 8 | `prismaPoolBroken` latch never resets: one pool error ⇒ permanent empty results | `prisma.ts` |

## 6. Next steps

1. **Restore the database** — check whether the Supabase project is paused, and
   whether production points at this same project or a newer one.
2. Capture a baseline for `/`, `/home` and `/course-access/[courseId]` at
   `DB_CONNECTION_LIMIT=1`.
3. Repeat at `DB_CONNECTION_LIMIT=5`. The delta between the two runs is the
   controlled experiment for suspect **1**, on identical page code.
4. Fix in the order the measurements justify, re-measuring after each change.

## 7. Files

| File | Purpose |
|---|---|
| `src/server/observability/query-timing.ts` | Request-scoped timing, summary formatting, serialization maths |
| `src/server/observability/query-timing.test.ts` | 28 tests over the interval maths and mode parsing |
| `src/server/db/prisma.ts` | `beginQuery` wiring, `DB_CONNECTION_LIMIT`, degraded-pool warning |

No query behaviour was changed. The pool latch and the empty-result fallbacks
still work exactly as before; the only addition is that tripping the latch now
logs once to stdout instead of being silent.
