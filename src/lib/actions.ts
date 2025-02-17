"use server";
import { getJunoInstance } from "@/lib/juno";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
export async function setUserTypeAction(data: {
  email: string;
  type: SetUserTypeModel.TypeEnum;
  adminEmail: string;
  adminPassword: string;
}) {
  const junoClient = getJunoInstance();
  try {
    //Type should be a string, not a number?
    await junoClient.user.setUserType({
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
      input: { email: data.email, type: data.type },
    });
    return { success: true };
  } catch (error) {
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
  adminEmail: string;
  adminPassword: string;
}) {
  const junoClient = getJunoInstance();
  try {
    const result = await junoClient.user.createUser(data);
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user." };
  }
}

export async function linkUserToProject(data: {
  adminEmail: string;
  adminPassword: string;
  projectName: string;
  userId: string;
}) {
  const junoClient = getJunoInstance();
  try {
    const result = await junoClient.user.linkToProject({
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
      project: { name: data.projectName },
      userId: data.userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Error linking user:", error);
    return { success: false, error: "Failed to link user type to project" };
  }
}
