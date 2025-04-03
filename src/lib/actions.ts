"use server";
import { getJunoInstance } from "@/lib/juno";
import { cookies } from "next/headers";

import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";

export async function setUserTypeAction(data: {
  email: string;
  type: SetUserTypeModel.TypeEnum;
}) {
  const junoClient = getJunoInstance();

  try {
    const jwt = await getCredentialsFromJWT();
    await junoClient.user.setUserType({
      input: { email: data.email, type: data.type },
      credentials: jwt,
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
    const jwt = await getCredentialsFromJWT();
    const user = await junoClient.user.createUser({
      name,
      email,
      password,
      credentials: jwt
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
    const jwt = await getCredentialsFromJWT();
    await junoClient.project.createProject({
      projectName,
      credentials: jwt
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
    const jwt = await getCredentialsFromJWT();
    await junoClient.user.linkToProject({
      credentials: jwt,
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
    const jwt = await getCredentialsFromJWT();

    const users = await junoClient.project.getProjectUsersById(
      projectId,
      jwt
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
    //Token needs to be put in a cookie and stuff
    (await cookies()).set({
      name: "jwt-token",
      value: result.token,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60, //One hour
      path: "/",
    });
    return { success: true };
  } catch (error) {
    console.error("Error generating JWT:", error);
    return { success: false, error: "Failed to login." };
  }
}

export async function getCredentialsFromJWT() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt-token");
  return cookie.value; //Pass in as Authorization header for it to be recognized by middleware.
}

export async function deleteJWT() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt-token");
  //Revoke key as well
  const junoClient = getJunoInstance();
  junoClient.auth.revokeKey({ apiKey: cookie.value });
  cookieStore.delete("jwt-token");
}
