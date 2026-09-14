"use client";

import { useId } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const PROFILE_PHOTO_PATH =
  "M225 0C255.376 3.86556e-06 280 24.6243 280 55V179C280 206.614 257.614 229 230 229L99 229C84.6406 229 73 240.641 73 255V268C73 277.941 64.9411 286 55 286C24.6243 286 5.31584e-07 261.376 0 231L0 55C2.83511e-06 24.6243 24.6243 0 55 0L225 0Z";

const PROFILE_STROKE_PATH =
  "M225 0V-2V-2V0ZM280 55H282V55H280ZM55 286V288V288V286ZM0 231H-2V231H0ZM0 55H-2V55H0ZM225 0V2C254.271 2 278 25.7289 278 55H280H282C282 23.5198 256.48 -2 225 -2V0ZM280 55H278V179H280H282V55H280ZM230 229V227L99 227V229V231L230 231V229ZM99 229V227C83.536 227 71 239.536 71 255H73H75C75 241.745 85.7452 231 99 231V229ZM73 255H71V268H73H75V255H73ZM55 286V284C25.7289 284 2 260.271 2 231H0H-2C-2 262.48 23.5198 288 55 288V286ZM0 231H2L2 55H0H-2L-2 231H0ZM0 55H2C2 25.7289 25.7289 2 55 2V0V-2C23.5198 -2 -2 23.5198 -2 55H0ZM55 0V2L225 2V0V-2L55 -2V0ZM73 268H71C71 276.837 63.8366 284 55 284V286V288C66.0457 288 75 279.046 75 268H73ZM280 179H278C278 205.51 256.51 227 230 227V229V231C258.719 231 282 207.719 282 179H280Z";

const MOBILE_PHOTO_PATH =
  "M113 0C126.807 1.22409e-06 138 11.1929 138 25L138 264C138 266.514 137.878 269 137.639 271.452C136.784 280.229 128.732 286 119.913 286H86.7813C72.9741 286 61.7813 297.193 61.7813 311L61.7813 330.219C61.7813 335.621 57.402 340 52 340C23.2812 340 1.06317e-06 316.719 0 288L0 25C1.9329e-06 11.1929 11.1929 1.12745e-07 25 0L113 0Z";

const MOBILE_PHOTO_STROKE_PATH =
  "M113 0V-2V-2V0ZM138 25H140V25H138ZM86.7813 286V284V284V286ZM61.7813 311H59.7813V311H61.7813ZM52 340V342V342V340ZM0 288H-2V288H0ZM0 25H-2V25H0ZM25 0V-2V0ZM137.639 271.452L135.648 271.258L137.639 271.452ZM113 0V2C125.703 2 136 12.2975 136 25H138H140C140 10.0883 127.912 -2 113 -2V0ZM138 25H136L136 264H138H140L140 25H138ZM138 264H136C136 266.449 135.881 268.871 135.648 271.258L137.639 271.452L139.63 271.646C139.875 269.13 140 266.579 140 264H138ZM119.913 286V284H86.7813V286V288H119.913V286ZM86.7813 286V284C71.8696 284 59.7813 296.088 59.7813 311H61.7813H63.7813C63.7813 298.297 74.0787 288 86.7813 288V286ZM61.7813 311H59.7813L59.7813 330.219H61.7813H63.7813L63.7813 311H61.7813ZM52 340V338C24.3858 338 2 315.614 2 288H0H-2C-2 317.823 22.1766 342 52 342V340ZM0 288H2L2 25H0H-2L-2 288H0ZM0 25H2C2 12.2975 12.2975 2 25 2V0V-2C10.0883 -2 -2 10.0883 -2 25H0ZM25 0V2L113 2V0V-2L25 -2V0ZM61.7813 330.219H59.7813C59.7813 334.516 56.2975 338 52 338V340V342C58.5066 342 63.7813 336.725 63.7813 330.219H61.7813ZM137.639 271.452L135.648 271.258C134.917 278.772 127.961 284 119.913 284V286V288C129.502 288 138.652 281.687 139.63 271.646L137.639 271.452Z";

