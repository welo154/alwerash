-- Device sessions: one ACTIVE row per (user, kind) enforces one phone and one
-- computer per student. Purely additive; no existing table or column is altered,
-- so rolling back is an application revert with no data loss.

DO $$ BEGIN
  CREATE TYPE "DeviceKind" AS ENUM ('MOBILE', 'COMPUTER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "DeviceSessionStatus" AS ENUM ('ACTIVE', 'REVOKED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "device_sessions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "kind" "DeviceKind" NOT NULL,
  "status" "DeviceSessionStatus" NOT NULL DEFAULT 'ACTIVE',
  "label" TEXT,
  "user_agent" TEXT,
  "ip_hash" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revoked_at" TIMESTAMP(3),
  "revoked_reason" TEXT,

  CONSTRAINT "device_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "device_sessions_user_id_status_idx"
  ON "device_sessions"("user_id", "status");

CREATE INDEX IF NOT EXISTS "device_sessions_user_id_kind_status_idx"
  ON "device_sessions"("user_id", "kind", "status");

DO $$ BEGIN
  ALTER TABLE "device_sessions"
    ADD CONSTRAINT "device_sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
