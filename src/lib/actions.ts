"use server";
import { getJunoInstance } from "@/lib/juno";
import { cookies } from "next/headers";

import { getSession } from "./session";
import {
  verifyJWT,
  requireSuperAdmin,
  requireAdmin,
  hasProjectAccess,
} from "./auth";
import { getDefaultRouteForUser } from "./userRouting";
import { SetUserTypeModelTypeEnum } from "juno-sdk/build/main/internal";

export async function setUserTypeAction(data: {
  email: string;
  type: SetUserTypeModelTypeEnum;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireSuperAdmin(session.user)) {
    return { success: false, error: "Only superadmins can change user types" };
  }

  const junoClient = getJunoInstance();

  try {
    await junoClient.user.setUserType({
      input: { email: data.email, type: data.type },
      credentials: session.jwt,
    });
    return { success: true };
  } catch (err) {
    if (err.body) {
      return {
        success: false,
        error: `Failed to update user type: ${JSON.stringify(err.body.message)}`,
      };
    }

    return {
      success: false,
      error: `Failed to update user type: ${data.type}`,
    };
  }
}

export async function createUserAction(data: {
  name: string;
  email: string;
  password: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can create users",
    };
  }

  const junoClient = getJunoInstance();

  const { name, email, password } = data;

  try {
    const user = await junoClient.user.createUser({
      name,
      email,
      password,
      credentials: session.jwt,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        projectIds: user.projectIds,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.body };
  }
}

export async function createKeyAction(data: {
  projectName: string;
  environment: string;
  description: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return { success: false, error: "Only admins can create API keys" };
  }

  const junoClient = getJunoInstance();

  try {
    const result = await junoClient.auth.createKey({
      project: data.projectName,
      environment: data.environment,
      description: data.description,
      credentials: session.jwt,
    });
    return { success: true, apiKey: result.apiKey };
  } catch (error) {
    console.error("Error creating API key:", error);
    return { success: false, error: "Failed to create API key" };
  }
}

export async function getApiKeysAction(options: {
  offset: number;
  limit: number;
}) {
  const { offset, limit } = options;
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized", keys: [] };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can view API keys",
      keys: [],
    };
  }

  const junoClient = getJunoInstance();

  try {
    const res = await junoClient.auth.getAllApiKeys({
      offset,
      limit,
      credentials: session.jwt,
    });
    return {
      success: true,
      keys: res.keys ?? [],
      links: res.links ?? { first: "", prev: "", next: "", last: "" },
    };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return {
      success: false,
      error: "Failed to fetch API keys",
      keys: [],
      links: { first: "", prev: "", next: "", last: "" },
    };
  }
}

export async function deleteApiKeyByIdAction(keyId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return { success: false, error: "Only admins can delete API keys" };
  }

  const junoClient = getJunoInstance();

  try {
    await junoClient.auth.deleteApiKeyById({
      keyId,
      credentials: session.jwt,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false, error: "Failed to delete API key" };
  }
}

export async function createProjectAction(data: { projectName: string }) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can create projects",
    };
  }

  const projectName = data.projectName;

  const junoClient = getJunoInstance();
  try {
    const project = await junoClient.project.createProject({
      projectName,
      credentials: session.jwt,
    });
    return {
      success: true,
      project: {
        id: project.id,
        name: project.name,
      },
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function linkUserToProject(data: {
  projectName: string;
  userId: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can link users to projects",
    };
  }

  const junoClient = getJunoInstance();
  try {
    await junoClient.user.linkToProject({
      credentials: session.jwt,
      project: { name: data.projectName },
      userId: data.userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Error linking user:", error);
    return { success: false, error: "Failed to link user type to project" };
  }
}

export async function linkUserToProjectId(data: {
  projectId: number;
  userId: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can link users to projects",
    };
  }

  const junoClient = getJunoInstance();
  try {
    await junoClient.user.linkToProject({
      credentials: session.jwt,
      project: { id: data.projectId },
      userId: data.userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Error linking user:", error);
    return { success: false, error: "Failed to link user type to project" };
  }
}

export async function unlinkUserFromProject(data: {
  projectName: string;
  userId: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      error: "Only admins and superadmins can unlink users from projects",
    };
  }

  const junoClient = getJunoInstance();
  try {
    await junoClient.user.unlinkFromProject({
      credentials: session.jwt,
      project: { name: data.projectName },
      userId: data.userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Error unlinking user:", error);
    return { success: false, error: "Failed to unlink user from project" };
  }
}

export async function getProjectUsers(projectId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return { success: false, error: "You don't have access to this project" };
  }

  const junoClient = getJunoInstance();

  try {
    const users = await junoClient.project.getProjectUsersById(
      projectId,
      session.jwt,
    );

    return {
      success: true,
      users:
        users?.users?.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.type,
          projects: user.projectIds,
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching project users:", error);
    return {
      success: false,
      error: "Failed to fetch project users: " + error.message,
    };
  }
}

export async function createJWTAuthentication(data: {
  email: string;
  password: string;
}) {
  const junoClient = getJunoInstance();
  try {
    const result = await junoClient.auth.getUserJWT({
      email: data.email,
      password: data.password,
    });
    const verifiedUser = await verifyJWT(result.token);

    if (!verifiedUser) {
      return {
        success: false,
        error: "Unable to verify your account after login.",
      };
    }

    const redirectPath = getDefaultRouteForUser(verifiedUser);

    if (!redirectPath) {
      return {
        success: false,
        error:
          "Your account is not assigned to a project yet. Please ask your EM or Infra team to add you to the correct project.",
      };
    }

    (await cookies()).set({
      name: "jwt-token",
      value: result.token,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60, //One hour
      path: "/",
    });
    return { success: true, redirectPath };
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return { success: false, error: "Failed to connect to Juno instance." };
    }

    return { success: false, error: "Invalid user credentials provided." };
  }
}

export async function deleteJWT() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt-token");
  cookieStore.delete("user-email");
  cookieStore.delete("user-password");
}

export async function deleteUserAction(userId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireSuperAdmin(session.user)) {
    return { success: false, error: "Only superadmins can delete users" };
  }

  const junoClient = getJunoInstance();
  try {
    await junoClient.user.deleteUser({
      userId,
      credentials: session.jwt,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

export async function deleteProjectAction(projectId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireSuperAdmin(session.user)) {
    return { success: false, error: "Only superadmins can delete projects" };
  }

  const junoClient = getJunoInstance();
  try {
    await junoClient.project.deleteProject({
      project: { id: Number(projectId) },
      credentials: session.jwt,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project." };
  }
}
