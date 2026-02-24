"use server";

import {
  createUserAction,
  createProjectAction,
  linkUserToProject,
} from "./actions";
import { getSession } from "./session";
import { requireAdmin } from "./auth";

export type AccountRequestRole = "ADMIN" | "USER" | "SUPERADMIN";

export type AccountRequest = {
  id: string;
  email: string;
  name: string;
  password: string;
  userType: AccountRequestRole;
  projectName?: string;
};

// PLACEHOLDER: replace with real SDK call
export async function getAccountRequests(): Promise<{
  success: boolean;
  requests: AccountRequest[];
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, requests: [], error: "Unauthorized" };

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      requests: [],
      error: "Only admins can view account requests",
    };
  }

  return {
    success: true,
    requests: [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "placeholder",
        userType: "ADMIN",
        projectName: "Apollo",
      },
      {
        id: "2",
        name: "Marcus Lee",
        email: "marcus.lee@example.com",
        password: "placeholder",
        userType: "USER",
      },
      {
        id: "3",
        name: "Priya Nair",
        email: "priya.nair@example.com",
        password: "placeholder",
        userType: "ADMIN",
        projectName: "Hermes",
      },
    ],
  };
}

// PLACEHOLDER: replace with real SDK call
export async function deleteAccountRequest(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (!requireAdmin(session.user)) {
    return { success: false, error: "Only admins can manage account requests" };
  }

  const success = (id === id);
  return { success };
}

export async function acceptAccountRequest(request: AccountRequest): Promise<{
  success: boolean;
  error?: string;
}> {
  const userResult = await createUserAction({
    name: request.name,
    email: request.email,
    password: request.password,
  });

  if (!userResult.success) {
    const raw = String(userResult.error ?? "");
    const errorMessage = raw.includes("ALREADY_EXISTS")
      ? `An account with the email ${request.email} already exists.`
      : "An unexpected error occurred while creating the account. Please try again.";
    return { success: false, error: errorMessage };
  }

  if (request.userType === "ADMIN" && request.projectName) {
    const projectResult = await createProjectAction({
      projectName: request.projectName,
    });

    if (!projectResult.success) {
      return {
        success: false,
        error: `User created but failed to create project: ${projectResult.error}`,
      };
    }

    const linkResult = await linkUserToProject({
      projectName: request.projectName,
      userId: String(userResult.user.id),
    });

    if (!linkResult.success) {
      return {
        success: false,
        error: `User and project created but failed to link them: ${linkResult.error}`,
      };
    }
  }

  const deleteResult = await deleteAccountRequest(request.id);
  if (!deleteResult.success) {
    console.error(
      `Failed to delete account request ${request.id}: ${deleteResult.error}`,
    );
  }

  return { success: true };
}

export async function declineAccountRequest(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  return deleteAccountRequest(id);
}
