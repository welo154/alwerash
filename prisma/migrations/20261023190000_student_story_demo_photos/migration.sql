-- Demo project photos for the four starter student stories.
-- Leaves a photo alone once an admin has uploaded one.

UPDATE "student_stories"
SET "project_image" = '/student-projects/mohamed-sabry-project.jpg',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'seed_student_story_1'
  AND "project_image" IS NULL;

UPDATE "student_stories"
SET "project_image" = '/student-projects/salma-nabil-project.jpg',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'seed_student_story_2'
  AND "project_image" IS NULL;

UPDATE "student_stories"
SET "project_image" = '/student-projects/karim-adel-project.jpg',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'seed_student_story_3'
  AND "project_image" IS NULL;

UPDATE "student_stories"
SET "project_image" = '/student-projects/hana-youssef-project.jpg',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'seed_student_story_4'
  AND "project_image" IS NULL;
