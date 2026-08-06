"use client";

import { useState } from "react";
import { ProfileEditButton } from "@/components/profile/ProfileEditModal";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const MAX_VISIBLE_SKILLS = 3;

const FALLBACK_BIO =
  "I'm a working professional creative in the graphic design industry. I work as a concept artist and freelance illustrator. I've worked in-house at an animation studio but currently, work from home.";

export type ProfileInfoPanelProps = {
  initialName: string;
  email: string;
  initialProfession: string;
  initialBio: string;
  initialSkills: string[];
  onProfessionChange?: (profession: string) => void;
};

export function ProfileInfoPanel({
  initialName,
  email,
  initialProfession,
  initialBio,
  initialSkills,
  onProfessionChange,
}: ProfileInfoPanelProps) {
  const [name, setName] = useState(initialName);
  const [profession, setProfession] = useState(initialProfession);
  const [bio, setBio] = useState(initialBio || FALLBACK_BIO);
  const [skills, setSkills] = useState<string[]>(
    initialSkills.length > 0 ? initialSkills : []
  );

  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS);
  const hasMoreSkills = skills.length > MAX_VISIBLE_SKILLS;

  return (
    <div
      className="relative box-border shrink-0"
      style={{
        marginLeft: 21,
        width: 900,
        height: 286,
        borderRadius: 55,
        background: "var(--Bright-Green, #89F496)",
        paddingTop: 44,
        paddingLeft: 55,
        paddingBottom: 44,
      }}
    >
      <p
        className="m-0"
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 32,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {name}
      </p>
      {email ? (
        <p
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {email}
        </p>
      ) : null}
      <p
        className="m-0"
        style={{
          marginTop: 17,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 18,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        Bio
      </p>
      <p
        className="m-0"
        style={{
          marginTop: 4,
          width: 465,
          maxWidth: "100%",
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 18,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {bio}
      </p>

      <div
        className="absolute"
        style={{
          left: 607,
          top: 44,
        }}
      >
        <p
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            opacity: 0.6,
          }}
        >
          Skills
        </p>
        <div
          className="flex flex-wrap"
          style={{
            marginTop: 9,
            columnGap: 6.5,
            rowGap: 9,
            maxWidth: 320,
          }}
        >
          {visibleSkills.map((label) => (
            <div
              key={label}
              className="box-border flex items-center justify-center"
              style={{
                width: "auto",
                height: 35,
                padding: "0 16px",
                borderRadius: "var(--Radius-MD, 8px)",
                border: "0.3px solid var(--Black, #000)",
                background: "#FFF",
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
                {label}
              </span>
            </div>
          ))}
        </div>
        {hasMoreSkills ? (
          <button
            type="button"
            className="mt-[9px] border-0 bg-transparent p-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              opacity: 0.6,
              cursor: "pointer",
            }}
          >
            view more
          </button>
        ) : null}
      </div>

      <ProfileEditButton
        initialName={name}
        initialProfession={profession}
        initialBio={bio}
        initialSkills={skills}
        onSaved={(next) => {
          const nextProfession = next.profession || "Graphic Designer";
          setName(next.name);
          setProfession(nextProfession);
          setBio(next.bio || FALLBACK_BIO);
          setSkills(next.skills);
          onProfessionChange?.(nextProfession);
        }}
      />
    </div>
  );
}
