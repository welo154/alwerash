import "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      country?: string | null;
      profession?: string | null;
      roles: Role[];
      /** Opaque DeviceSession id for this cookie. Null for pre-feature cookies. */
      deviceSessionId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    roles?: Role[];
    country?: string | null;
    profession?: string | null;
    /** Opaque DeviceSession id. Absent on cookies issued before device sessions. */
    sid?: string;
  }
}
