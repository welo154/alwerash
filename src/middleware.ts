// file: src/middleware.ts
// Edge-compatible: use getToken only (no auth() so we don't pull in argon2/Node code).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/") || pathname === "/verify-email";
  const isLearnLanding = pathname === "/learn"; // public: anyone can view the learn/courses list
  const isLearnProtected = pathname.startsWith("/learn/"); // e.g. /learn/[courseId], /learn/[courseId]/lesson/...
  const isLessonsPath = pathname.startsWith("/lessons/");
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isInstructorPath = pathname.startsWith("/instructor");
  const isInstructorApi = pathname.startsWith("/api/instructor");
  const isPlaybackApi = pathname.startsWith("/api/video/playback/");

  const token = await getToken({ req, secret });
  const roles = (token?.roles as string[] | undefined) ?? [];
  const isAdmin = roles.includes("ADMIN");
  const isInstructor = roles.includes("INSTRUCTOR");

  // Logged-in users must not access login/register — redirect away
  if (isAuthPage && token?.sub) {
    const url = req.nextUrl.clone();
    if (isAdmin) url.pathname = "/admin";
    else if (isInstructor) url.pathname = "/instructor";
    else url.pathname = "/learn";
    return NextResponse.redirect(url);
  }

  // Admins may only access admin/instructor dashboards and their APIs; redirect other pages (not API) to /admin
  const isPageRequest = !pathname.startsWith("/api/");
  if (
    token?.sub &&
    isAdmin &&
    isPageRequest &&
    !isAdminPath &&
    !isAdminApi &&
    !isInstructorPath &&
    !isInstructorApi
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // /learn (exact) is public; /learn/... and /lessons/... require login
  if (isLearnLanding) return NextResponse.next();
  const isProtectedPage = isLearnProtected || isLessonsPath;
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

  // Instructor portal + APIs: INSTRUCTOR or ADMIN
  if (isInstructorPath || isInstructorApi) {
    if (!token?.sub) {
      if (isInstructorApi) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!isInstructor && !isAdmin) {
      if (isInstructorApi) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
      const url = req.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
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
