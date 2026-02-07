"use server";

import { getJunoInstance } from "./juno";
import { getSession } from "./session";
import { hasProjectAccess } from "./auth";

export async function getProjectById(projectId: number) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  if (!hasProjectAccess(session.user, projectId)) {
    return {
      success: false,
      error: "You don't have access to this project",
    };
  }

  const junoClient = getJunoInstance();
  try {
    const project = await junoClient.project.getProject({
      id: projectId,
    });
    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch {
    return {
      success: false,
      error: `Failed to fetch project by ID: ${projectId}`,
    };
  }
}
