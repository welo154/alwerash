/**
 * Request-scoped database query timing, enabled by PERF_TIMING.
 *
 * The question this exists to answer: do the concurrent reads in our pages
 * actually run concurrently? The production Prisma pool is size 1, so a
 * `Promise.all` of five service calls may be queueing rather than parallelising.
 * Comparing the sum of every query's duration against the wall-clock time during
 * which at least one query was in flight makes that visible — a ratio near 1.0
 * means fully serialized, and the concurrency in the page code is doing nothing.
 *
 * Disabled unless PERF_TIMING is set, and written so it can never break a
 * request: every entry point swallows its own errors.
 *
 * Output goes to stdout rather than stderr because `silencePoolErrors` filters
 * stderr and console.error.
 */
import { cache } from "react";

export type TimingMode = "off" | "summary" | "verbose";

/** `summary` logs one line per request; `verbose` adds a line per query. */
export function timingMode(): TimingMode {
  const raw = process.env.PERF_TIMING?.trim().toLowerCase();
  if (!raw || raw === "0" || raw === "false" || raw === "off") return "off";
  if (raw === "verbose" || raw === "2" || raw === "all") return "verbose";
  return "summary";
}

export type QuerySample = {
  seq: number;
  /** `model.operation`, e.g. `track.findMany`. */
  label: string;
  /** Milliseconds from the first recorded query of this request. */
  startOffsetMs: number;
  durationMs: number;
  rows?: number;
  failed?: boolean;
  /** Returned fake-empty data because the pool latch was already tripped. */
  shortCircuited?: boolean;
};

export type RepeatedQuery = { label: string; count: number; totalMs: number };

export type RequestTimingSummary = {
  pageLabel: string;
  queryCount: number;
  failedCount: number;
  shortCircuitedCount: number;
  droppedCount: number;
  /** Sum of every query's duration. */
  dbSumMs: number;
  /** Wall-clock time with at least one query in flight. */
  dbWallMs: number;
  /** dbSumMs / dbWallMs. About 1.0 means the queries ran one at a time. */
  concurrency: number;
  maxInFlight: number;
  slowest: QuerySample[];
  /** Identical labels seen more than once — candidates for caching or a join. */
  repeats: RepeatedQuery[];
};

const FLUSH_DELAY_MS = 120;
/** Cap so a pathological request cannot grow the bucket without bound. */
const MAX_SAMPLES = 500;
const SLOWEST_COUNT = 5;
const REPEATS_COUNT = 5;

type Interval = readonly [number, number];

/** Merge overlapping or touching intervals into a minimal disjoint set. */
export function mergeIntervals(intervals: readonly Interval[]): Interval[] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Interval[] = [sorted[0]!];

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i]!;
    const last = merged[merged.length - 1]!;
    if (current[0] <= last[1]) {
      if (current[1] > last[1]) merged[merged.length - 1] = [last[0], current[1]];
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function intervalsOf(samples: readonly QuerySample[]): Interval[] {
  return samples.map((s) => [s.startOffsetMs, s.startOffsetMs + s.durationMs] as const);
}

/** Wall-clock time during which at least one query was in flight. */
export function unionDurationMs(samples: readonly QuerySample[]): number {
  return mergeIntervals(intervalsOf(samples)).reduce((total, [start, end]) => total + (end - start), 0);
}

/**
 * Greatest number of queries in flight at once.
 *
 * Ends are processed before starts at an identical timestamp, so two queries
 * that merely touch are not counted as overlapping.
 */
export function maxInFlight(samples: readonly QuerySample[]): number {
  const events: { at: number; delta: number }[] = [];
  for (const [start, end] of intervalsOf(samples)) {
    events.push({ at: start, delta: 1 });
    events.push({ at: end, delta: -1 });
  }
  events.sort((a, b) => (a.at === b.at ? a.delta - b.delta : a.at - b.at));

  let current = 0;
  let peak = 0;
  for (const event of events) {
    current += event.delta;
    if (current > peak) peak = current;
  }
  return peak;
}

function repeatedQueries(samples: readonly QuerySample[]): RepeatedQuery[] {
  const byLabel = new Map<string, RepeatedQuery>();
  for (const sample of samples) {
    const entry = byLabel.get(sample.label);
    if (entry) {
      entry.count += 1;
      entry.totalMs += sample.durationMs;
    } else {
      byLabel.set(sample.label, { label: sample.label, count: 1, totalMs: sample.durationMs });
    }
  }
  return [...byLabel.values()]
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, REPEATS_COUNT);
}

export function summarize(
  samples: readonly QuerySample[],
  pageLabel: string,
  droppedCount = 0
): RequestTimingSummary {
  const dbSumMs = samples.reduce((total, s) => total + s.durationMs, 0);
  const dbWallMs = unionDurationMs(samples);

  return {
    pageLabel,
    queryCount: samples.length,
    failedCount: samples.filter((s) => s.failed).length,
    shortCircuitedCount: samples.filter((s) => s.shortCircuited).length,
    droppedCount,
    dbSumMs,
    dbWallMs,
    concurrency: dbWallMs > 0 ? dbSumMs / dbWallMs : 0,
    maxInFlight: maxInFlight(samples),
    slowest: [...samples].sort((a, b) => b.durationMs - a.durationMs).slice(0, SLOWEST_COUNT),
    repeats: repeatedQueries(samples),
  };
}

function ms(value: number): string {
  return `${value.toFixed(0)}ms`;
}

