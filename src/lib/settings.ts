"use server";

import {
  AnalyticsConfigResponse,
  CreateAnalyticsConfigModel,
  EmailConfigResponse,
  FileConfigResponse,
  UpdateAnalyticsConfigModel,
} from "juno-sdk/build/main/internal/api";
import { getJunoInstance } from "./juno";
import { getSession } from "./session";
import { hasProjectAccess, requireAdmin } from "./auth";

export async function getFileConfig(
  projectId: string,
): Promise<FileConfigResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();

  try {
    const fileConfig = await junoClient.settings.getFileConfig(projectId);

    return JSON.parse(JSON.stringify(fileConfig));
  } catch (e: any) {
    if (e.response?.statusCode === 404) {
      return null;
    }

    throw e;
  }
}

export async function getEmailConfig(
  projectId: string,
): Promise<EmailConfigResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();

  try {
    const emailConfig = await junoClient.settings.getEmailConfig(projectId);

    return JSON.parse(JSON.stringify(emailConfig));
  } catch (e: any) {
    if (e.response?.statusCode === 404) {
      return null;
    }

    throw e;
  }
}

export async function getAnalyticsConfig(
  projectId: string,
): Promise<AnalyticsConfigResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  try {
    const analyticsConfig =
      await junoClient.analyticsConfig.getAnalyticsConfig(projectId, {
        userJwt: session.jwt,
        projectId: projectId,
      });
    return JSON.parse(JSON.stringify(analyticsConfig));
  } catch (e: any) {
    if (e.response?.statusCode === 404) {
      return null;
    }
    throw e;
  }
}

export async function deleteAnalyticsConfig(
  projectId: string,
): Promise<AnalyticsConfigResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const analyticsConfig =
    await junoClient.analyticsConfig.deleteAnalyticsConfig(projectId);
  return JSON.parse(JSON.stringify(analyticsConfig));
}

export async function updateAnalyticsConfig(
  projectId: number,
  config: UpdateAnalyticsConfigModel,
): Promise<AnalyticsConfigResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!hasProjectAccess(session.user, projectId)) {
    throw new Error("You don't have access to this project");
  }

  const junoClient = getJunoInstance();
  const analyticsConfig =
    await junoClient.analyticsConfig.updateAnalyticsConfig(
      projectId.toString(),
      config,
    );
  return JSON.parse(JSON.stringify(analyticsConfig));
}

export async function createAnalyticsConfig(
  projectId: string,
  keys: {
    serverAnalyticsKey: string;
    clientAnalyticsKey: string;
  },
): Promise<AnalyticsConfigResponse> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const config: CreateAnalyticsConfigModel = {
    serverAnalyticsKey: keys.serverAnalyticsKey,
    clientAnalyticsKey: keys.clientAnalyticsKey,
  };

  const junoClient = getJunoInstance();
  const analyticsConfig =
    await junoClient.analyticsConfig.createAnalyticsConfig(config, {
      userJwt: session.jwt,
      projectId: Number(projectId),
    });
  return JSON.parse(JSON.stringify(analyticsConfig));
}

export async function getEmailAnalytics(
  projectId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
    aggregatedBy?: "day" | "week" | "month";
  },
) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  if (!hasProjectAccess(session.user, Number(projectId))) {
    return {
      success: false,
      error: "You don't have access to this project",
    };
  }

  const junoClient = getJunoInstance();
  try {
    const apiKey = process.env.JUNO_API_KEY;
    if (!apiKey) {
      console.error("Error fetching email analytics: missing JUNO_API_KEY");
      return {
        success: false,
        error: "Email analytics is not configured for this environment",
      };
    }

    const emailConfig = await junoClient.settings.getEmailConfig(projectId, {
      userJwt: session.jwt,
      projectId: projectId,
    });
    if (!emailConfig) {
      return {
        success: false,
        error: "No email configuration found for this project",
      };
    }

    const analytics = await junoClient.email.getStatistics(
      {
        startDate:
          options?.startDate ||
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        endDate: options?.endDate || new Date().toISOString().split("T")[0],
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        aggregatedBy: options?.aggregatedBy || "day",
      },
      {
        userJwt: session.jwt,
        projectId: projectId,
      }
    );

    return {
      success: true,
      analytics: JSON.parse(JSON.stringify(analytics.responses || [])),
    };
  } catch (error) {
    console.error("Error fetching email analytics:", error);
    return {
      success: false,
      error: "Failed to fetch email analytics from project",
    };
  }
}

