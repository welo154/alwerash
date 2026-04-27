"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { CatalogShowcaseCard, catalogShowcasePropsFromCourse } from "@/components/cards";
import { AvatarCropModal } from "./AvatarCropModal";
import { RenewalCountdown } from "./RenewalCountdown";

type CourseForCard = {
  id: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  instructorName: string | null;
  track: { title: string; slug: string } | null;
  lessonCount: number;
  totalDurationMinutes: number | null;
  rating: number | null;
  studentCount: number;
};

type ProfileFormProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    country?: string | null;
    profession?: string | null;
  };
  subscription: { active: boolean; expiresAt?: Date | null };
  favoritCourses: CourseForCard[];
};

export function ProfileForm({ user, subscription, favoritCourses }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [profession, setProfession] = useState(user.profession ?? "");
  const [country, setCountry] = useState(user.country ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.image ?? null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
    setPhotoPreview(URL.createObjectURL(file));
    setCropModalOpen(false);
    setCropImageSrc(null);
  }, []);

  const onCropClose = useCallback(() => {
    setCropModalOpen(false);
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc(null);
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
        const uploadRes = await fetch("/api/profile/photo", { method: "POST", body: formData });
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
          profession: profession.trim() || null,
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
      setEditModalOpen(false);
      await getSession();
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const displayImage = photoPreview ?? user.image;
  const initials = (user.name?.charAt(0) ?? user.email?.charAt(0) ?? "?").toUpperCase();
  const titleLine = profession?.trim() || country?.trim() || "Learner";

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            {/* Left column: profile picture, name, title, ABOUT */}
            <aside className="shrink-0 lg:w-[380px]">
              <label className="relative block cursor-pointer">
                <span className="flex h-56 w-56 overflow-hidden rounded-full border-4 border-[var(--color-primary)] bg-slate-100 shadow-md sm:h-64 sm:w-64">
                  {displayImage ? (
                    displayImage.startsWith("blob:") ? (
                      <img src={displayImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Image
                        src={displayImage}
                        alt=""
                        width={256}
                        height={256}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    )
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-5xl font-bold text-slate-500 sm:text-6xl">
                      {initials}
                    </span>
                  )}
                </span>
                <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={onPhotoChange}
                  aria-label="Change photo"
                />
              </label>
              <h1 className="mt-8 text-3xl font-bold tracking-tight text-black">
                {name?.trim() || user.email || "Profile"}
              </h1>
              <p className="mt-2 text-base font-normal text-slate-600">{titleLine}</p>
              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ABOUT:</p>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {user.email && (
                    <>
                      {user.email}
                      {profession?.trim() && ` · ${profession.trim()}`}
                      {country?.trim() && ` · ${country.trim()}`}
                    </>
                  )}
                  {!user.email && !country?.trim() && !profession?.trim() && "—"}
                </p>
              </div>
            </aside>

            {/* Right column: Favorit, renewal bar, buttons */}
            <main className="min-w-0 flex-1">
              {/* Favorit section */}
              <h2 className="text-2xl font-bold tracking-tight text-black">Favorit</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favoritCourses.map((course) => (
                  <CatalogShowcaseCard
                    key={course.id}
                    {...catalogShowcasePropsFromCourse(course)}
                  />
                ))}
              </div>
              {favoritCourses.length > 0 && (
                <Link
                  href="/course"
                  className="mt-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  View all courses →
                </Link>
              )}

              {/* Days Left For Renewal */}
              <div className="mt-8 rounded-xl bg-[var(--color-accent)] px-6 py-4 flex items-center justify-between">
                <span className="font-bold text-white">Days Left For Renewal</span>
                {subscription.active && subscription.expiresAt ? (
                  <span className="font-bold text-white">
                    <RenewalCountdown expiresAt={new Date(subscription.expiresAt)} />
                  </span>
                ) : (
                  <span className="font-bold text-white">—</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/subscription"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Help
                </Link>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Edit Profile
                </button>
                <Link
                  href="/profile/change-password"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Change Pass
                </Link>
                <Link
                  href="/profile/certificates"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Certificates
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Edit Profile modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditModalOpen(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {message && (
                <div
                  className={`rounded-lg px-4 py-2 text-sm ${
                    message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <p className="mt-1 text-slate-600">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Track / focus
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. Frontend developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="Country"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AvatarCropModal open={cropModalOpen} imageSrc={cropImageSrc} onClose={onCropClose} onConfirm={onCropConfirm} />
    </>
  );
}
