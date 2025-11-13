import { cookies } from "next/headers";
import { verifyJWT, VerifiedUser } from "./auth";

export async function getSession(): Promise<{
  jwt: string;
  user: VerifiedUser;
} | null> {
  const cookie = await cookies();

  const token = cookie.get("jwt-token")?.value;

  if (!token) {
    return null;
  }

  const verifiedUser = await verifyJWT(token);

  if (!verifiedUser) {
    return null;
  }

  return { jwt: token, user: verifiedUser };
}