export async function getAllClickEvents(
  projectName: string,
  projectId: string,
  options?: {
    afterTime?: string;
    limit?: number;
  },
) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      events: [],
    };
  }

  const junoClient = getJunoInstance();
  try {
    const events = await junoClient.analytics.getAllClickEvents(
      {
        projectName,
        afterTime: options?.afterTime,
        limit: options?.limit,
      },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      }
    );
    return {
      success: true,
      events: JSON.parse(JSON.stringify(events)),
    };
  } catch (error) {
    console.error("Error fetching click events:", error);
    return {
      success: false,
      error: "Failed to fetch click events",
      events: [],
    };
  }
}

export async function getAllInputEvents(
  projectName: string,
  projectId: string,
  options?: {
    afterTime?: string;
    limit?: number;
  },
) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      events: [],
    };
  }

  const junoClient = getJunoInstance();
  try {
    const events = await junoClient.analytics.getAllInputEvents(
      {
        projectName,
        afterTime: options?.afterTime,
        limit: options?.limit,
      },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      }
    );
    return {
      success: true,
      events: JSON.parse(JSON.stringify(events)),
    };
  } catch (error) {
    console.error("Error fetching input events:", error);
    return {
      success: false,
      error: "Failed to fetch input events",
      events: [],
    };
  }
}

export async function getAllVisitEvents(
  projectName: string,
  projectId: string,
  options?: {
    afterTime?: string;
    limit?: number;
  },
) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      events: [],
    };
  }

  const junoClient = getJunoInstance();
  try {
    const events = await junoClient.analytics.getAllVisitEvents(
      {
        projectName,
        afterTime: options?.afterTime,
        limit: options?.limit,
      },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      }
    );
    return {
      success: true,
      events: JSON.parse(JSON.stringify(events)),
    };
  } catch (error) {
    console.error("Error fetching visit events:", error);
    return {
      success: false,
      error: "Failed to fetch visit events",
      events: [],
    };
  }
}

export async function getCustomEventTypes(projectName: string, projectId: string) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      eventTypes: [],
    };
  }

  const junoClient = getJunoInstance();
  try {
    const eventTypes =
      await junoClient.analytics.getCustomEventTypesByProject(projectName, {
        userJwt: session.jwt,
        projectId: Number(projectId),
      });

    return {
      success: true,
      eventTypes: JSON.parse(JSON.stringify(eventTypes.eventTypes)),
    };
  } catch (error) {
    console.error("Error fetching custom event types:", error);
    return {
      success: false,
      error: "Failed to fetch custom event types",
      eventTypes: [],
    };
  }
}

export async function getAllCustomEvents(
  projectName: string,
  projectId: string,
  category: string,
  subcategory: string,
  options?: {
    afterTime?: string;
    limit?: number;
  },
) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
      events: [],
    };
  }

  const junoClient = getJunoInstance();
  try {
    const events = await junoClient.analytics.getAllCustomEvents(
      {
        projectName,
        category,
        subcategory,
        afterTime: options?.afterTime,
        limit: options?.limit,
      },
      {
        userJwt: session.jwt,
        projectId: Number(projectId),
      }
    );
    return {
      success: true,
      events: JSON.parse(JSON.stringify(events)),
    };
  } catch (error) {
    console.error("Error fetching custom events:", error);
    return {
      success: false,
      error: "Failed to fetch custom events",
      events: [],
    };
  }
}
