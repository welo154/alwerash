-- Student reviews shown in “Why students love Alwerash”.
-- Row-level security is on so the Supabase Data API cannot read the table.
-- The app connects as the table owner and bypasses RLS.

CREATE TABLE IF NOT EXISTS "student_stories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "job_title" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "project_image" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "student_stories_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "student_stories_published_sort_order_idx"
  ON "student_stories" ("published", "sort_order");

INSERT INTO "student_stories" ("id", "name", "job_title", "quote", "sort_order", "published", "updated_at")
VALUES
  (
    'seed_student_story_1',
    'Mohamed Sabry',
    'Graphic designer',
    'This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.',
    1,
    true,
    CURRENT_TIMESTAMP
  ),
  (
    'seed_student_story_2',
    'Salma Nabil',
    'Illustrator',
    'This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.',
    2,
    true,
    CURRENT_TIMESTAMP
  ),
  (
    'seed_student_story_3',
    'Karim Adel',
    'Motion designer',
    'This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.',
    3,
    true,
    CURRENT_TIMESTAMP
  ),
  (
    'seed_student_story_4',
    'Hana Youssef',
    'Brand designer',
    'This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.',
    4,
    true,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "student_stories" ENABLE ROW LEVEL SECURITY;
