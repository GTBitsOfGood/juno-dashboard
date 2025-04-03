"use server";

import { getCredentialsFromJWT } from "./actions";
import { getJunoInstance } from "./juno";

export type projectInputType =
  | {
      name: string;
      id?: never;
    }
  | {
      id: number;
      name?: never;
    };

export type userInputType =
  | {
      email: string;
      id?: never;
    }
  | {
      id: number;
      email?: never;
    };

export async function getUsers() {
  try {
    const client = getJunoInstance();
    const jwt = await getCredentialsFromJWT();

    const { users } = await client.user.getUsers(jwt);

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      projects: user.projectIds,
      role: user.type,
    }));

    return {
      success: true,
      users: formattedUsers,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: `Error fetching users: ${error}`,
    };
  }
}

export async function getProjects() {
  try {
    const client = getJunoInstance();

    const jwt = await getCredentialsFromJWT();

    const { projects } = await client.project.getProjects(jwt);

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error: `Error fetching projects: ${error}`,
    };
  }
}

export async function getJunoProject(input: projectInputType) {
  try {
    const juno = getJunoInstance();
    const res = await juno.project.getProject(input);
    return { success: true, projectId: res.id, projectName: res.name };
  } catch (e) {
    return { success: false, error: `Error getting project: ${e}` };
  }
}

// requires api key to be for the project being linked
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
