"use client";

import { Suspense, useState } from "react";
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

      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}

export function ProfileInfoPanelMobile({
  name,
  email,
  bio,
  skills,
}: {
  name: string;
  email: string;
  bio: string;
  skills: string[];
}) {
  const bioText = bio.trim() || FALLBACK_BIO;
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS);
  const visibleName = name.trim().split(/\s+/).slice(0, 2).join(" ");

  return (
    <div
      className="relative box-border shrink-0 overflow-hidden"
      style={{
        marginLeft: 6,
        width: 221,
        height: 336,
        borderRadius: 25,
        background: "#89F496",
        paddingTop: 20,
        paddingLeft: 13,
      }}
    >
      <div
        className="absolute flex items-center justify-center"
        style={{ top: 20, right: 14, width: 31, height: 31 }}
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={31}
          height={31}
          viewBox="0 0 32 32"
          fill="none"
          className="absolute inset-0"
        >
          <path
            d="M15.6504 31.1504C24.2108 31.1504 31.1504 24.2108 31.1504 15.6504C31.1504 7.08998 24.2108 0.150391 15.6504 0.150391C7.08998 0.150391 0.150391 7.08998 0.150391 15.6504C0.150391 24.2108 7.08998 31.1504 15.6504 31.1504Z"
            fill="var(--White, #FFF)"
            stroke="var(--Black, #000)"
            strokeWidth="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={14.88}
          height={13.64}
          viewBox="0 0 16 15"
          fill="none"
          className="relative"
        >
          <path
            d="M7.94 14.14H15.38M11.66 0.994986C11.9889 0.678052 12.4349 0.5 12.9 0.5C13.1303 0.5 13.3583 0.543713 13.5711 0.628643C13.7838 0.713572 13.9772 0.838056 14.14 0.994986C14.3028 1.15192 14.432 1.33822 14.5201 1.54326C14.6083 1.7483 14.6536 1.96805 14.6536 2.18999C14.6536 2.41192 14.6083 2.63168 14.5201 2.83672C14.432 3.04176 14.3028 3.22806 14.14 3.38499L3.80667 13.3433L0.5 14.14L1.32667 10.9533L11.66 0.994986Z"
            stroke="var(--Black, #000)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p
        className="m-0"
        style={{
          paddingRight: 45,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {visibleName}
      </p>
      {email ? (
        <p
          className="m-0"
          style={{
            marginTop: 3,
            paddingRight: 45,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            opacity: 0.6,
          }}
        >
          {email}
        </p>
      ) : null}
      <p
        className="m-0"
        style={{
          marginTop: 16,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 12,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          opacity: 0.6,
        }}
      >
        Bio
      </p>
      <p
        className="m-0"
        style={{
          marginTop: 3,
          width: 194,
          maxWidth: "100%",
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {bioText}
      </p>
      <p
        className="m-0"
        style={{
          marginTop: 18,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 12,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          opacity: 0.6,
        }}
      >
        Skills
      </p>
      <div
        className="flex flex-wrap items-center"
        style={{
          marginTop: 7,
          columnGap: 6,
          rowGap: 4,
        }}
      >
        {visibleSkills.map((label) => (
          <div
            key={label}
            className="box-border flex items-center justify-center"
            style={{
              height: 29,
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
                fontSize: 14,
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
    </div>
  );
}
