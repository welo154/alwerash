-- Run this in Supabase SQL Editor if prisma migrate deploy fails.
-- Fixes: "The column courses.instructor_name does not exist in the current database"

-- Add instructor columns if they don't exist
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "instructor_name" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "instructor_image" TEXT;

-- Add intro video column if it doesn't exist
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "intro_video_mux_playback_id" TEXT;
