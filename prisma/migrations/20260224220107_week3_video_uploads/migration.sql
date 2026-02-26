-- CreateEnum
CREATE TYPE "VideoUploadStatus" AS ENUM ('CREATED', 'ASSET_CREATED', 'READY', 'ERRORED');

-- CreateEnum
CREATE TYPE "VideoEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "video_uploads" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "mux_upload_id" TEXT NOT NULL,
    "passthrough" TEXT,
    "asset_id" TEXT,
    "status" "VideoUploadStatus" NOT NULL DEFAULT 'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_events" (
    "id" TEXT NOT NULL,
    "mux_event_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "status" "VideoEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "payload" JSONB,

    CONSTRAINT "video_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_uploads_mux_upload_id_key" ON "video_uploads"("mux_upload_id");

-- CreateIndex
CREATE INDEX "video_uploads_lesson_id_created_at_idx" ON "video_uploads"("lesson_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "video_events_mux_event_id_key" ON "video_events"("mux_event_id");

-- CreateIndex
CREATE INDEX "video_events_type_status_idx" ON "video_events"("type", "status");

-- AddForeignKey
ALTER TABLE "video_uploads" ADD CONSTRAINT "video_uploads_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
