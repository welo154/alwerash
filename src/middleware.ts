// file: src/middleware.ts
// Edge-compatible: use getToken only (no auth() so we don't pull in argon2/Node code).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLearnPath = pathname === "/learn" || pathname.startsWith("/learn/");
  const isLessonsPath = pathname.startsWith("/lessons/");
  const isSubscriptionPath = pathname === "/subscription" || pathname.startsWith("/subscription");
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isPlaybackApi = pathname.startsWith("/api/video/playback/");

  const token = await getToken({ req, secret });
  const roles = (token?.roles as string[] | undefined) ?? [];
  const isAdmin = roles.includes("ADMIN");

  // Logged-in users must not access login/register — redirect away
  if (isAuthPage && token?.sub) {
    const url = req.nextUrl.clone();
    url.pathname = isAdmin ? "/admin" : "/learn";
    return NextResponse.redirect(url);
  }

  // Admins may only access admin dashboard and admin API; redirect other pages (not API) to /admin
  const isPageRequest = !pathname.startsWith("/api/");
  if (token?.sub && isAdmin && isPageRequest && !isAdminPath && !isAdminApi) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  const isProtectedPage = isLearnPath || isLessonsPath || isSubscriptionPath;

  // Protect learn, lessons, subscription: require login
  if (isProtectedPage) {
    if (!token?.sub) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect video playback API: require login
  if (isPlaybackApi) {
    if (!token?.sub) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin routes: require login and ADMIN role
  if (!isAdminPath && !isAdminApi) return NextResponse.next();

  if (!token?.sub) {
    if (isAdminApi) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!isAdmin) {
    if (isAdminApi) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    const url = req.nextUrl.clone();
    url.pathname = "/403";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except static assets and NextAuth API
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|woff2?)$).*)"],
};
