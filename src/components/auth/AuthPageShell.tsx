import { AuthBrandingAside } from "./AuthBrandingAside";
import {
  AUTH_GREEN_PANEL,
  AUTH_MAX_WIDTH,
  AUTH_PAGE_PADDING,
  AUTH_PANEL_GREEN,
  pangeaVar,
} from "./auth-theme";

const AUTH_CONTENT_MIN_HEIGHT = "calc(100vh - 50px - 48px)";

export function AuthPageShell({ panel }: { panel?: React.ReactNode }) {
  return (
    <div className={`${pangeaVar.className} min-h-screen bg-white`} style={{ padding: AUTH_PAGE_PADDING }}>
      <div className="mx-auto w-full" style={{ maxWidth: AUTH_MAX_WIDTH }}>
        <div
          className="flex w-full items-center justify-between"
          style={{ minHeight: AUTH_CONTENT_MIN_HEIGHT }}
        >
          <AuthBrandingAside />
          <div
            className="shrink-0 box-border"
            style={{
              width: AUTH_GREEN_PANEL.width,
              height: AUTH_GREEN_PANEL.height,
              borderRadius: AUTH_GREEN_PANEL.borderRadius,
              background: AUTH_PANEL_GREEN,
              padding: AUTH_GREEN_PANEL.padding,
            }}
          >
            {panel}
          </div>
        </div>
      </div>
    </div>
  );
}
