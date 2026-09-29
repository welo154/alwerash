/**
 * Fixed-window rate limiting backed by Postgres.
 *
 * Serverless instances share no memory, so counters must live in a shared store.
 * Postgres is already a dependency, and one upsert per check costs a single round
 * trip, which is negligible when the functions run in the database's region.
 *
 * Fails open: if the table is missing or the database errors, the request is
 * allowed. A broken limiter must not lock every student out of signing in.
 */
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { hashIdentifier } from "./request-context";

export type RateLimitRule = {
  name: string;
  limit: number;
  windowSeconds: number;
};

// Per-IP limits are deliberately loose: mobile carriers put many subscribers
// behind one shared address (carrier-grade NAT), so a tight per-IP limit would
// block unrelated students. The per-account and per-address limits do the real work.
export const RATE_LIMITS = {
  /** Password guessing against one account, from any number of addresses. */
  loginPerEmail: { name: "login_email", limit: 10, windowSeconds: 15 * 60 },
  /** Credential stuffing across many accounts from one address. */
  loginPerIp: { name: "login_ip", limit: 60, windowSeconds: 15 * 60 },
  registerPerIp: { name: "register_ip", limit: 20, windowSeconds: 60 * 60 },
  /** Verification and reset emails cost money and can be used to bomb an inbox. */
  emailPerAddress: { name: "email_address", limit: 3, windowSeconds: 60 * 60 },
  emailPerIp: { name: "email_ip", limit: 30, windowSeconds: 60 * 60 },
  passwordResetPerIp: { name: "password_reset_ip", limit: 20, windowSeconds: 15 * 60 },
  /** The search box debounces at 250ms, so one person stays well under this. */
  searchPerIp: { name: "search_ip", limit: 120, windowSeconds: 60 },
  /** The player refreshes roughly every 18 minutes, so this only catches scripted minting. */
  playbackPerViewer: { name: "playback_viewer", limit: 60, windowSeconds: 60 },
  uploadPerUser: { name: "upload_user", limit: 30, windowSeconds: 60 * 60 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
};

/** Start of the fixed window containing `nowMs`. */
export function windowStartFor(nowMs: number, windowSeconds: number): Date {
  const windowMs = windowSeconds * 1000;
  return new Date(Math.floor(nowMs / windowMs) * windowMs);
}

export function secondsUntilWindowEnds(nowMs: number, windowSeconds: number): number {
  const end = windowStartFor(nowMs, windowSeconds).getTime() + windowSeconds * 1000;
  return Math.max(1, Math.ceil((end - nowMs) / 1000));
}

let warnedUnavailable = false;

/** Rows older than this are never read again. */
const PRUNE_AFTER_MS = 24 * 60 * 60 * 1000;
const PRUNE_PROBABILITY = 0.01;

function prune(nowMs: number): void {
  if (Math.random() >= PRUNE_PROBABILITY) return;
  void prisma.rateLimitBucket
    .deleteMany({ where: { windowStart: { lt: new Date(nowMs - PRUNE_AFTER_MS) } } })
    .catch(() => {});
}

/** Count one attempt against `rule` for `identifier` and report whether it is allowed. */
export async function consumeRateLimit(
  rule: RateLimitRule,
  identifier: string | null | undefined
): Promise<RateLimitResult> {
  const nowMs = Date.now();
  const retryAfterSeconds = secondsUntilWindowEnds(nowMs, rule.windowSeconds);
  // No identifier (e.g. no IP header in local dev) means nothing to key on.
  if (!identifier) return { allowed: true, count: 0, limit: rule.limit, retryAfterSeconds };

  const key = `${rule.name}:${hashIdentifier(`ratelimit:${rule.name}`, identifier)}`;
  const windowStart = windowStartFor(nowMs, rule.windowSeconds);

  try {
    const rows = await prisma.$queryRaw<{ count: number }[]>`
      INSERT INTO "rate_limit_buckets" ("key", "window_start", "count")
      VALUES (${key}, ${windowStart}, 1)
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "rate_limit_buckets"."window_start" = EXCLUDED."window_start"
            THEN "rate_limit_buckets"."count" + 1
          ELSE 1
        END,
        "window_start" = EXCLUDED."window_start"
      RETURNING "count"`;
    prune(nowMs);
    const count = Number(rows[0]?.count ?? 0);
    return { allowed: count <= rule.limit, count, limit: rule.limit, retryAfterSeconds };
  } catch (error) {
    if (!warnedUnavailable) {
      warnedUnavailable = true;
      console.error("[rate-limit] unavailable, allowing requests:", error);
    }
    return { allowed: true, count: 0, limit: rule.limit, retryAfterSeconds };
  }
}

export const RATE_LIMITED_MESSAGE = "Too many attempts. Please wait a few minutes and try again.";

/** Throw 429 when over the limit. For route handlers wrapped in `handleRoute`. */
export async function enforceRateLimit(
  rule: RateLimitRule,
  identifier: string | null | undefined
): Promise<void> {
  const result = await consumeRateLimit(rule, identifier);
  if (!result.allowed) {
    throw new AppError("RATE_LIMITED", 429, RATE_LIMITED_MESSAGE, {
      retryAfterSeconds: result.retryAfterSeconds,
    });
  }
}
