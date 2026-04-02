type UserForRouting = {
  type: number;
  projectIds: number[];
};

export function getDefaultRouteForUser(user: UserForRouting): string | null {
  if (user.type === 0 || user.type === 1) {
    return "/admin";
  }
  const firstProjectId = user.projectIds.at(0);

  return firstProjectId != null ? `/projects/${firstProjectId}` : null;
}
