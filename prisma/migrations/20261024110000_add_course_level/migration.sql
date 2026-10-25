-- Skill level shown on course cards. Existing catalog tags seed the first value.

CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

ALTER TABLE "courses" ADD COLUMN "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER';

UPDATE "courses" SET "level" = 'ADVANCED' WHERE "tag_deep_dive" = true;
UPDATE "courses"
SET "level" = 'INTERMEDIATE'
WHERE "level" = 'BEGINNER' AND "tag_guided" = true AND "tag_basics" IS NOT TRUE;