export function formatSummary(summary: RequestTimingSummary): string {
  const verdict =
    summary.queryCount < 2
      ? ""
      : summary.concurrency < 1.2
        ? " SERIALIZED"
        : summary.concurrency < 2
          ? " mostly-serial"
          : " parallel";

  const parts = [
    `[perf] ${summary.pageLabel}`,
    `${summary.queryCount} queries`,
    `db-sum ${ms(summary.dbSumMs)}`,
    `db-wall ${ms(summary.dbWallMs)}`,
    `concurrency ${summary.concurrency.toFixed(2)}x (peak ${summary.maxInFlight})${verdict}`,
  ];

  if (summary.failedCount > 0) parts.push(`failed ${summary.failedCount}`);
  if (summary.shortCircuitedCount > 0) {
    parts.push(`EMPTY-RESULTS ${summary.shortCircuitedCount}`);
  }
  if (summary.droppedCount > 0) parts.push(`untracked ${summary.droppedCount}`);

  const lines = [parts.join(" | ")];

  if (summary.slowest.length > 0) {
    lines.push(
      `        slowest: ${summary.slowest
        .map((s) => `${s.label} ${ms(s.durationMs)}${s.rows != null ? ` rows=${s.rows}` : ""}`)
        .join(", ")}`
    );
  }

  if (summary.repeats.length > 0) {
    lines.push(
      `        repeated: ${summary.repeats
        .map((r) => `${r.label} x${r.count} (${ms(r.totalMs)})`)
        .join(", ")}`
    );
  }

  return lines.join("\n");
}

function writeLine(text: string): void {
  try {
    process.stdout.write(`${text}\n`);
  } catch {
    /* Never let logging fail a request. */
  }
}

type RequestBucket = {
  samples: QuerySample[];
  seq: number;
  dropped: number;
  firstQueryAt: number | null;
  pageLabel: string | null;
  flushTimer: ReturnType<typeof setTimeout> | null;
};

/**
 * `cache` gives us request-scoped storage for free: within one request every
 * call returns the same object, and a new request gets a fresh one. Outside a
 * request scope it throws, which `currentBucket` treats as "not measuring".
 */
const requestBucket = cache(
  (): RequestBucket => ({
    samples: [],
    seq: 0,
    dropped: 0,
    firstQueryAt: null,
    pageLabel: null,
    flushTimer: null,
  })
);

function currentBucket(): RequestBucket | null {
  if (timingMode() === "off") return null;
  try {
    return requestBucket();
  } catch {
    // Called from a script, a build step, or anywhere without a request scope.
    return null;
  }
}

/**
 * Name the current request in the timing output. Optional — without it the
 * summary is still emitted, just labelled `unknown`.
 */
export function markPage(label: string): void {
  try {
    const bucket = currentBucket();
    if (bucket) bucket.pageLabel = label;
  } catch {
    /* Instrumentation must never break a page. */
  }
}

function scheduleFlush(bucket: RequestBucket): void {
  if (bucket.flushTimer) clearTimeout(bucket.flushTimer);
  bucket.flushTimer = setTimeout(() => {
    bucket.flushTimer = null;
    if (bucket.samples.length === 0) return;
    writeLine(formatSummary(summarize(bucket.samples, bucket.pageLabel ?? "unknown", bucket.dropped)));
  }, FLUSH_DELAY_MS);
}

export type QueryOutcome = {
  rows?: number;
  failed?: boolean;
  shortCircuited?: boolean;
};

export type QueryFinish = (outcome?: QueryOutcome) => void;

/**
 * Start timing one query. Returns the finish callback, or null when disabled so
 * the caller pays nothing beyond a null check.
 */
export function beginQuery(model: string | undefined, operation: string): QueryFinish | null {
  const bucket = currentBucket();
  if (!bucket) return null;

  const startedAt = performance.now();
  if (bucket.firstQueryAt == null) bucket.firstQueryAt = startedAt;
  const origin = bucket.firstQueryAt;
  const label = model ? `${model}.${operation}` : operation;
  const seq = (bucket.seq += 1);

  return (outcome) => {
    try {
      const durationMs = performance.now() - startedAt;
      const startOffsetMs = startedAt - origin;

      if (bucket.samples.length >= MAX_SAMPLES) {
        bucket.dropped += 1;
      } else {
        bucket.samples.push({
          seq,
          label,
          startOffsetMs,
          durationMs,
          rows: outcome?.rows,
          failed: outcome?.failed,
          shortCircuited: outcome?.shortCircuited,
        });
      }

      if (timingMode() === "verbose") {
        const extra = [
          outcome?.rows != null ? `rows=${outcome.rows}` : "",
          outcome?.failed ? "FAILED" : "",
          outcome?.shortCircuited ? "EMPTY-RESULT" : "",
        ]
          .filter(Boolean)
          .join(" ");
        writeLine(
          `[perf]   q${seq} +${ms(startOffsetMs)} took ${ms(durationMs)} ${label}${extra ? ` ${extra}` : ""}`
        );
      }

      scheduleFlush(bucket);
    } catch {
      /* Instrumentation must never break a query. */
    }
  };
}

let poolDegradedReported = false;

/**
 * Announce that the pool latch has tripped and this instance is now returning
 * empty results for every query.
 *
 * Deliberately logged regardless of PERF_TIMING, and to stdout, because the
 * existing error silencing hides the underlying Prisma error and the failure is
 * otherwise completely invisible.
 */
export function reportPoolDegraded(): void {
  if (poolDegradedReported) return;
  poolDegradedReported = true;
  writeLine(
    "[db] connection limit exceeded — this server instance will now return EMPTY results " +
      "for every query until it restarts. Pages will render with missing data and no error."
  );
}

/** Test seam: clears the once-only guard on the degraded-pool warning. */
export function resetPoolDegradedReportForTests(): void {
  poolDegradedReported = false;
}
