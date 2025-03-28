import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("jwt-token");
    const value = decodeJwt(token.value) as any;
    if (token && value.user.type != 2) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (Exception) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
