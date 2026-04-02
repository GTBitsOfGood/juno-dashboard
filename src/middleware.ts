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

  if (pathname === "/" || verifiedUser.type === UserType.USER) {
    return NextResponse.redirect(new URL(redirectPath ?? "/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};
