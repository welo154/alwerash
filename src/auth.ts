// file: src/auth.ts — NextAuth v4 config
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { readUserProfessionFromDb } from "@/server/user/readProfession";
import { verifyAgainstDummyPassword, verifyPassword } from "@/server/auth/password";
import { registerDeviceSession, revokeDeviceSession } from "@/server/auth/device-session";
import { RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";
import { recordSecurityEvent } from "@/server/security/security-events";
import { sendDeviceDisplacedEmail } from "@/server/email/resend.client";

const CredentialsSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1).max(200),
});

export function buildAuthOptions({ canPersistToken }: { canPersistToken: boolean }): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    secret:
      process.env.AUTH_SECRET ??
      process.env.NEXTAUTH_SECRET ??
      (process.env.NEXT_PHASE === "phase-production-build" ? "vercel-build-placeholder" : undefined),
    pages: { signIn: "/login" },
    providers: [
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? [
            Google({
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
          ]
        : []),
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

          // Both limits are counted before the password check so a locked-out
          // attacker learns nothing from response timing. Exceeding either looks
          // like a wrong password to the client.
          const { ip } = await readRequestContext();
          const [perEmail, perIp] = await Promise.all([
            consumeRateLimit(RATE_LIMITS.loginPerEmail, email),
            consumeRateLimit(RATE_LIMITS.loginPerIp, ip),
          ]);
          if (!perEmail.allowed || !perIp.allowed) {
            await recordSecurityEvent({
              type: "LOGIN_RATE_LIMITED",
              email,
              metadata: { perEmail: !perEmail.allowed, perIp: !perIp.allowed },
            });
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: { roles: true },
          });

          const passwordOk = user?.passwordHash
            ? await verifyPassword(password, user.passwordHash)
            : await verifyAgainstDummyPassword(password).then(() => false);

          let failure: string | null = null;
          if (!user) failure = "unknown_email";
          else if (!user.passwordHash) failure = "no_password_account";
          else if (!passwordOk) failure = "bad_password";
          else if (!user.emailVerified) failure = "unverified";

          if (!user || failure) {
            await recordSecurityEvent({
              type: "LOGIN_FAILED",
              userId: user?.id ?? null,
              email: user ? null : email,
              metadata: { reason: failure },
            });
            return null;
          }

          await recordSecurityEvent({ type: "LOGIN_SUCCEEDED", userId: user.id, metadata: { method: "password" } });
          return { id: user.id, email: user.email, name: user.name ?? undefined };
        },
      }),
    ],
    events: {
      async createUser({ user }) {
        await prisma.userRole.create({
          data: { userId: user.id, role: Role.LEARNER },
        });
      },
      async signOut({ token }) {
        // Free the device slot on explicit sign-out. Without this the row stays
        // ACTIVE until the next sign-in displaces it.
        if (token?.sub && token?.sid) {
          await revokeDeviceSession(token.sub, token.sid, "USER_SIGNED_OUT").catch((error) => {
            console.error("[auth] device session revoke on sign-out failed", error);
          });
        }
      },
    },
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (user?.id) {
          token.sub = user.id;
          delete token.roles;
          // A fresh sign-in always occupies a device slot, so drop any sid carried
          // over from a previous session on this browser.
          delete token.sid;
        }

        if (trigger === "update" && session && typeof session === "object") {
          const patch = "user" in session && session.user && typeof session.user === "object"
            ? (session.user as Record<string, unknown>)
            : (session as Record<string, unknown>);
          if ("name" in patch) token.name = (patch.name as string | null | undefined) ?? token.name;
          if ("email" in patch) token.email = (patch.email as string | null | undefined) ?? token.email;
          if ("image" in patch) token.picture = (patch.image as string | null | undefined) ?? token.picture;
          if ("country" in patch) token.country = (patch.country as string | null | undefined) ?? null;
          if ("profession" in patch) token.profession = (patch.profession as string | null | undefined) ?? null;
          return token;
        }

        // Name and profile fields are copied once. Roles are re-read below on later
        // requests, because an admin can add or remove one without a new sign-in.
        let hydratedRoles = false;
        if (token.sub && token.roles == null) {
          try {
            const [roles, dbUser, profession] = await Promise.all([
              prisma.userRole.findMany({
                where: { userId: token.sub },
                select: { role: true },
              }),
              prisma.user.findUnique({
                where: { id: token.sub },
                select: { name: true, image: true, email: true, country: true },
              }),
              readUserProfessionFromDb(token.sub),
            ]);
            token.roles = roles.map((r) => r.role);
            hydratedRoles = true;
            if (dbUser) {
              token.name = dbUser.name ?? token.name;
              token.email = dbUser.email ?? token.email;
              token.picture = dbUser.image ?? token.picture;
              token.country = dbUser.country ?? null;
            }
            token.profession = profession;
          } catch {
            token.roles = [];
            hydratedRoles = true;
          }
        }

        if (token.sub && !hydratedRoles) {
          try {
            const roles = await prisma.userRole.findMany({
              where: { userId: token.sub },
              select: { role: true },
            });
            token.roles = roles.map((r) => r.role);
          } catch {
            // Keep the roles already in the cookie if the database is briefly down,
            // rather than treating every member as if they had none.
          }
        }

        // Register a device for this cookie if it does not have one yet. This runs
        // on sign-in and also once for cookies issued before device sessions
        // existed, so current students are grandfathered in without being signed
        // out. Only the NextAuth route handler can write the re-encoded cookie;
        // server components and API routes discard it, so registering there would
        // insert a new row on every request.
        if (token.sub && !token.sid && canPersistToken) {
          try {
            const registration = await registerDeviceSession(token.sub);
            token.sid = registration.sessionId;
            if (registration.replaced.length > 0) {
              await recordSecurityEvent({
                type: "DEVICE_REPLACED",
                userId: token.sub,
                metadata: { kind: registration.kind, replaced: registration.replaced.length },
              });
              const email = typeof token.email === "string" ? token.email : null;
              if (email) {
                const previous = registration.replaced.find((row) => row.label)?.label ?? "your other device";
                await sendDeviceDisplacedEmail(email, previous).catch((error) => {
                  console.error("[auth] device displacement email failed", error);
                });
              }
            }
          } catch (error) {
            // Never block sign-in on registry failure; the request stays legacy and
            // registration is retried next time.
            console.error("[auth] device session registration failed", error);
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
          session.user.deviceSessionId = token.sid ?? null;
          session.user.roles = token.roles ?? [];
          session.user.name = token.name ?? session.user.name ?? null;
          session.user.email = token.email ?? session.user.email ?? null;
          session.user.image = token.picture ?? session.user.image ?? null;
          session.user.country = token.country ?? null;
          session.user.profession = token.profession ?? null;
        }
        return session;
      },
    },
  };
}

/** For the NextAuth route handler, the only caller whose cookie writes are kept. */
export const authOptions = buildAuthOptions({ canPersistToken: true });

const readOnlyAuthOptions = buildAuthOptions({ canPersistToken: false });

/** Get current session (use in API routes and server components). */
export async function auth() {
  try {
    return await getServerSession(readOnlyAuthOptions);
  } catch (error) {
    console.error("[auth] getServerSession failed", error);
    return null;
  }
}

// signIn/signOut: use from "next-auth/react" in client components (see login form).
