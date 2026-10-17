-- Soft-launch teaser flag. Published courses can still appear in the catalog while
-- the full learning experience stays closed until this is cleared.

ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "coming_soon" BOOLEAN NOT NULL DEFAULT false;
