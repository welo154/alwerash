"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getSession } from "next-auth/react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const SKILL_OPTIONS = [
  "DIGITAL ILLUSTRATION",
  "GRAPHIC DESIGN",
  "CONCEPT ART",
  "UI/UX DESIGN",
  "ANIMATION",
  "BRANDING",
  "TYPOGRAPHY",
  "3D MODELING",
] as const;

const DEFAULT_SELECTED_SKILLS: string[] = [
  "DIGITAL ILLUSTRATION",
  "GRAPHIC DESIGN",
  "CONCEPT ART",
];

const fieldStyle: CSSProperties = {
  display: "flex",
  width: 604,
  height: 58,
  padding: "0 12px",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  borderRadius: 8,
  border: "0.3px solid var(--Black, #000)",
  background: "#FFF",
  boxSizing: "border-box",
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
  outline: "none",
};

const placeholderClass =
  "placeholder:text-[#73726C] placeholder:font-[400] placeholder:text-[24px]";

type ProfileEditModalProps = {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  initialProfession?: string;
  initialBio?: string;
  initialSkills?: string[];
  onSaved?: (data: {
    name: string;
    profession: string;
    bio: string;
    skills: string[];
  }) => void;
};

export function ProfileEditModal({
  open,
  onClose,
  initialName = "",
  initialProfession = "",
  initialBio = "",
  initialSkills,
  onSaved,
}: ProfileEditModalProps) {
  const [name, setName] = useState(initialName);
  const [profession, setProfession] = useState(initialProfession);
  const [bio, setBio] = useState(initialBio);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    () => initialSkills ?? DEFAULT_SELECTED_SKILLS
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialsRef = useRef({
    initialName,
    initialProfession,
    initialBio,
    initialSkills,
  });
  initialsRef.current = {
    initialName,
    initialProfession,
    initialBio,
    initialSkills,
  };

  // Reset form only when the modal opens — avoid depending on array identity.
  useEffect(() => {
    if (!open) return;
    const next = initialsRef.current;
    setName(next.initialName);
    setProfession(next.initialProfession);
    setBio(next.initialBio);
    setSelectedSkills(next.initialSkills ?? DEFAULT_SELECTED_SKILLS);
    setError(null);
    setSaving(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose, saving]);

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      return [...prev, skill];
    });
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);
    const next = {
      name: name.trim() || "User",
      profession: profession.trim(),
      bio: bio.trim(),
      skills: selectedSkills,
    };
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: next.name,
          profession: next.profession || null,
          bio: next.bio || null,
          skills: next.skills,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : "Failed to save changes"
        );
      }
      await getSession();
      onSaved?.(next);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-label="Edit profile"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0"
        aria-label="Close overlay"
      />

      <div
        className="relative z-10 box-border overflow-hidden"
        style={{
          width: 727,
          height: 678,
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: 50,
          border: "0.3px solid var(--Black, #000)",
          background: "#FFF",
          paddingTop: 88,
          paddingLeft: 62,
          paddingRight: 61,
          paddingBottom: 40,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 32,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          Edit Profile
        </h2>

        <div className="mt-[25px] flex flex-col" style={{ gap: 16 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            aria-label="Name"
            className={placeholderClass}
            style={fieldStyle}
          />
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Profession"
            aria-label="Profession"
            className={placeholderClass}
            style={fieldStyle}
          />
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            aria-label="Bio"
            className={placeholderClass}
            style={fieldStyle}
          />
        </div>

        <div className="mt-[25px] flex items-baseline">
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 20,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            Skills
          </span>
          <span
            style={{
              marginLeft: 8,
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 20,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
              opacity: 0.5,
            }}
          >
            (Select)
          </span>
        </div>

        <div
          className="mt-[16px] flex flex-wrap"
          style={{
            columnGap: 7,
            rowGap: 11,
            maxWidth: 604,
          }}
          role="group"
          aria-label="Select skills"
        >
          {SKILL_OPTIONS.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                aria-pressed={selected}
                className="box-border flex items-center justify-center p-0"
                style={{
                  width: "auto",
                  height: 35,
                  padding: "0 16px",
                  borderRadius: "var(--Radius-MD, 8px)",
                  border: selected
                    ? "2px solid var(--Green, #8AF396)"
                    : "0.3px solid var(--Black, #000)",
                  background: "#FFF",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: "var(--Black, #000)",
                    textAlign: "center",
                    fontFamily: pangeaFont,
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {skill}
                </span>
              </button>
            );
          })}
        </div>

        {error ? (
          <p
            className="m-0 mt-[12px]"
            style={{
              color: "#B42318",
              fontFamily: pangeaFont,
              fontSize: 14,
              fontWeight: 400,
            }}
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="relative mt-[40px] box-border flex items-center border-0 p-0"
          style={{
            width: 196,
            height: 39,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: "var(--Radius-MD, 8px)",
            border: "0.3px solid var(--Black, #000)",
            background: "var(--Purple, #EA83F0)",
            cursor: saving ? "wait" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          <span
            style={{
              color: "var(--Text-Primary, #141413)",
              fontFamily: pangeaFont,
              fontSize: 20,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              whiteSpace: "nowrap",
            }}
          >
            {saving ? "SAVING…" : "SAVE CHANGES"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="39"
            height="39"
            viewBox="0 0 39 39"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              right: 0,
              top: "50%",
              transform: "translate(50%, -50%)",
              width: 38,
              height: 38,
            }}
          >
            <path
              d="M19.5 38.5C29.9934 38.5 38.5 29.9934 38.5 19.5C38.5 9.00659 29.9934 0.5 19.5 0.5C9.00659 0.5 0.5 9.00659 0.5 19.5C0.5 29.9934 9.00659 38.5 19.5 38.5Z"
              fill="white"
            />
            <path d="M19.5 27.1L27.1 19.5L19.5 11.9" fill="white" />
            <path
              d="M19.5 11.9L27.1 19.5L19.5 27.1M27.1 19.5L11.9 19.5M38.5 19.5C38.5 29.9934 29.9934 38.5 19.5 38.5C9.00659 38.5 0.5 29.9934 0.5 19.5C0.5 9.00659 9.00659 0.5 19.5 0.5C29.9934 0.5 38.5 9.00659 38.5 19.5Z"
              stroke="#1E1E1E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

type ProfileEditButtonProps = {
  className?: string;
  initialName?: string;
  initialProfession?: string;
  initialBio?: string;
  initialSkills?: string[];
  onSaved?: (data: {
    name: string;
    profession: string;
    bio: string;
    skills: string[];
  }) => void;
};

export function ProfileEditButton({
  className = "",
  initialName,
  initialProfession,
  initialBio,
  initialSkills,
  onSaved,
}: ProfileEditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`absolute box-border flex items-center justify-end border-0 p-0 ${className}`.trim()}
        style={{
          right: 59,
          bottom: 39,
          width: 87,
          height: 39,
          paddingRight: 16,
          paddingLeft: 16,
          borderRadius: "var(--Radius-MD, 8px)",
          border: "0.3px solid var(--Black, #000)",
          background: "var(--Dark-Green, #004B3C)",
          cursor: "pointer",
        }}
        aria-label="Edit profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={39}
          height={38.464}
          viewBox="0 0 39 38"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: 0,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <path
            d="M19.1504 37.6143C29.6438 37.6143 38.1504 29.2277 38.1504 18.8823C38.1504 8.53696 29.6438 0.150391 19.1504 0.150391C8.65698 0.150391 0.150391 8.53696 0.150391 18.8823C0.150391 29.2277 8.65698 37.6143 19.1504 37.6143Z"
            fill="white"
            stroke="black"
            strokeWidth="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.1504 26.8895H28.1504M23.6504 10.6223C24.0482 10.2301 24.5878 10.0098 25.1504 10.0098C25.429 10.0098 25.7048 10.0639 25.9622 10.169C26.2196 10.2741 26.4534 10.4281 26.6504 10.6223C26.8474 10.8165 27.0036 11.0471 27.1102 11.3008C27.2168 11.5546 27.2717 11.8265 27.2717 12.1012C27.2717 12.3758 27.2168 12.6478 27.1102 12.9015C27.0036 13.1552 26.8474 13.3858 26.6504 13.58L14.1504 25.9036L10.1504 26.8895L11.1504 22.946L23.6504 10.6223Z"
            stroke="#1E1E1E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            color: "var(--White, #FFF)",
            textAlign: "right",
            fontFamily: pangeaFont,
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
          }}
        >
          EDIT
        </span>
      </button>

      <ProfileEditModal
        open={open}
        onClose={() => setOpen(false)}
        initialName={initialName}
        initialProfession={initialProfession}
        initialBio={initialBio}
        initialSkills={initialSkills}
        onSaved={onSaved}
      />
    </>
  );
}
