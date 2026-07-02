-- Guest home “Current Mosts” mentors (admin-curated, max 12)
ALTER TABLE "mentors" ADD COLUMN IF NOT EXISTS "landing_popular_order" INTEGER;

CREATE INDEX IF NOT EXISTS "mentors_landing_popular_order_idx" ON "mentors"("landing_popular_order");
