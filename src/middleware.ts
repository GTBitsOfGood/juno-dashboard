import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, UserType } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const verifiedUser = await verifyJWT(token);

  if (!verifiedUser) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (verifiedUser.type === UserType.USER) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};