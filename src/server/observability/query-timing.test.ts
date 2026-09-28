import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatSummary,
  maxInFlight,
  mergeIntervals,
  summarize,
  timingMode,
  unionDurationMs,
  type QuerySample,
} from "./query-timing";

function sample(
  seq: number,
  label: string,
  startOffsetMs: number,
  durationMs: number,
  extra: Partial<QuerySample> = {}
): QuerySample {
  return { seq, label, startOffsetMs, durationMs, ...extra };
}

/** Three queries back to back — what a pool of one produces. */
const SERIAL: QuerySample[] = [
  sample(1, "track.count", 0, 100),
  sample(2, "course.count", 100, 100),
  sample(3, "track.findMany", 200, 100),
];

/** Three queries issued together — what `Promise.all` is supposed to produce. */
const PARALLEL: QuerySample[] = [
  sample(1, "track.count", 0, 100),
  sample(2, "course.count", 0, 100),
  sample(3, "track.findMany", 0, 100),
];

describe("mergeIntervals", () => {
  it("returns nothing for no intervals", () => {
    expect(mergeIntervals([])).toEqual([]);
  });

  it("keeps disjoint intervals separate", () => {
    expect(mergeIntervals([[0, 10], [20, 30]])).toEqual([[0, 10], [20, 30]]);
  });

  it("merges overlapping intervals", () => {
    expect(mergeIntervals([[0, 10], [5, 20]])).toEqual([[0, 20]]);
  });

  it("merges intervals that merely touch", () => {
    expect(mergeIntervals([[0, 10], [10, 20]])).toEqual([[0, 20]]);
  });

  it("does not require sorted input", () => {
    expect(mergeIntervals([[20, 30], [0, 10], [5, 25]])).toEqual([[0, 30]]);
  });

  it("keeps an interval fully contained in another", () => {
    expect(mergeIntervals([[0, 100], [10, 20]])).toEqual([[0, 100]]);
  });
});

describe("unionDurationMs", () => {
  it("equals the sum when queries never overlap", () => {
    expect(unionDurationMs(SERIAL)).toBe(300);
  });

  it("collapses to one query's duration when all overlap", () => {
    expect(unionDurationMs(PARALLEL)).toBe(100);
  });

  it("is zero with no samples", () => {
    expect(unionDurationMs([])).toBe(0);
  });
});

describe("maxInFlight", () => {
  it("is one when queries run back to back", () => {
    expect(maxInFlight(SERIAL)).toBe(1);
  });

  it("counts every concurrent query", () => {
    expect(maxInFlight(PARALLEL)).toBe(3);
  });

  it("does not treat touching queries as concurrent", () => {
    expect(maxInFlight([sample(1, "a.findMany", 0, 10), sample(2, "b.findMany", 10, 10)])).toBe(1);
  });

  it("reports the peak rather than the average", () => {
    const samples = [
      sample(1, "a.findMany", 0, 100),
      sample(2, "b.findMany", 10, 10),
      sample(3, "c.findMany", 15, 10),
      sample(4, "d.findMany", 200, 10),
    ];
    expect(maxInFlight(samples)).toBe(3);
  });
});

describe("summarize", () => {
  it("reports concurrency near 1 for serialized queries", () => {
    const summary = summarize(SERIAL, "/home");
    expect(summary.dbSumMs).toBe(300);
    expect(summary.dbWallMs).toBe(300);
    expect(summary.concurrency).toBeCloseTo(1, 5);
    expect(summary.maxInFlight).toBe(1);
  });

  it("reports concurrency near the query count for parallel queries", () => {
    const summary = summarize(PARALLEL, "/home");
    expect(summary.concurrency).toBeCloseTo(3, 5);
    expect(summary.maxInFlight).toBe(3);
  });

  it("orders slowest queries first", () => {
    const summary = summarize(
      [sample(1, "a.findMany", 0, 10), sample(2, "b.findMany", 10, 90), sample(3, "c.findMany", 100, 50)],
      "/course"
    );
    expect(summary.slowest.map((s) => s.label)).toEqual(["b.findMany", "c.findMany", "a.findMany"]);
  });

  it("flags repeated identical queries and ignores one-offs", () => {
    const summary = summarize(
      [
        sample(1, "course.findUnique", 0, 10),
        sample(2, "course.findUnique", 10, 20),
        sample(3, "track.findMany", 30, 40),
      ],
      "/course"
    );
    expect(summary.repeats).toEqual([{ label: "course.findUnique", count: 2, totalMs: 30 }]);
  });

  it("counts failures and silently-empty results separately", () => {
    const summary = summarize(
      [
        sample(1, "a.findMany", 0, 10, { failed: true }),
        sample(2, "b.findMany", 10, 10, { shortCircuited: true }),
        sample(3, "c.findMany", 20, 10),
      ],
      "/home"
    );
    expect(summary.failedCount).toBe(1);
    expect(summary.shortCircuitedCount).toBe(1);
    expect(summary.queryCount).toBe(3);
  });

  it("does not divide by zero when every query was instant", () => {
    const summary = summarize([sample(1, "a.count", 0, 0)], "/home");
    expect(summary.concurrency).toBe(0);
    expect(Number.isFinite(summary.concurrency)).toBe(true);
  });
});

describe("formatSummary", () => {
  it("calls out serialized requests explicitly", () => {
    expect(formatSummary(summarize(SERIAL, "/home"))).toContain("SERIALIZED");
  });

  it("does not call a genuinely parallel request serialized", () => {
    const text = formatSummary(summarize(PARALLEL, "/home"));
    expect(text).toContain("parallel");
    expect(text).not.toContain("SERIALIZED");
  });

  it("does not judge a single-query request", () => {
    const text = formatSummary(summarize([sample(1, "a.findMany", 0, 10)], "/home"));
    expect(text).not.toContain("SERIALIZED");
    expect(text).not.toContain("parallel");
  });

  it("surfaces silently-empty results prominently", () => {
    const text = formatSummary(
      summarize([sample(1, "a.findMany", 0, 1, { shortCircuited: true })], "/home")
    );
    expect(text).toContain("EMPTY-RESULTS");
  });

  it("includes the page label and repeated queries", () => {
    const text = formatSummary(
      summarize(
        [sample(1, "course.findUnique", 0, 10), sample(2, "course.findUnique", 10, 10)],
        "/course-access/[courseId]"
      )
    );
    expect(text).toContain("/course-access/[courseId]");
    expect(text).toContain("course.findUnique x2");
  });
});

describe("timingMode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is off when unset", () => {
    vi.stubEnv("PERF_TIMING", "");
    expect(timingMode()).toBe("off");
  });

  it("treats explicit falsy values as off", () => {
    for (const value of ["0", "false", "off", "OFF"]) {
      vi.stubEnv("PERF_TIMING", value);
      expect(timingMode()).toBe("off");
    }
  });

  it("enables summary output for a plain truthy value", () => {
    vi.stubEnv("PERF_TIMING", "1");
    expect(timingMode()).toBe("summary");
  });

  it("enables per-query output for verbose", () => {
    vi.stubEnv("PERF_TIMING", "verbose");
    expect(timingMode()).toBe("verbose");
  });
});
