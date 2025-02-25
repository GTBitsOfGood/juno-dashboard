"use server";

import { getJunoInstance } from "./juno";

type projectInputType =
  | {
      name: string;
      id?: never;
    }
  | {
      id: number;
      name?: never;
    };

type userInputType =
  | {
      email: string;
      id?: never;
    }
  | {
      id: number;
      email?: never;
    };

export async function getJunoProject(input: projectInputType) {
  try {
    const juno = getJunoInstance();
    const res = await juno.project.getProject(input);
    return { success: true, projectId: res.id, projectName: res.name };
  } catch (e) {
    return { success: false, error: `Error getting project: ${e}` };
  }
}

export async function linkJunoProjectToUser(options: {
  project: projectInputType;
  user: userInputType;
}) {
  try {
    const juno = getJunoInstance();
    await juno.project.linkProjectToUser(options);
    return { success: true };
  } catch (e) {
    return { success: false, error: `Error linking project to user: ${e}` };
  }
}
