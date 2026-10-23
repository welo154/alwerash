-- Rate-limit counters, a security event log, and a lookup index for hashed
-- verification tokens. Purely additive: rolling back is an application revert.

CREATE TABLE IF NOT EXISTS "rate_limit_buckets" (
  "key" TEXT NOT NULL,
  "window_start" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL,
  CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "rate_limit_buckets_window_start_idx"
  ON "rate_limit_buckets" ("window_start");

CREATE TABLE IF NOT EXISTS "security_events" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "user_id" TEXT,
  "email_hash" TEXT,
  "ip_hash" TEXT,
  "user_agent" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "security_events_user_id_created_at_idx"
  ON "security_events" ("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "security_events_type_created_at_idx"
  ON "security_events" ("type", "created_at");

CREATE INDEX IF NOT EXISTS "verification_tokens_token_idx"
  ON "verification_tokens" ("token");
