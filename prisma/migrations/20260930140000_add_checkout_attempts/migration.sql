-- Placeholder checkout requests. No payment is taken from this table.
-- Row-level security is on so the Supabase Data API cannot read it. The app
-- connects as the table owner and bypasses RLS, matching the earlier lockdown.

CREATE TABLE IF NOT EXISTS "checkout_attempts" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "plan_id" TEXT NOT NULL,
  "provider" "SubscriptionProvider" NOT NULL,
  "currency" TEXT NOT NULL,
  "amount" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'COMING_SOON',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "checkout_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "checkout_attempts_user_id_created_at_idx"
  ON "checkout_attempts" ("user_id", "created_at");

DO $$ BEGIN
  ALTER TABLE "checkout_attempts"
    ADD CONSTRAINT "checkout_attempts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "checkout_attempts" ENABLE ROW LEVEL SECURITY;
