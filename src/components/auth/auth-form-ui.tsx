import { AUTH_OAUTH_ICONS } from "./auth-oauth-icons";
import { pangeaFont } from "./auth-theme";

export const authText24: React.CSSProperties = {
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "120%",
  color: "#000",
};

export const authFieldStyle: React.CSSProperties = {
  display: "flex",
  width: 604,
  height: 69,
  padding: "0 12px",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 10,
  borderRadius: 8,
  border: "1px solid #000",
  background: "#FFF",
  boxSizing: "border-box",
};

export const authInputStyle: React.CSSProperties = {
  flex: "1 0 0",
  minWidth: 0,
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  textAlign: "left",
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "19.6px",
  color: "#000",
};

export const authHeadingStyle: React.CSSProperties = {
  fontFamily: pangeaFont,
  fontSize: 48,
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "120%",
};

export const authSubmitButtonStyle: React.CSSProperties = {
  width: 300,
  height: 91,
  padding: "0 16px",
  borderRadius: 8,
  color: "#141413",
  textAlign: "center",
  fontFamily: pangeaFont,
  fontSize: 36,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "19.6px",
};

export const authFieldErrorStyle: React.CSSProperties = {
  ...authText24,
  color: "#dc2626",
};

export function AuthFieldError({
  id,
  message,
}: {
  id: string;
  message?: string | null;
}) {
  if (!message) return null;

  return (
    <p id={id} className="m-0 mt-2" style={authFieldErrorStyle} role="alert">
      {message}
    </p>
  );
}

export function PasswordEyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={20}
      viewBox="0 0 30 22"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M1 11C1 11 6.09091 1 15 1C23.9091 1 29 11 29 11C29 11 23.9091 21 15 21C6.09091 21 1 11 1 11Z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 14.75C17.1087 14.75 18.8182 13.0711 18.8182 11C18.8182 8.92893 17.1087 7.25 15 7.25C12.8913 7.25 11.1818 8.92893 11.1818 11C11.1818 13.0711 12.8913 14.75 15 14.75Z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AuthTextField({
  id,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  error,
  errorId,
  onValueChange,
}: {
  id: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  error?: string | null;
  errorId?: string;
  onValueChange?: () => void;
}) {
  const describedBy = error && errorId ? errorId : undefined;

  return (
    <div className="flex w-[604px] max-w-full flex-col">
      <div style={authFieldStyle}>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={onValueChange}
          className="auth-login-field-input"
          style={authInputStyle}
        />
      </div>
      <AuthFieldError id={errorId ?? `${id}-error`} message={error} />
    </div>
  );
}

export function AuthPasswordField({
  showPassword,
  onShowPassword,
  onHidePassword,
  autoComplete = "current-password",
  error,
  errorId = "password-error",
  onValueChange,
}: {
  showPassword: boolean;
  onShowPassword: () => void;
  onHidePassword: () => void;
  autoComplete?: string;
  error?: string | null;
  errorId?: string;
  onValueChange?: () => void;
}) {
  const describedBy = error ? errorId : undefined;

  return (
    <div className="flex w-[604px] max-w-full flex-col">
      <div style={authFieldStyle}>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="Password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={onValueChange}
          className="auth-login-field-input"
          style={authInputStyle}
        />
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onShowPassword();
          }}
          onPointerUp={onHidePassword}
          onPointerLeave={onHidePassword}
          onPointerCancel={onHidePassword}
          className="flex shrink-0 touch-none items-center justify-center border-none bg-transparent p-0 select-none"
          aria-label="Hold to show password"
          aria-pressed={showPassword}
        >
          <PasswordEyeIcon />
        </button>
      </div>
      <AuthFieldError id={errorId} message={error} />
    </div>
  );
}

export function AuthOAuthSection({
  onOAuthSignIn,
}: {
  onOAuthSignIn?: (providerId: string) => void;
}) {
  return (
    <>
      <div className="h-[17px] shrink-0" aria-hidden />
      <p className="m-0 text-center text-black" style={authText24}>
        Or continue with
      </p>
      <div className="h-[18px] shrink-0" aria-hidden />
      <div className="flex items-center justify-center gap-[12px]">
        {AUTH_OAUTH_ICONS.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.enabled ? item.label : `${item.label} (coming soon)`}
            aria-disabled={!item.enabled}
            disabled={!item.enabled}
            onClick={
              item.enabled && onOAuthSignIn
                ? () => onOAuthSignIn(item.providerId)
                : undefined
            }
            className={`shrink-0 border-none bg-transparent p-0 ${
              item.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-40"
            }`}
            style={{
              width: 44,
              height: 43,
              background: `url(${item.image}) transparent 50% / contain no-repeat`,
            }}
          />
        ))}
      </div>
    </>
  );
}
