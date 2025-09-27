import { cookies } from "next/headers";
import { decodeJwt } from "jose";

interface JWTPayload {
  user: {
    type: number;
    projectIds: { low: number }[];
  };
}

export async function getSession() {
  const cookie = await cookies();

  const token = cookie.get("jwt-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = decodeJwt(token) as JWTPayload;

    return { jwt: token, user: decoded };
  } catch {
    return null;
  }
}
