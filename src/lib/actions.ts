"use server";
import { getJunoInstance } from "@/lib/juno";
import { cookies } from "next/headers";

import { SetUserTypeModelTypeEnum } from "juno-sdk/build/main/internal/index";
import { APIKey } from "@/components/forms/CreateAPIKeyForm";
import { getSession } from "./session";
import { requireSuperAdmin, requireAdmin, hasProjectAccess } from "./auth";

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

  const credentials = await getUserCredentials();
  if (!credentials) {
    return { success: false, error: "Missing credentials" };
  }

  const junoClient = getJunoInstance();

  try {
    const result = await junoClient.auth.createKey({
      email: credentials.email,
      password: credentials.password,
      project: data.projectName,
      environment: data.environment,
      description: data.description,
    });
    return { success: true, apiKey: result.apiKey };
  } catch (error) {
    console.error("Error creating API key:", error);
    return { success: false, error: "Failed to create API key" };
  }
}

async function getUserCredentials(): Promise<{
  email: string;
  password: string;
} | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get("user-email")?.value;
  const password = cookieStore.get("user-password")?.value;
  if (!email || !password) return null;
  return { email, password };
}

export async function getApiKeysAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized", keys: [] };
  }

  if (!requireSuperAdmin(session.user)) {
    return {
      success: false,
      error: "Only superadmins can view API keys",
      keys: [],
    };
  }

  const credentials = await getUserCredentials();
  if (!credentials) {
    return { success: false, error: "Missing credentials", keys: [] };
  }

  const junoClient = getJunoInstance();

  try {
    const result = await junoClient.auth.getAllApiKeys({
      email: credentials.email,
      password: credentials.password,
    });
    return { success: true, keys: result.keys ?? [] };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return { success: false, error: "Failed to fetch API keys", keys: [] };
  }
}

export async function deleteApiKeyAction(keyId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!requireSuperAdmin(session.user)) {
    return { success: false, error: "Only superadmins can delete API keys" };
  }

  const credentials = await getUserCredentials();
  if (!credentials) {
    return { success: false, error: "Missing credentials" };
  }

  const baseURL = process.env.JUNO_BASE_URL || "http://localhost:8888";

  try {
    const response = await fetch(`${baseURL}/auth/key/${keyId}`, {
      method: "DELETE",
      headers: {
        "X-User-Email": credentials.email,
        "X-User-Password": credentials.password,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Delete API key failed:", response.status, body);
      return { success: false, error: "Failed to delete API key" };
    }

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
    const cookieStore = await cookies();
    cookieStore.set({
      name: "jwt-token",
      value: result.token,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60, //One hour
      path: "/",
    });
    cookieStore.set({
      name: "user-email",
      value: data.email,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
      httpOnly: true,
    });
    cookieStore.set({
      name: "user-password",
      value: data.password,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
      httpOnly: true,
    });
    return { success: true };
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
