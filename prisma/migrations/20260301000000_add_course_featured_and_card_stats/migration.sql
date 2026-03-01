-- AlterTable
ALTER TABLE "courses" ADD COLUMN "featured_new_order" INTEGER,
ADD COLUMN "featured_most_played_order" INTEGER,
ADD COLUMN "total_duration_minutes" INTEGER,
ADD COLUMN "rating" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "courses_featured_new_order_idx" ON "courses"("featured_new_order");

-- CreateIndex
CREATE INDEX "courses_featured_most_played_order_idx" ON "courses"("featured_most_played_order");
