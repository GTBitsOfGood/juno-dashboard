"use server";

import { getJunoInstance } from "./juno";

export async function getProjectById(projectId: number) {
  const junoClient = getJunoInstance();
  try {
    const project = await junoClient.project.getProject({
      id: projectId,
    });
    // JSON transformation is needed since frontend complains about not supported class
    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch {
    return {
      success: false,
      error: `Failed to fetch project by ID: ${projectId}`,
    };
  }
}
