"use server";

import { getJunoInstance } from "./juno";
import { getSession } from "./session";
import { requireAdmin, hasProjectAccess } from "./auth";

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
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      users: [],
    };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can view all users",
      users: [],
    };
  }

  try {
    const client = getJunoInstance();
    const { users } = await client.user.getUsers(session.jwt);

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
      users: [],
    };
  }
}

export async function getProjects() {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      projects: [],
    };
  }

  try {
    const client = getJunoInstance();
    const projects = (await client.project.getProjects(session.jwt)) as any;

    return {
      success: true,
      projects: projects ? projects.projects : [],
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error: `Error fetching projects: ${error}`,
      projects: [],
    };
  }
}

export async function getJunoCounts() {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      projectCount: 0,
      userCount: 0,
    };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can view counts",
      projectCount: 0,
      userCount: 0,
    };
  }

  try {
    const client = getJunoInstance();
    const projects = await client.project.getProjects(session.jwt);
    const { users } = await client.user.getUsers(session.jwt);

    return {
      success: true,
      projectCount: Array.isArray(projects) ? projects.length : 0,
      userCount: users.length,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error: `Error fetching projects: ${error}`,
      projectCount: 0,
      userCount: 0,
    };
  }
}

export async function getJunoProject(input: projectInputType) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const juno = getJunoInstance();
    const res = await juno.project.getProject(input);

    if (res.id && !hasProjectAccess(session.user, Number(res.id))) {
      return { success: false, error: "You don't have access to this project" };
    }

    return { success: true, projectId: res.id, projectName: res.name };
  } catch (e) {
    return { success: false, error: `Error getting project: ${e}` };
  }
}

export async function linkJunoProjectToUser(options: {
  project: projectInputType;
  user: userInputType;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can link projects to users",
    };
  }

  try {
    const juno = getJunoInstance();
    await juno.project.linkProjectToUser(options);
    return { success: true };
  } catch (e) {
    return { success: false, error: `Error linking project to user: ${e}` };
  }
}
