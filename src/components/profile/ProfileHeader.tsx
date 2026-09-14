"use client";

import { useState } from "react";
import {
  ProfileInfoPanel,
  ProfileInfoPanelMobile,
  ProfileInfoPanelTablet,
} from "@/components/profile/ProfileInfoPanel";
import {
  ProfilePhotoFrame,
  ProfilePhotoFrameMobile,
  ProfilePhotoFrameTablet,
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
        className="flex w-full items-start max-[743px]:flex min-[744px]:hidden"
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
        className="hidden w-full flex-nowrap items-start justify-center min-[744px]:max-lg:flex"
        style={{
          /* Site header is in flow (7px pad + 68.6px nav). Pull up so 114px is from the page top. */
          marginTop: -(7 + 3 + 41 * 1.6),
          paddingTop: 114,
        }}
      >
        <ProfilePhotoFrameTablet photoSrc={photoSrc} profession={profession} />
        <ProfileInfoPanelTablet
          initialName={initialName}
          email={email}
          initialProfession={profession}
          initialBio={initialBio}
          initialSkills={initialSkills}
          onProfessionChange={setProfession}
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
