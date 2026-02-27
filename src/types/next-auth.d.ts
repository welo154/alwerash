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
      roles: Role[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    roles?: Role[];
  }
}
