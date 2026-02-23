-- Run this in Supabase SQL Editor if migration fails to connect.
-- Adds cover_image column to tracks table.
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "cover_image" TEXT;
