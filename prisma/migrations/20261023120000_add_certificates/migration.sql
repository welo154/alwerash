-- Course certificates issued after a mentor approves the final assignment.
-- Row-level security is on so the Supabase Data API cannot read it; the app
-- connects as the table owner and bypasses RLS, matching the earlier lockdown.

ALTER TABLE "mentors" ADD COLUMN IF NOT EXISTS "signature_image" TEXT;

CREATE TABLE IF NOT EXISTS "certificates" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "submission_id" TEXT,
  "recipient_name" TEXT NOT NULL,
  "course_title" TEXT NOT NULL,
  "mentor_name" TEXT,
  "mentor_title" TEXT,
  "signature_image" TEXT,
  "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "certificates_code_key" ON "certificates" ("code");
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_submission_id_key" ON "certificates" ("submission_id");
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_user_id_course_id_key" ON "certificates" ("user_id", "course_id");
CREATE INDEX IF NOT EXISTS "certificates_course_id_idx" ON "certificates" ("course_id");

DO $$ BEGIN
  ALTER TABLE "certificates"
    ADD CONSTRAINT "certificates_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "certificates"
    ADD CONSTRAINT "certificates_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "certificates"
    ADD CONSTRAINT "certificates_submission_id_fkey"
    FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "certificates" ENABLE ROW LEVEL SECURITY;
