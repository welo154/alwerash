-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");

-- CreateIndex
CREATE INDEX "schools_published_idx" ON "schools"("published");

-- Insert default school for existing tracks (use raw cuid-like id)
INSERT INTO "schools" ("id", "title", "slug", "order", "published", "created_at", "updated_at")
VALUES ('clxxdefaultschool00000000001', 'Default School', 'default-school', 0, true, NOW(), NOW());

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_track_id_fkey";

-- AlterTable: courses.track_id nullable
ALTER TABLE "courses" ALTER COLUMN "track_id" DROP NOT NULL;

-- AlterTable: add school_id to tracks (nullable first)
ALTER TABLE "tracks" ADD COLUMN "school_id" TEXT;

-- Backfill: assign all existing tracks to default school
UPDATE "tracks" SET "school_id" = 'clxxdefaultschool00000000001' WHERE "school_id" IS NULL;

-- Now set NOT NULL
ALTER TABLE "tracks" ALTER COLUMN "school_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "tracks_school_id_idx" ON "tracks"("school_id");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey (course track optional)
ALTER TABLE "courses" ADD CONSTRAINT "courses_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
