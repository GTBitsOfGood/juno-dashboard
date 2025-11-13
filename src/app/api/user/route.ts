import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
};
