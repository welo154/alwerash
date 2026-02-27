"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2d not available");
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      0.92
    );
  });
}

type AvatarCropModalProps = {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (file: File) => void;
};

export function AvatarCropModal({
  open,
  imageSrc,
  onClose,
  onConfirm,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setApplying(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      onConfirm(file);
      onClose();
    } catch (e) {
      console.error("Crop failed:", e);
    } finally {
      setApplying(false);
    }
  }, [imageSrc, croppedAreaPixels, onConfirm, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 to-white px-6 py-4">
          <h2
            id="crop-modal-title"
            className="text-lg font-semibold text-slate-900"
          >
            Customize your photo
          </h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Drag to reposition, use the slider to zoom in or out.
          </p>
        </div>

        {imageSrc && (
          <div className="relative h-[min(70vmin,400px)] w-full bg-slate-900">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={0}
              aspect={1}
              minZoom={1}
              maxZoom={3}
              cropShape="round"
              showGrid={false}
              zoomSpeed={1}
              restrictPosition={true}
              keyboardStep={0.1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {},
                mediaStyle: {},
                cropAreaStyle: {},
              }}
              classes={{
                containerClassName: "rounded-none",
                mediaClassName: "rounded-none",
                cropAreaClassName: "rounded-full border-2 border-white shadow-lg",
              }}
              mediaProps={{}}
              cropperProps={{}}
            />
          </div>
        )}

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <label className="mb-2 block text-xs font-medium text-slate-600">
            Zoom
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
          />
        </div>

        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying || !croppedAreaPixels}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {applying ? "Applying…" : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
