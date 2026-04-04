import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, UserType } from "@/lib/auth";
import { getDefaultRouteForUser } from "@/lib/userRouting";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwt-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const verifiedUser = await verifyJWT(token);

  if (!verifiedUser) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const redirectPath = getDefaultRouteForUser(verifiedUser);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(redirectPath ?? "/login", req.url));
  }

  // only allow users to access their own projects
  if (verifiedUser.type === UserType.USER) {
    const isAllowedProjectPath = verifiedUser.projectIds.some((projectId) => {
      const projectPath = `/projects/${projectId}`;
      return pathname === projectPath || pathname.startsWith(`${projectPath}/`);
    });

    if (!isAllowedProjectPath) {
      return NextResponse.redirect(new URL(redirectPath ?? "/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*", "/projects/:path*"],
};
