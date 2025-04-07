"use server";

import { getJunoInstance } from "./juno";

export async function getFileConfig(projectId: string) {
  const junoClient = getJunoInstance();
  try {
    const fileConfig = await junoClient.settings.getFileConfig(projectId);
    return {
      success: true,
      fileConfig: JSON.parse(JSON.stringify(fileConfig)),
    };
  } catch (error) {
    console.error("Error fetching file config:", error);
    return {
      success: false,
      error: "Failed to fetch file config from project",
    };
  }
}

export async function getEmailConfig(projectId: string) {
  const junoClient = getJunoInstance();
  try {
    const emailConfig = await junoClient.settings.getEmailConfig(projectId);
    return {
      success: true,
      emailConfig: JSON.parse(JSON.stringify(emailConfig)),
    };
  } catch (error) {
    console.error("Error fetching email config:", error);
    return {
      success: false,
      error: "Failed to fetch email config from project",
    };
  }
}