export function ProfilePhotoFrameMobile({
  photoSrc,
  profession,
}: {
  photoSrc?: string | null;
  profession?: string | null;
}) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `profile-photo-mobile-clip-${rawId}`;
  const maskId = `profile-photo-mobile-mask-${rawId}`;
  const src = photoSrc?.trim() || "";
  const professionLabel = profession?.trim() || "";

  return (
    <div className="relative shrink-0" style={{ width: 138, height: 340 }}>
      <svg width={0} height={0} className="absolute" aria-hidden>
        <defs>
          <clipPath id={clipId}>
            <path d={MOBILE_PHOTO_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="absolute inset-0 overflow-hidden bg-[#D3D3D3]"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="absolute max-w-none"
            style={{
              width: "168.971%",
              height: "102.873%",
              left: -53.179,
              top: 0.787,
              objectFit: "cover",
            }}
          />
        ) : null}
      </div>

      <svg
        className="pointer-events-none absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        width={138}
        height={340}
        viewBox="0 0 138 340"
        fill="none"
        aria-hidden
      >
        <defs>
          <mask id={maskId} fill="white">
            <path d={MOBILE_PHOTO_PATH} />
          </mask>
        </defs>
        <path
          d={MOBILE_PHOTO_STROKE_PATH}
          fill="#89F496"
          mask={`url(#${maskId})`}
        />
      </svg>

      {professionLabel ? (
        <p
          className="absolute m-0"
          style={{
            top: 302,
            left: 72,
            width: 54,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "100%",
            opacity: 0.6,
          }}
        >
          {professionLabel}
        </p>
      ) : null}
    </div>
  );
}

const TABLET_PHOTO_PATH =
  "M186 0C216.376 0 241 24.6243 241 55L241 266C241 293.614 218.614 316 191 316H92C77.6406 316 66 327.641 66 342V361C66 367.075 61.0751 372 55 372C24.6243 372 1.61086e-06 347.376 0 317L0 55C0 24.6243 24.6243 1.69118e-07 55 0L186 0Z";

const TABLET_PHOTO_STROKE_PATH =
  "M241 55H243V55H241ZM92 316V314V316ZM66 342H64V342H66ZM0 317H-2V317H0ZM55 0V-2V0ZM186 0V2C215.271 2 239 25.7289 239 55H241H243C243 23.5198 217.48 -2 186 -2V0ZM241 55H239L239 266H241H243L243 55H241ZM191 316V314H92V316V318H191V316ZM92 316V314C76.536 314 64 326.536 64 342H66H68C68 328.745 78.7452 318 92 318V316ZM66 342H64V361H66H68V342H66ZM55 372V370C25.7289 370 2 346.271 2 317H0H-2C-2 348.48 23.5198 374 55 374V372ZM0 317H2L2 55H0H-2L-2 317H0ZM0 55H2C2 25.7289 25.7289 2 55 2V0V-2C23.5198 -2 -2 23.5198 -2 55H0ZM55 0V2L186 2V0V-2L55 -2V0ZM66 361H64C64 365.971 59.9706 370 55 370V372V374C62.1797 374 68 368.18 68 361H66ZM241 266H239C239 292.51 217.51 314 191 314V316V318C219.719 318 243 294.719 243 266H241Z";

export function ProfilePhotoFrameTablet({
  photoSrc,
  profession,
}: {
  photoSrc?: string | null;
  profession?: string | null;
}) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `profile-photo-tablet-clip-${rawId}`;
  const maskId = `profile-photo-tablet-mask-${rawId}`;
  const src = photoSrc?.trim() || "";
  const professionLabel = profession?.trim() || "";

  return (
    <div className="relative shrink-0" style={{ width: 241, height: 372 }}>
      <svg width={0} height={0} className="absolute" aria-hidden>
        <defs>
          <clipPath id={clipId}>
            <path d={TABLET_PHOTO_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="absolute inset-0 overflow-hidden bg-[#D3D3D3]"
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
        width={241}
        height={372}
        viewBox="0 0 241 372"
        fill="none"
        aria-hidden
      >
        <defs>
          <mask id={maskId} fill="white">
            <path d={TABLET_PHOTO_PATH} />
          </mask>
        </defs>
        <path
          d={TABLET_PHOTO_STROKE_PATH}
          fill="#89F496"
          mask={`url(#${maskId})`}
        />
      </svg>

      {professionLabel ? (
        <p
          className="absolute m-0"
          style={{
            top: 329,
            left: 80,
            width: 160,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 20,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "100%",
            opacity: 0.6,
          }}
        >
          {professionLabel}
        </p>
      ) : null}
    </div>
  );
}

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
