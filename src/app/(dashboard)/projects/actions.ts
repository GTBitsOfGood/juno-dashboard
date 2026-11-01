"use server";

import { hasProjectAccess, requireAdmin } from "@/lib/auth";
import { getProjects } from "@/lib/sdkActions";
import { getSession } from "@/lib/session";

export async function getVisibleProjects() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized", projects: [] };
  }

  try {
    const result = await getProjects();
    if (!result.success) return result;
    const { projects } = result;
    return {
      success: true,
      projects: requireAdmin(session.user)
        ? projects
        : projects.filter((project) =>
            hasProjectAccess(session.user, Number(project.id)),
          ),
    };
  } catch (error) {
    console.error("Error fetching visible projects:", error);
    return { success: false, error: "Unable to load projects", projects: [] };
  }
}
