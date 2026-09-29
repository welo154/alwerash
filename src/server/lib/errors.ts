// file: src/server/lib/errors.ts
export type ErrorCode =
  | "UNAUTHORIZED"
  /** Session was displaced by a sign-in on another device of the same kind. */
  | "DEVICE_SESSION_REVOKED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "NOT_FOUND"
  | "UNAVAILABLE"
  | "INTERNAL";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, status: number, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
