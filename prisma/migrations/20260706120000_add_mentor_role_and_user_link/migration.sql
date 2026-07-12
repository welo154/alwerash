-- AlterEnum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MENTOR';

-- AlterTable
ALTER TABLE "mentors" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "mentors_user_id_key" ON "mentors"("user_id");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "mentors" ADD CONSTRAINT "mentors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
