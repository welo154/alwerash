import Script from "next/script";
import { MicrosoftClarityIdentify } from "./MicrosoftClarityIdentify";

/** Official Clarity project ID (manual install snippet). */
const CLARITY_PROJECT_ID = "y32zdmd8vu";

/** Clarity project IDs are alphanumeric; reject anything else before interpolating. */
const PROJECT_ID_PATTERN = /^[A-Za-z0-9]+$/;

function getClarityProjectId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() ?? "";
  const projectId = fromEnv || CLARITY_PROJECT_ID;
  if (!PROJECT_ID_PATTERN.test(projectId)) return null;
  return projectId;
}

function shouldLoadClarity(): boolean {
  if (process.env.NEXT_PUBLIC_CLARITY_IN_DEV === "true") return true;
  return process.env.NODE_ENV === "production";
}

/**
 * Microsoft Clarity session replay + heatmaps.
 * Uses project y32zdmd8vu (manual tracking snippet). Off in local `next dev`
 * unless NEXT_PUBLIC_CLARITY_IN_DEV=true.
 */
export function MicrosoftClarity({ userId }: { userId?: string | null }) {
  const projectId = getClarityProjectId();
  if (!projectId || !shouldLoadClarity()) return null;

  return (
    <>
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");`}
      </Script>
      {userId ? <MicrosoftClarityIdentify userId={userId} /> : null}
    </>
  );
}
