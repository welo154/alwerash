-- Learn page "Trending" carousel (max 6 courses)
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "featured_trending_order" INTEGER;

CREATE INDEX IF NOT EXISTS "courses_featured_trending_order_idx" ON "courses"("featured_trending_order");
