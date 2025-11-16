"use server";

import { getJunoInstance } from "./juno";
import { getSession } from "./session";
import { requireAdmin } from "./auth";

export async function setupJunoEmail(sendgridKey: string, projectId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      message: "Only admins and superadmins can set up email service",
    };
  }

  try {
    const juno = getJunoInstance();
    await juno.email.setupEmail(
      { sendgridKey },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      },
    );
    return { success: true, message: "Successfully set up email service!" };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `${e}`,
    };
  }
}

export async function registerJunoDomain(
  domain: string,
  subdomain: string | undefined,
) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      message: "Only admins and superadmins can register domains",
    };
  }

  try {
    const juno = getJunoInstance();
    await juno.email.registerDomain({ domain, subdomain });

    return { success: true, message: "Successfully registered domain!" };
  } catch (e) {
    console.error(e);
    return { success: false, message: `Failed to register domain: ${e}` };
  }
}

export async function registerJunoSenderAddress(
  email: string,
  name: string,
  replyTo: string | undefined,
  nickname: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  country: string,
) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      message: "Only admins and superadmins can register sender addresses",
    };
  }

  try {
    const juno = getJunoInstance();
    await juno.email.registerSenderAddress({
      email,
      name,
      replyTo,
      nickname,
      address,
      city,
      state,
      zip,
      country,
    });
    return { success: true, message: "Successfully registered sender!" };
  } catch (e) {
    console.error(e);
    return { success: false, message: `Failed to register sender: ${e}` };
  }
}
