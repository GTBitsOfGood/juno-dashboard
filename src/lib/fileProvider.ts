"use server";

import {
  FileBucket,
  FileProvider,
  FileProviderPartial,
} from "juno-sdk/build/main/internal/index";
import { hasProjectAccess } from "./auth";
import { getJunoInstance } from "./juno";
import { getSession } from "./session";

export async function getAllFileProviders(
  projectId: string,
): Promise<FileProvider[]> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }
  const junoClient = getJunoInstance();

  try {
    const providers = await junoClient.file.getAllFileProviders({
      userJwt: session.jwt,
      projectId: projectId,
    });

    return JSON.parse(JSON.stringify(providers));
  } catch (e) {
    if (e.response?.statusCode === 404) {
      return [];
    }

    throw e;
  }
}

export async function registerProvider(
  options: {
    baseUrl: string;
    providerName: string;
    type: string;
    accessKey: { publicAccessKey: string; privateAccessKey: string };
  },
  projectId: string,
): Promise<FileProviderPartial> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const provider = await junoClient.file.registerProvider(options, {
    userJwt: session.jwt,
    projectId: projectId,
  });

  return JSON.parse(JSON.stringify(provider));
}

export async function deleteProvider(
  name: string,
  projectId: string,
): Promise<FileBucket> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const provider = await junoClient.file.deleteProvider(name, {
    userJwt: session.jwt,
    projectId: projectId,
  });
  return JSON.parse(JSON.stringify(provider));
}
