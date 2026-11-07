/**
 * Route-guard matrix for the edge middleware: who may reach which area.
 * getToken is mocked; everything else is the real middleware.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getToken = vi.fn();
vi.mock("next-auth/jwt", () => ({ getToken: (...a: unknown[]) => getToken(...a) }));

const { middleware } = await import("./middleware");
const { isUnder } = await import("@/lib/route-match");

type Who = "guest" | "LEARNER" | "MENTOR" | "INSTRUCTOR" | "ADMIN";

async function visit(path: string, who: Who) {
  getToken.mockResolvedValue(who === "guest" ? null : { sub: "user-1", roles: [who] });
  const res = await middleware(new NextRequest(new URL(path, "https://alwerash.test")));
  const location = res.headers.get("location");
  return {
    status: res.status,
    // Path (and query) the response redirects to, or null when the request passes.
    redirect: location ? new URL(location).pathname + new URL(location).search : null,
  };
}

const PASS = { status: 200, redirect: null };

beforeEach(() => getToken.mockReset());

describe("isUnder", () => {
  it("matches whole path segments only", () => {
    expect(isUnder("/mentor", "/mentor")).toBe(true);
    expect(isUnder("/mentor/submissions", "/mentor")).toBe(true);
    expect(isUnder("/mentors", "/mentor")).toBe(false);
    expect(isUnder("/mentors/abc", "/mentor")).toBe(false);
  });
});

describe("public pages", () => {
  it.each(["/course", "/course/abc", "/tracks", "/mentors", "/mentors/abc", "/library", "/subscription"])(
    "%s is open to guests",
    async (path) => {
      expect(await visit(path, "guest")).toEqual(PASS);
    }
  );

  it("lets learners open the public mentor directory (regression)", async () => {
    expect(await visit("/mentors", "LEARNER")).toEqual(PASS);
    expect(await visit("/mentors/abc", "LEARNER")).toEqual(PASS);
  });

  it("sends signed-in learners from the guest landing to /home", async () => {
    expect((await visit("/", "LEARNER")).redirect).toBe("/home");
    expect((await visit("/", "MENTOR")).redirect).toBe("/mentor");
    expect((await visit("/", "INSTRUCTOR")).redirect).toBe("/instructor");
  });

  it("redirects legacy /learn URLs", async () => {
    expect((await visit("/learn", "guest")).redirect).toBe("/course");
    expect((await visit("/learn/c1/lesson/l1", "guest")).redirect).toBe("/course-access/c1");
  });
});

describe("learner areas", () => {
  it.each(["/course-access/c1", "/lessons/l1", "/home"])("%s requires sign-in", async (path) => {
    const res = await visit(path, "guest");
    expect(res.status).toBe(307);
    expect(res.redirect).toBe(`/login?next=${encodeURIComponent(path)}`);
  });

  it("lets a learner into the course player (subscription is checked on the page)", async () => {
    expect(await visit("/course-access/c1", "LEARNER")).toEqual(PASS);
  });

  it("keeps signed-in users away from the login and register pages", async () => {
    expect((await visit("/login", "LEARNER")).redirect).toBe("/home");
    expect((await visit("/register", "ADMIN")).redirect).toBe("/admin");
  });

  it("lets a displaced device reach the login page to clear its cookie", async () => {
    expect(await visit("/login?error=device_revoked", "LEARNER")).toEqual(PASS);
  });
});

describe("mentor portal", () => {
  it("sends guests to sign in and returns 401 on the API", async () => {
    expect((await visit("/mentor/submissions", "guest")).redirect).toBe(
      "/login?next=%2Fmentor%2Fsubmissions"
    );
    expect((await visit("/api/mentor/stats", "guest")).status).toBe(401);
  });

  it("forbids learners", async () => {
    expect((await visit("/mentor", "LEARNER")).redirect).toBe("/403");
    expect((await visit("/api/mentor/stats", "LEARNER")).status).toBe(403);
  });

  it("admits mentors and admins", async () => {
    expect(await visit("/mentor/submissions", "MENTOR")).toEqual(PASS);
    expect(await visit("/mentor", "ADMIN")).toEqual(PASS);
  });
});

describe("instructor portal", () => {
  it("forbids learners and admits instructors and admins", async () => {
    expect((await visit("/instructor", "LEARNER")).redirect).toBe("/403");
    expect((await visit("/api/instructor/courses", "LEARNER")).status).toBe(403);
    expect(await visit("/instructor/courses/c1", "INSTRUCTOR")).toEqual(PASS);
    expect(await visit("/instructor", "ADMIN")).toEqual(PASS);
  });
});

describe("admin area", () => {
  it("sends guests to sign in and returns 401 on the API", async () => {
    expect((await visit("/admin/content/tracks", "guest")).redirect).toBe(
      "/login?next=%2Fadmin%2Fcontent%2Ftracks"
    );
    expect((await visit("/api/admin/courses", "guest")).status).toBe(401);
  });

  it.each<Who>(["LEARNER", "MENTOR", "INSTRUCTOR"])("forbids %s", async (who) => {
    expect((await visit("/admin", who)).redirect).toBe("/403");
    expect((await visit("/api/admin/courses", who)).status).toBe(403);
  });

  it("admits admins and keeps them inside staff areas", async () => {
    expect(await visit("/admin/users", "ADMIN")).toEqual(PASS);
    expect(await visit("/api/admin/courses", "ADMIN")).toEqual(PASS);
    expect((await visit("/course", "ADMIN")).redirect).toBe("/admin");
    expect((await visit("/home", "ADMIN")).redirect).toBe("/admin");
  });
});
