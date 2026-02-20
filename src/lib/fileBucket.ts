"use server";

import {
  DeleteFileBucketModel,
  FileBucket,
} from "juno-sdk/build/main/internal/index";
import { hasProjectAccess } from "./auth";
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
    if (e.response?.statusCode === 404) {
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

export async function deleteBucket(
  options: DeleteFileBucketModel,
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
  const bucket = await junoClient.file.deleteBucket(options, {
    userJwt: session.jwt,
    projectId: projectId,
  });
  return JSON.parse(JSON.stringify(bucket));
}
