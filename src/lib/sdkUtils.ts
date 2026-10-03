"use server";

import type { RegisterDomainResponse } from "juno-sdk/build/main/internal/index";
import { getJunoInstance } from "./juno";
import { getSession } from "./session";
import { hasProjectAccess, requireAdmin } from "./auth";

export type DnsRecord = {
  valid: boolean;
  type: string;
  host: string;
  data: string;
};

export type DomainRegistration = {
  id: number;
  valid: boolean;
  records: {
    mailCname: DnsRecord;
    dkim1: DnsRecord;
    dkim2: DnsRecord;
  };
};

export type SenderAddressInput = {
  email: string;
  name: string;
  replyTo?: string;
  nickname?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type EmailActionResult = { success: boolean; message: string };

export type DomainActionResult = EmailActionResult & {
  domain?: DomainRegistration;
};

function toDnsRecord(record?: Partial<DnsRecord>): DnsRecord {
  return {
    valid: record?.valid ?? false,
    type: record?.type ?? "",
    host: record?.host ?? "",
    data: record?.data ?? "",
  };
}

function toDomainRegistration(res: RegisterDomainResponse): DomainRegistration {
  return {
    id: res.id,
    // The gateway returns `valid` as the string "true" / "false".
    valid: String(res.valid) === "true",
    records: {
      mailCname: toDnsRecord(res.records?.mailCname),
      dkim1: toDnsRecord(res.records?.dkim1),
      dkim2: toDnsRecord(res.records?.dkim2),
    },
  };
}

/** Pulls the gateway's error message out of an SDK error when possible. */
async function getErrorMessage(e: unknown): Promise<string> {
  const response = (e as { response?: Response } | null)?.response;
  if (response && typeof response.clone === "function") {
    try {
      const body = await response.clone().json();
      if (Array.isArray(body?.message)) return body.message.join(", ");
      if (typeof body?.message === "string") return body.message;
    } catch {
      // Body was not JSON; fall through to the generic message.
    }
  }
  return e instanceof Error ? e.message : String(e);
}

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

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      message: "You don't have access to this project",
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
  projectId: string,
  domain: string,
  subdomain?: string,
): Promise<DomainActionResult> {
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

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      message: "You don't have access to this project",
    };
  }

  try {
    const juno = getJunoInstance();
    const res = await juno.email.registerDomain(
      { domain: domain.trim(), subdomain: subdomain?.trim() || undefined },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      },
    );

    return {
      success: true,
      message:
        "Domain registered! Add the DNS records below at your DNS provider, then verify.",
      domain: toDomainRegistration(res),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to register domain: ${await getErrorMessage(e)}`,
    };
  }
}

export async function verifyJunoDomain(
  projectId: string,
  domain: string,
): Promise<DomainActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!requireAdmin(session.user)) {
    return {
      success: false,
      message: "Only admins and superadmins can verify domains",
    };
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      message: "You don't have access to this project",
    };
  }

  try {
    const juno = getJunoInstance();
    const res = await juno.email.verifyDomain(
      { domain: domain.trim() },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      },
    );

    const registration = toDomainRegistration(res);
    return {
      success: true,
      message: registration.valid
        ? "Domain verified!"
        : "Domain not verified yet. Make sure the DNS records below are added, then try again (DNS changes can take a while).",
      domain: registration,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to verify domain: ${await getErrorMessage(e)}`,
    };
  }
}

export async function registerJunoSenderAddress(
  projectId: string,
  sender: SenderAddressInput,
): Promise<EmailActionResult> {
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

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      message: "You don't have access to this project",
    };
  }

  try {
    const juno = getJunoInstance();
    const res = await juno.email.registerSenderAddress(
      {
        email: sender.email,
        name: sender.name,
        replyTo: sender.replyTo || undefined,
        nickname: sender.nickname || sender.name,
        address: sender.address,
        city: sender.city,
        state: sender.state,
        zip: sender.zip,
        country: sender.country,
      },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      },
    );
    return {
      success: true,
      message: `Successfully registered sender ${res.email}!`,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to register sender: ${await getErrorMessage(e)}`,
    };
  }
}
