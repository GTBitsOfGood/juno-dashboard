"use server";

import { getJunoInstance } from "./juno";

export async function setupJunoEmail(sendgridKey: string) {
  try {
    const juno = getJunoInstance();
    await juno.email.setupEmail({ sendgridKey });
    return { success: true, message: "Successfully set up email service!" };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to setup email: ${e}`,
    };
  }
}

export async function registerJunoDomain(
  domain: string,
  subdomain: string | undefined,
) {
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
