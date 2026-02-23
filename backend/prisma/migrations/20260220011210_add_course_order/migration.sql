-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "courses_track_id_order_idx" ON "courses"("track_id", "order");
