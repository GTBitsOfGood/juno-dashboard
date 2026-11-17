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
  domain: string;
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

// Only the fields the tables show. The street address, city and zip the
// gateway returns for a sender are left out so they never reach the browser.
export type SenderRow = {
  id: number;
  nickname: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  verified: boolean;
  locked: boolean;
};

export type DomainRow = {
  id: number;
  domain: string;
  subdomain?: string;
  valid: boolean;
};

export type SendersActionResult = EmailActionResult & { senders?: SenderRow[] };

export type DomainsActionResult = EmailActionResult & { domains?: DomainRow[] };

function toDnsRecord(record?: Partial<DnsRecord>): DnsRecord {
  return {
    valid: record?.valid ?? false,
    type: record?.type ?? "",
    host: record?.host ?? "",
    data: record?.data ?? "",
  };
}

function toDomainRegistration(
  res: RegisterDomainResponse,
  domain: string,
): DomainRegistration {
  return {
    domain,
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
      const text = await response.clone().text();
      try {
        const body = JSON.parse(text);
        if (Array.isArray(body?.message)) return body.message.join(", ");
        if (typeof body?.message === "string") return body.message;
      } catch {
        // Not JSON: the gateway sends errors from the backend services as
        // plain text.
        if (text.trim()) return text.trim();
      }
    } catch {
      // Body could not be read; fall through to the generic message.
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
      domain: toDomainRegistration(res, domain.trim()),
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

    const registration = toDomainRegistration(res, domain.trim());
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

export async function getJunoSenders(
  projectId: string,
): Promise<SendersActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      message: "You don't have access to this project",
    };
  }

  try {
    const juno = getJunoInstance();
    const res = await juno.email.getSenders({
      userJwt: session.jwt,
      projectId: Number(projectId),
    });

    return {
      success: true,
      message: "",
      senders: (res.senders ?? []).map((sender) => ({
        id: sender.id,
        nickname: sender.nickname,
        fromEmail: sender.fromEmail,
        fromName: sender.fromName,
        replyTo: sender.replyTo,
        verified: sender.verified,
        locked: sender.locked,
      })),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to load senders: ${await getErrorMessage(e)}`,
    };
  }
}

export async function getJunoDomains(
  projectId: string,
): Promise<DomainsActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      message: "You don't have access to this project",
    };
  }

  try {
    const juno = getJunoInstance();
    const res = await juno.email.getDomains({
      userJwt: session.jwt,
      projectId: Number(projectId),
    });

    return {
      success: true,
      message: "",
      domains: (res.domains ?? []).map((domain) => ({
        id: domain.id,
        domain: domain.domain,
        subdomain: domain.subdomain,
        // The list endpoints return `valid` as a real boolean (unlike
        // register/verify, which return the string "true" / "false").
        valid: domain.valid === true,
      })),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to load domains: ${await getErrorMessage(e)}`,
    };
  }
}
