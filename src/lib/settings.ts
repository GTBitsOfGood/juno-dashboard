"use server";

import {
  EmailConfigResponse,
  FileConfigResponse,
} from "juno-sdk/build/main/internal/api";
import { getJunoInstance } from "./juno";

export async function getFileConfig(
  projectId: string,
): Promise<FileConfigResponse> {
  const junoClient = getJunoInstance();
  const fileConfig = await junoClient.settings.getFileConfig(projectId);
  return JSON.parse(JSON.stringify(fileConfig));
}

export async function getEmailConfig(
  projectId: string,
): Promise<EmailConfigResponse> {
  const junoClient = getJunoInstance();
  const emailConfig = await junoClient.settings.getEmailConfig(projectId);
  return JSON.parse(JSON.stringify(emailConfig));
}
