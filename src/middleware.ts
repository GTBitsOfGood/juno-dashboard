import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

interface JWTPayload {
  user: {
    type: number;
  };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const token = req.cookies.get("jwt-token");
    if (!token) {
      throw new Error("No token found");
    }
    const value: JWTPayload = decodeJwt(token.value);
    if (pathname.startsWith("/admin")) {
      if (value.user.type != 2) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/projects", req.url));
      }
    } else {
      return NextResponse.next();
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

const publicRoutes = ["/", "/login"];

export const config = {
  // matcher: ["/admin/:path*", "/projects/:path*", "/settings/:path*"],
  matcher: ["/((?!api|_next|static|[.].*|favicon.ico).*)"], // Matches ALL routes besides API, _next, and static
};
