"use client";

import { useId } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const PROFILE_PHOTO_PATH =
  "M225 0C255.376 3.86556e-06 280 24.6243 280 55V179C280 206.614 257.614 229 230 229L99 229C84.6406 229 73 240.641 73 255V268C73 277.941 64.9411 286 55 286C24.6243 286 5.31584e-07 261.376 0 231L0 55C2.83511e-06 24.6243 24.6243 0 55 0L225 0Z";

const PROFILE_STROKE_PATH =
  "M225 0V-2V-2V0ZM280 55H282V55H280ZM55 286V288V288V286ZM0 231H-2V231H0ZM0 55H-2V55H0ZM225 0V2C254.271 2 278 25.7289 278 55H280H282C282 23.5198 256.48 -2 225 -2V0ZM280 55H278V179H280H282V55H280ZM230 229V227L99 227V229V231L230 231V229ZM99 229V227C83.536 227 71 239.536 71 255H73H75C75 241.745 85.7452 231 99 231V229ZM73 255H71V268H73H75V255H73ZM55 286V284C25.7289 284 2 260.271 2 231H0H-2C-2 262.48 23.5198 288 55 288V286ZM0 231H2L2 55H0H-2L-2 231H0ZM0 55H2C2 25.7289 25.7289 2 55 2V0V-2C23.5198 -2 -2 23.5198 -2 55H0ZM55 0V2L225 2V0V-2L55 -2V0ZM73 268H71C71 276.837 63.8366 284 55 284V286V288C66.0457 288 75 279.046 75 268H73ZM280 179H278C278 205.51 256.51 227 230 227V229V231C258.719 231 282 207.719 282 179H280Z";

export function ProfilePhotoFrame({
  photoSrc,
  profession,
}: {
  photoSrc?: string | null;
  profession?: string | null;
}) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `profile-photo-clip-${rawId}`;
  const maskId = `profile-photo-mask-${rawId}`;
  const src = photoSrc?.trim() || "";
  const professionLabel = profession?.trim() || "";

  return (
    <div className="relative shrink-0" style={{ width: 280, height: 286 }}>
      <svg width={0} height={0} className="absolute" aria-hidden>
        <defs>
          <clipPath id={clipId}>
            <path d={PROFILE_PHOTO_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="absolute inset-0 overflow-hidden bg-[#E9E9E9]"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        ) : null}
      </div>

      <svg
        className="pointer-events-none absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        width={280}
        height={286}
        viewBox="0 0 280 286"
        fill="none"
        aria-hidden
      >
        <defs>
          <mask id={maskId} fill="white">
            <path d={PROFILE_PHOTO_PATH} />
          </mask>
        </defs>
        <path
          d={PROFILE_STROKE_PATH}
          fill="#89F496"
          mask={`url(#${maskId})`}
        />
      </svg>

      {professionLabel ? (
        <p
          className="absolute m-0"
          style={{
            right: 10,
            bottom: 10,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            opacity: 0.6,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          {professionLabel}
        </p>
      ) : null}
    </div>
  );
}
