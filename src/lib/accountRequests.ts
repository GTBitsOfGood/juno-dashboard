"use server";

import { UserType } from "juno-sdk/build/main/lib/auth";
import { getJunoInstance } from "./juno";
import { getSession } from "./session";
import { requireAdmin } from "./auth";

export type AccountRequestRole = "ADMIN" | "USER" | "SUPERADMIN";

type RequestNewAccountInput = {
  email: string;
  name: string;
  password: string;
  userType: UserType;
  projectName?: string;
};

export type AccountRequest = {
  id: string;
  email: string;
  name: string;
  userType: AccountRequestRole;
  projectName?: string;
  createdAt: string;
};

export async function requestNewAccount(data: RequestNewAccountInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const juno = getJunoInstance();
    await juno.auth.requestNewAccount(data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error requesting new account:", error.body);
    return {
      success: false,
      error:
        error?.body?.message ||
        error?.message ||
        "Failed to request new account.",
    };
  }
}

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

  try {
    const juno = getJunoInstance();
    const result = await juno.auth.getAllAccountRequests({
      credentials: session.jwt,
    });

    return {
      success: true,
      requests: (result.requests || []).map((request) => ({
        id: String(request.id),
        email: request.email,
        name: request.name,
        userType: String(request.userType) as unknown as AccountRequestRole,
        projectName: request.projectName,
        createdAt: request.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching account requests:", error);
    return {
      success: false,
      requests: [],
      error:
        error?.body?.message ||
        error?.message ||
        "Failed to fetch account requests.",
    };
  }
}

export async function deleteAccountRequest(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (!requireAdmin(session.user)) {
    return { success: false, error: "Only admins can manage account requests" };
  }

  if (!id.trim()) {
    return { success: false, error: "Account request ID is required" };
  }

  try {
    const juno = getJunoInstance();
    await juno.auth.deleteAccountRequest({
      id,
      credentials: session.jwt,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting account request:", error);
    return {
      success: false,
      error:
        error?.body?.message ||
        error?.message ||
        "Failed to delete account request.",
    };
  }
}

export async function acceptAccountRequest(request: AccountRequest): Promise<{
  success: boolean;
  error?: string;
}> {
  console.log("acceptAccountRequest", request);
  return {
    success: false,
    error:
      "Accepting account requests is not supported yet because the API does not expose an approval route or the stored request password.",
  };
}

export async function declineAccountRequest(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  return deleteAccountRequest(id);
}
