# 00 — Performance measurement

**Status:** baseline captured. The measurement **overturned** the ranking produced
by reading the code — see §6.

---

## 1. Why measure before fixing

A read of the code produced a ranked list of suspected causes, led by "the
production Prisma pool of 1 serializes the `Promise.all` reads in our pages."
That is a claim about runtime behaviour, and a code read cannot confirm it.

It turned out to be largely wrong, and two causes that were not on the list at
all account for most of the latency. That is the argument for measuring.

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
[perf]   q1 +0ms took 375ms Track.count
[perf]   q3 +377ms took 361ms Track.count
[perf] /course | 7 queries | db-sum 3210ms | db-wall 2200ms | concurrency 1.46x (peak 2)
        slowest: Track.findMany 759ms rows=22
        repeated: Track.count x2 (736ms), Course.count x2 (702ms)
```

| Field | Meaning |
|---|---|
| `db-sum` | Sum of every query's duration |
| `db-wall` | Wall-clock time with at least one query in flight |
| `concurrency` | `db-sum / db-wall`. **1.00 with peak 1 means a strict chain** |
| `peak` | Most queries in flight at once |
| `repeated` | Same query shape more than once — candidate for caching or a join |
| `EMPTY-RESULTS` | Queries returning fake-empty data because the pool latch tripped |

One caveat when interpreting `concurrency`: a query's window runs from *issued* to
*resolved*, which includes time spent waiting for a free connection. So a value
above 1 does not prove genuine parallelism at the database. A value of exactly
1.00 with peak 1 does prove the opposite — nothing overlapped at all.

### Where the numbers come from

`beginQuery` is called from the single `$allOperations` Prisma extension in
`src/server/db/prisma.ts`, so every query is covered with no per-call-site work.
Per-request grouping uses React's `cache()`, which gives request-scoped storage
without an `AsyncLocalStorage` of our own; outside a request scope it degrades to
"not measuring" rather than throwing.

Pages call `markPage("/home")` so the summary is labelled. Currently labelled:
`/`, `/home`, `/course`, `/profile`, `/course-access/[courseId]`.

The interval maths (`mergeIntervals`, `unionDurationMs`, `maxInFlight`) is pure
and covered by 28 tests, because the whole diagnosis rests on it being right.

## 4. Finding 1 — `pgbouncer=true` costs ~280 ms on every single query

The largest single cause, and it is one URL parameter.

Median latency for a trivial query, same database, same machine, back to back:

| Connection string | `track.count()` | `SELECT 1` |
|---|---|---|
| `:6543` + `pgbouncer=true` — **what the app builds today** | **378 ms** | **341 ms** |
| `:6543`, no `pgbouncer` flag | 69 ms | 69 ms |
| `:5432` session pooler — **what `.env` configures** | 70 ms | 69 ms |
| `:5432` session pooler, `connection_limit=5` | 71 ms | 69 ms |

`SELECT 1` cannot be optimised, so this is pure protocol overhead, not query
execution. Measured TCP round-trip to the pooler is ~70 ms, meaning every other
configuration is already at the network floor and `pgbouncer=true` adds roughly
four extra round-trips per query.

The cause is that Prisma disables prepared-statement reuse under this flag and
deallocates before each query.

Two things combine to produce it. `.env` configures port 5432, and
`.env.example` explicitly warns against 6543 — but `rewriteRuntimeUrl` overrides
the configured port unconditionally, then adds the flag:

```ts
const isPooler = host.includes("pooler.supabase.com");
if (isPooler) {
  port = "6543";
}
// ...
if (port === "6543") {
  params.set("pgbouncer", "true");
}
```

**This is not simply a flag to delete.** `pgbouncer=true` is *required* in
transaction mode (6543), where prepared statements collide across pooled
connections. The real error is forcing transaction mode in the first place when
the configured and documented choice is session mode. The trade-off:

- **Session mode (5432):** ~70 ms per query, but Supabase shares a total
  `pool_size` of 15, which caps concurrent serverless instances.
- **Transaction mode (6543):** scales to many instances, but every query pays
  ~280 ms unless the query count is cut hard.

## 5. Finding 2 — pool size was barely the problem; the code is a strict chain

Same pages, same session, only `DB_CONNECTION_LIMIT` changed:

| Page | pool = 1 | pool = 5 |
|---|---|---|
| `/` | 5.2 / 6.2 / 9.7 s | 4.1 / 4.4 / 5.1 s |
| `/course` | 4.1 / 4.7 / 5.1 s | 4.0 / 4.1 / 4.3 s |

Raising the pool five-fold barely moved `/course`, and the per-query trace shows
why — each query begins exactly as the previous one ends, at pool 5:

```
q1 +0ms    took 375ms  Track.count
q3 +377ms  took 361ms  Track.count
q5 +739ms  took 356ms  Course.count
q6 +1095ms took 346ms  Course.count
q7 +1443ms took 759ms  Track.findMany rows=22
```

That is sequential `await`s in application code, not connection starvation. A
bigger pool cannot help code that never asks for two queries at once. The guest
landing page is the extreme case: **15 queries, `concurrency 1.00x (peak 1)`,
fully serialized.**

## 6. Finding 3 — half of all database time answers "is anything published?"

`catalogRequiresPublished` runs four sequential `COUNT`s before any catalog read
can start. In the `/course` trace above those are q1, q3, q5 and q6:

```
375 + 361 + 356 + 346 = 1438 ms of 3210 ms total — 45% of all database time
```

It exists to decide whether to fall back to showing unpublished content when
nothing is published. The answer is always the same in production, and it is on
the critical path of every catalog request.

`/` is worse: 15 queries including `Track.findMany rows=22` **three times** and a
`Course.findMany rows=148`, with no caching anywhere on the path.

## 7. Revised ranking

| # | Cause | Evidence | Expected saving |
|---|---|---|---|
| 1 | `pgbouncer=true` forced on by the port rewrite | §4, measured 5× | ~280 ms × every query |
| 2 | `catalogRequiresPublished` runs 4 sequential counts | §6, 45% of db time | 4 queries per request |
| 3 | Only 2 `unstable_cache` sites despite tag plumbing existing | `public.service.ts:460,1218` | most catalog queries |
| 4 | Catalog reads are sequential rather than concurrent | §5, peak 1 of 15 | latency, not query count |
| 5 | No `loading.tsx` on `/home`, `/course`, `/library`, `/profile`, `/course-access` | navigation appears frozen | perceived only |
| 6 | `LenisProvider` rebuilds smooth scroll on every navigation | `LenisProvider.tsx:57` | perceived only |
| 7 | Root layout branches on `usePathname()` in a client component | `ConditionalLayout.tsx:20` | perceived only |
| 8 | 25 raw `<img>` tags bypass `next/image`, 7 in one home section | `HomeTrackExplorerSection.tsx` | bandwidth |
| 9 | Pool size in production | §5, measured | **demoted — small** |
| 10 | `prismaPoolBroken` latch never resets: one pool error ⇒ permanent empty results | `prisma.ts` | correctness, not speed |

Projection for `/course` from items 1 and 2 alone, neither of which touches page
code: 7 queries × ~280 ms saved, plus 4 queries removed, taking database time
from ~3.2 s to well under 1 s.

## 8. An earlier outage worth recording

The first attempt at a baseline failed entirely: every query failed after ~4 s
with `FATAL: (ENOTFOUND) tenant/user postgres.<ref> not found`, while DNS
resolved and both ports accepted TCP in ~70 ms. The Supabase project had been
paused after about seven days idle. It was resumed and all 26 migrations were
confirmed applied.

The failure mode matters more than the cause. With the database unreachable the
app did not error — it served **`200 OK` with an empty catalog after 8.6 s**,
because each query waited out its connection timeout, every catalog function
caught its own error and returned `[]`, and `silencePoolErrors` stripped the
Prisma error from both stderr and `console.error`. A site whose database has
vanished should fail in 50 ms, loudly.

Note this error does not trip the `prismaPoolBroken` latch, so every request paid
the full timeout again rather than failing fast.

## 9. Files

| File | Purpose |
|---|---|
| `src/server/observability/query-timing.ts` | Request-scoped timing, summary formatting, serialization maths |
| `src/server/observability/query-timing.test.ts` | 28 tests over the interval maths and mode parsing |
| `src/server/db/prisma.ts` | `beginQuery` wiring, `DB_CONNECTION_LIMIT`, degraded-pool warning |

No query behaviour was changed. The pool latch and empty-result fallbacks still
work exactly as before; the only difference is that tripping the latch now logs
once to stdout instead of being silent.
