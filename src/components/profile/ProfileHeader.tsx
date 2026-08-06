"use client";

import { useState } from "react";
import { ProfileInfoPanel } from "@/components/profile/ProfileInfoPanel";
import { ProfilePhotoFrame } from "@/components/profile/ProfilePhotoFrame";

type ProfileHeaderProps = {
  photoSrc: string;
  initialName: string;
  email: string;
  initialProfession: string;
  initialBio: string;
  initialSkills: string[];
};

export function ProfileHeader({
  photoSrc,
  initialName,
  email,
  initialProfession,
  initialBio,
  initialSkills,
}: ProfileHeaderProps) {
  const [profession, setProfession] = useState(initialProfession);

  return (
    <div
      className="flex w-full flex-nowrap items-start"
      style={{ paddingLeft: 120 }}
    >
      <ProfilePhotoFrame photoSrc={photoSrc} profession={profession} />
      <ProfileInfoPanel
        initialName={initialName}
        email={email}
        initialProfession={profession}
        initialBio={initialBio}
        initialSkills={initialSkills}
        onProfessionChange={setProfession}
      />
    </div>
  );
}
