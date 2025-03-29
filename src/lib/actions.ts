"use server";
import { getJunoInstance } from "@/lib/juno";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";

// TODO: Replace as soon as JWT features implemented (sprint 3)
const ADMIN_EMAIL: string = "test-superadmin@test.com";
const ADMIN_PASSWORD: string = "test-password";

export async function setUserTypeAction(data: {
  email: string;
  type: SetUserTypeModel.TypeEnum;
}) {
  const junoClient = getJunoInstance();

  try {
    await junoClient.user.setUserType({
      adminEmail: ADMIN_EMAIL,
      adminPassword: ADMIN_PASSWORD,
      input: { email: data.email, type: data.type },
    });
    return { success: true };
  } catch {
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
  const junoClient = getJunoInstance();

  const { name, email, password } = data;

  try {
    const user = await junoClient.user.createUser({
      name,
      email,
      password,
      adminEmail: ADMIN_EMAIL,
      adminPassword: ADMIN_PASSWORD,
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

export async function createProjectAction(data: { projectName: string }) {
  const projectName = data.projectName;

  const junoClient = getJunoInstance();
  try {
    await junoClient.project.createProject({
      projectName,
      superadminPassword: ADMIN_PASSWORD,
      superadminEmail: ADMIN_EMAIL,
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function linkUserToProject(data: {
  projectName: string;
  userId: string;
}) {
  const junoClient = getJunoInstance();
  try {
    await junoClient.user.linkToProject({
      adminEmail: ADMIN_EMAIL,
      adminPassword: ADMIN_PASSWORD,
      project: { name: data.projectName },
      userId: data.userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Error linking user:", error);
    return { success: false, error: "Failed to link user type to project" };
  }
}

export async function getProjectUsers(projectId: string) {
  const junoClient = getJunoInstance();

  try {
    const users = await junoClient.project.getProjectUsersById(
      projectId,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
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
