"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { AvatarCropModal } from "./AvatarCropModal";

type ProfileFormProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    country?: string | null;
  };
  subscription: { active: boolean; expiresAt?: Date | null };
};

export function ProfileForm({ user, subscription }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [country, setCountry] = useState(user.country ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.image ?? null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose an image file (JPEG, PNG, or WebP)." });
      return;
    }
    const url = URL.createObjectURL(file);
    setCropImageSrc(url);
    setCropModalOpen(true);
    setMessage(null);
    e.target.value = "";
  };

  const onCropConfirm = useCallback((file: File) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc(null);
    setCropModalOpen(false);
  }, [cropImageSrc]);

  const onCropClose = useCallback(() => {
    setCropModalOpen(false);
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
      setCropImageSrc(null);
    }
  }, [cropImageSrc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let imageUrl: string | null = photoPreview && !photoFile ? photoPreview : null;

      if (photoFile) {
        const formData = new FormData();
        formData.set("photo", photoFile);
        const uploadRes = await fetch("/api/profile/photo", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to upload photo");
        }
        const data = await uploadRes.json();
        imageUrl = data.url ?? null;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          country: country.trim() || null,
          ...(typeof imageUrl === "string" && { image: imageUrl }),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update profile");
      }

      setPhotoFile(null);
      setMessage({ type: "ok", text: "Profile updated." });
      await getSession();
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  const displayImage = photoPreview ?? user.image;
  const initials = (user.name?.charAt(0) ?? user.email?.charAt(0) ?? "?").toUpperCase();

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-slate-100">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your profile
            </h1>
            <p className="mt-2 text-slate-600">
              Keep your info up to date and personalize your experience.
            </p>
          </div>

          {/* Avatar card */}
          <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/50 backdrop-blur sm:p-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <label className="group relative shrink-0 cursor-pointer">
                <span className="flex h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-linear-to-br from-indigo-100 to-slate-100 shadow-xl ring-2 ring-slate-200/60 transition-all duration-300 group-hover:ring-4 group-hover:ring-indigo-300">
                  {displayImage ? (
                    displayImage.startsWith("blob:") ? (
                      <img
                        src={displayImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={displayImage}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    )
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-indigo-600">
                      {initials}
                    </span>
                  )}
                </span>
                <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg ring-2 ring-white transition-all duration-200 group-hover:scale-110 group-hover:bg-indigo-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={onPhotoChange}
                  aria-label="Change profile photo"
                />
              </label>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-slate-900">Profile photo</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Click the camera icon to choose a photo. You’ll be able to crop and zoom so it looks just right.
                </p>
              </div>
            </div>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur sm:p-8"
          >
            {message && (
              <div
                className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
                  message.type === "ok"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <p id="profile-email" className="mt-2 text-slate-700">
                  {user.email}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Email cannot be changed here.</p>
              </div>
              <div>
                <label htmlFor="profile-country" className="block text-sm font-semibold text-slate-700">
                  Country
                </label>
                <input
                  id="profile-country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Country"
                />
              </div>

              {/* Subscription block */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="block text-sm font-semibold text-slate-700">Subscription</span>
                {subscription.active ? (
                  <p className="mt-1 text-slate-700">
                    You are subscribed
                    {subscription.expiresAt
                      ? ` until ${new Date(subscription.expiresAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`
                      : ""}
                    .
                  </p>
                ) : (
                  <p className="mt-1 text-slate-600">No active subscription.</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              {subscription.active ? (
                <Link
                  href="/learn"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  My courses
                </Link>
              ) : (
                <Link
                  href="/subscription"
                  className="rounded-xl border-2 border-indigo-600 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  Subscribe
                </Link>
              )}
              <Link
                href="/"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Back to home
              </Link>
            </div>
          </form>
        </div>
      </div>

      <AvatarCropModal
        open={cropModalOpen}
        imageSrc={cropImageSrc}
        onClose={onCropClose}
        onConfirm={onCropConfirm}
      />
    </>
  );
}
