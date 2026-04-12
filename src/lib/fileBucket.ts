"use server";

import {
  DeleteFileBucketModel,
  DeleteFilesResponse,
  FileBucket,
} from "juno-sdk/build/main/internal/index";
import { hasProjectAccess, requireAdmin } from "./auth";
import { getJunoInstance } from "./juno";
import { getSession } from "./session";

export async function getBucketsByConfigIdAndEnv(
  configId: number,
  projectId: string,
): Promise<FileBucket[]> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }
  const junoClient = getJunoInstance();

  try {
    const buckets = await junoClient.file.getBucketsByConfigIdAndEnv(
      configId.toString(),
      {
        userJwt: session.jwt,
        projectId: projectId,
      },
    );

    return JSON.parse(JSON.stringify(buckets));
  } catch (e) {
    if (e.response?.status === 404 || e.response?.status === 401) {
      return [];
    }

    throw e;
  }
}

export async function getAllFiles(
  configId: number,
  projectId: string,
): Promise<Array<Record<string, string[]>>> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }
  const junoClient = getJunoInstance();

  try {
    const files = await junoClient.file.getAllFiles(
      configId.toString(),
      {
        userJwt: session.jwt,
        projectId: projectId,
      },
    );

    return JSON.parse(JSON.stringify(files));
  } catch (e) {
    if (e.response?.status === 404 || e.response?.status === 401) {
      return [];
    }

    throw e;
  }
}

export async function registerBucket(
  options: {
    name: string;
    configId: number;
    fileProviderName: string;
    fileServiceFile?: Array<object>;
  },
  projectId: string,
): Promise<FileBucket> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!requireAdmin(session.user)) {
    throw new Error("Only admins and superadmins can register file buckets");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const bucket = await junoClient.file.registerBucket(options, {
    userJwt: session.jwt,
    projectId: projectId,
  });
  return JSON.parse(JSON.stringify(bucket));
}

export async function deleteFiles(
  options: {
    bucketName: string;
    configId: number;
    fileNames: string[];
  },
  projectId: string,
): Promise<DeleteFilesResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!requireAdmin(session.user)) {
    throw new Error("Only admins and superadmins can delete files");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const result = await junoClient.file.deleteFiles(options, {
    userJwt: session.jwt,
    projectId: projectId,
  });
  return JSON.parse(JSON.stringify(result));
}

export async function deleteBucket(
  options: DeleteFileBucketModel,
  projectId: string,
): Promise<FileBucket> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!requireAdmin(session.user)) {
    throw new Error("Only admins and superadmins can delete file buckets");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const bucket = await junoClient.file.deleteBucket(options, {
    userJwt: session.jwt,
    projectId: projectId,
  });
  return JSON.parse(JSON.stringify(bucket));
}
