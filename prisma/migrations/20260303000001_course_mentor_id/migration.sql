-- AlterTable: add optional mentor_id to courses
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "mentor_id" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "courses_mentor_id_idx" ON "courses"("mentor_id");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
