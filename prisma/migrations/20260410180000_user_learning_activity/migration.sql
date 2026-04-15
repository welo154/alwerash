-- Aggregated learning watch time (UTC calendar days).

CREATE TABLE "user_learning_days" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "watch_seconds_total" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_learning_days_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_learning_days_user_id_day_key" ON "user_learning_days"("user_id", "day");
CREATE INDEX "user_learning_days_user_id_idx" ON "user_learning_days"("user_id");

ALTER TABLE "user_learning_days" ADD CONSTRAINT "user_learning_days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "user_course_learning_days" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "watch_seconds_total" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_course_learning_days_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_course_learning_days_user_id_course_id_day_key" ON "user_course_learning_days"("user_id", "course_id", "day");
CREATE INDEX "user_course_learning_days_user_id_day_idx" ON "user_course_learning_days"("user_id", "day");

ALTER TABLE "user_course_learning_days" ADD CONSTRAINT "user_course_learning_days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_course_learning_days" ADD CONSTRAINT "user_course_learning_days_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
