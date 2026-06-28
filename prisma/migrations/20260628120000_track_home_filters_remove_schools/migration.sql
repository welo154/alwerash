-- Add home meta-filter order columns on tracks
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "featured_order" INTEGER;
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "top_rated_order" INTEGER;
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "activity_order" INTEGER;

-- Backfill featured from existing track order so FEATURED has data on day one
UPDATE "tracks"
SET "featured_order" = "order"
WHERE "published" = true AND "featured_order" IS NULL;

-- Remove school hierarchy
ALTER TABLE "tracks" DROP CONSTRAINT IF EXISTS "tracks_school_id_fkey";
DROP INDEX IF EXISTS "tracks_school_id_idx";
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "school_id";

DROP TABLE IF EXISTS "schools";
