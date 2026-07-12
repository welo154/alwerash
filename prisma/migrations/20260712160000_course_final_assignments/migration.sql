-- Course-final assignments (Phase 1): add course_id, make lesson_id optional.

-- Drop existing lesson-scoped assignments (submissions cascade).
DELETE FROM "assignments";

ALTER TABLE "assignments" DROP CONSTRAINT IF EXISTS "assignments_lesson_id_fkey";

ALTER TABLE "assignments" ALTER COLUMN "lesson_id" DROP NOT NULL;

ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "course_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "assignments_course_id_key" ON "assignments"("course_id");

ALTER TABLE "assignments"
  ADD CONSTRAINT "assignments_course_id_fkey"
  FOREIGN KEY ("course_id") REFERENCES "courses"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "assignments"
  ADD CONSTRAINT "assignments_lesson_id_fkey"
  FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
