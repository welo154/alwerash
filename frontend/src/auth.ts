// file: src/auth.ts — NextAuth v4 config
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@backend/db/prisma";
import { verifyPassword } from "@backend/auth/password";

const CredentialsSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1).max(200),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const raw = {
          email: String(credentials.email).trim(),
          password: String(credentials.password),
        };
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { roles: true },
        });

        if (!user?.passwordHash) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token.sub && !token.roles) {
        const roles = await prisma.userRole.findMany({
          where: { userId: token.sub },
          select: { role: true },
        });
        (token as { roles?: string[] }).roles = roles.map((r) => r.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string; roles: string[] }).id = token.sub ?? "";
        (session.user as { id: string; roles: string[] }).roles = ((token.roles as string[] | undefined) ?? []) as import("@prisma/client").Role[];
      }
      return session;
    },
  },
};

/** Get current session (use in API routes and server components). */
export async function auth() {
  return getServerSession(authOptions);
}

// signIn/signOut: use from "next-auth/react" in client components (see login form).
