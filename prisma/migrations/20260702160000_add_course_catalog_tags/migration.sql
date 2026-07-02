-- Catalog filter tags for courses (admin checkboxes)
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "tag_guided" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "tag_deep_dive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "tag_basics" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "tag_new" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "tag_top_rated" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "courses_tag_guided_idx" ON "courses"("tag_guided");
CREATE INDEX IF NOT EXISTS "courses_tag_deep_dive_idx" ON "courses"("tag_deep_dive");
CREATE INDEX IF NOT EXISTS "courses_tag_basics_idx" ON "courses"("tag_basics");
CREATE INDEX IF NOT EXISTS "courses_tag_new_idx" ON "courses"("tag_new");
CREATE INDEX IF NOT EXISTS "courses_tag_top_rated_idx" ON "courses"("tag_top_rated");
