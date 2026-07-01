-- Learn page “Current Mosts” mentors (max 8, 2 rows × 4)
ALTER TABLE "mentors" ADD COLUMN IF NOT EXISTS "featured_order" INTEGER;

CREATE INDEX IF NOT EXISTS "mentors_featured_order_idx" ON "mentors"("featured_order");
