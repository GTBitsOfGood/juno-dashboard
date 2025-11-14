export enum UserType {
  SUPERADMIN = 0,
  ADMIN = 1,
  USER = 2,
}

export interface VerifiedUser {
  id: number;
  email: string;
  name: string;
  type: UserType;
  projectIds: number[];
}

export async function verifyJWT(token: string): Promise<VerifiedUser | null> {
  try {
    const baseURL =
      process.env.NEXT_PUBLIC_JUNO_BASE_URL ||
      process.env.JUNO_BASE_URL ||
      "http://localhost:8888";

    // TODO: switch this to be a juno-sdk route, but low priority
    const response = await fetch(`${baseURL}/auth/test-auth`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.valid || !data.user) {
      return null;
    }

    const userId =
      typeof data.user.id === "object"
        ? Number(data.user.id.low)
        : Number(data.user.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectIds = (data.user.projectIds || []).map((p: any) =>
      typeof p === "object" && "low" in p ? Number(p.low) : Number(p),
    );

    return {
      id: userId,
      email: data.user.email,
      name: data.user.name,
      type: data.user.type,
      projectIds,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export function requireRole(
  user: VerifiedUser | null,
  allowedRoles: UserType[],
): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.type);
}

export function requireSuperAdmin(user: VerifiedUser | null): boolean {
  return requireRole(user, [UserType.SUPERADMIN]);
}

export function requireAdmin(user: VerifiedUser | null): boolean {
  return requireRole(user, [UserType.SUPERADMIN, UserType.ADMIN]);
}

export function hasProjectAccess(
  user: VerifiedUser | null,
  projectId: number,
): boolean {
  if (!user) return false;
  if (user.type === UserType.SUPERADMIN) return true;
  return user.projectIds.includes(projectId);
}
