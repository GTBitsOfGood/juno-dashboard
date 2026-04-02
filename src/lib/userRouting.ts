import { UserType } from "./auth";

type UserForRouting = {
  type: number;
  projectIds: number[];
};

export function getDefaultRouteForUser(user: UserForRouting): string | null {
  if (user.type === UserType.SUPERADMIN || user.type === UserType.ADMIN) {
    return "/admin";
  }
  const firstProjectId = user.projectIds.at(0);

  return firstProjectId != null ? `/projects/${firstProjectId}` : null;
}
