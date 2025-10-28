import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

interface JWTPayload {
  user: {
    type: number;
  };
}

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("jwt-token");
    const value: JWTPayload = decodeJwt(token.value);
    if (token && value.user.type != 2) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};