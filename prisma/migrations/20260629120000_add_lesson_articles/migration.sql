-- CreateTable
CREATE TABLE "lesson_articles" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "lesson_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_articles_lesson_id_key" ON "lesson_articles"("lesson_id");

-- AddForeignKey
ALTER TABLE "lesson_articles" ADD CONSTRAINT "lesson_articles_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
