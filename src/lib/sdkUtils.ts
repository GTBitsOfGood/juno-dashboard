"use server";

import { getJunoInstance } from "./juno";
import { EmailContent, EmailRecipient } from "juno-sdk/build/main/internal/api"; //Weird but maybe?
export async function setupJunoEmail(sendgridKey: string) {
  try {
    const juno = getJunoInstance();
    console.log("ATTEMPT to setup email");
    await juno.email.setupEmail({ sendgridKey });
    return { success: true, message: "Successfully set up email service!" };
  } catch (e) {
    console.error("ERROR", e);
    return {
      success: false,
      message: `Failed to setup email: ${e}`,
    };
  }
}

export async function registerJunoDomain(
  domain: string,
  subdomain: string | undefined
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
  country: string
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

export async function sendEmail({
  content,
  subject,
}: {
  subject: string;
  content: EmailContent[];
  bccRecipients?: EmailRecipient[];
  recipients?: EmailRecipient[];
  ccRecipients?: EmailRecipient[];
}) {
  const JUNO_SENDER_NAME = process.env.JUNO_SENDER_NAME as string;
  const JUNO_SENDER_EMAIL = process.env.JUNO_SENDER_EMAIL as string;
  console.log("Trying to send email..");
  try {
    const juno = getJunoInstance();
    await juno.email.sendEmail({
      recipients: [
        {
          email: "ankiththalanki2005@gmail.com",
          //name: "Ryder Johnson", //Will fail without name, but shouldn't
        },
      ],
      bcc: [],
      cc: [],
      sender: {
        email: JUNO_SENDER_EMAIL as string,
        name: JUNO_SENDER_NAME as string,
      },
      subject: subject,
      contents: content,
    });
    console.log("EMAIL SENT?");
  } catch (e) {
    console.log("ERRORFIX", e);
  }
}

export async function sendEmailNotification() {
  console.log("Attempting to send email...");
  await sendEmail({
    subject: "Daily Foster Update From Angels Among Us",
    content: [{ type: "text/html", value: "<html>Hello there</html>" }],
  });
}
