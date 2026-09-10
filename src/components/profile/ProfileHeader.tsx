"use client";

import { useState } from "react";
import { ProfileInfoPanel, ProfileInfoPanelMobile } from "@/components/profile/ProfileInfoPanel";
import {
  ProfilePhotoFrame,
  ProfilePhotoFrameMobile,
} from "@/components/profile/ProfilePhotoFrame";

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
    <>
      <div
        className="flex w-full items-start lg:hidden"
        style={{
          /* 94px from the top of the page: mobile header is 37px + 47px bar. */
          marginTop: -84,
          paddingTop: 94,
          paddingLeft: 14,
        }}
      >
        <ProfilePhotoFrameMobile photoSrc={photoSrc} profession={profession} />
        <ProfileInfoPanelMobile
          name={initialName}
          email={email}
          bio={initialBio}
          skills={initialSkills}
        />
      </div>

      <div
        className="hidden w-full flex-nowrap items-start lg:flex"
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
    </>
  );
}
