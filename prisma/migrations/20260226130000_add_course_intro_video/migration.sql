-- AlterTable
ALTER TABLE "courses" ADD COLUMN "intro_video_mux_playback_id" TEXT;

-- CreateTable
CREATE TABLE "course_intro_video_uploads" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "mux_upload_id" TEXT NOT NULL,
    "passthrough" TEXT,
    "asset_id" TEXT,
    "status" "VideoUploadStatus" NOT NULL DEFAULT 'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_intro_video_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_intro_video_uploads_mux_upload_id_key" ON "course_intro_video_uploads"("mux_upload_id");

-- CreateIndex
CREATE INDEX "course_intro_video_uploads_course_id_idx" ON "course_intro_video_uploads"("course_id");

-- AddForeignKey
ALTER TABLE "course_intro_video_uploads" ADD CONSTRAINT "course_intro_video_uploads_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
