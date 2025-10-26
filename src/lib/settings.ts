"use server";

import {
  AnalyticsConfigResponse,
  CreateAnalyticsConfigModel,
  EmailConfigResponse,
  FileConfigResponse,
  UpdateAnalyticsConfigModel,
} from "juno-sdk/build/main/internal/api";
import { getJunoInstance } from "./juno";

export async function getFileConfig(
  projectId: string
): Promise<FileConfigResponse> {
  const junoClient = getJunoInstance();
  const fileConfig = await junoClient.settings.getFileConfig(projectId);
  return JSON.parse(JSON.stringify(fileConfig));
}

export async function getEmailConfig(
  projectId: string
): Promise<EmailConfigResponse> {
  const junoClient = getJunoInstance();
  const emailConfig = await junoClient.settings.getEmailConfig(projectId);
  return JSON.parse(JSON.stringify(emailConfig));
}

export async function getAnalyticsConfig(
  projectId: string
): Promise<AnalyticsConfigResponse> {
  const junoClient = getJunoInstance();
  try {
  const analyticsConfig =
    await junoClient.analyticsConfig.getAnalyticsConfig(projectId);
  return JSON.parse(JSON.stringify(analyticsConfig));
} catch (e) {
    if (e?.body.toLowerCase().includes("not_found")) {
      throw new Error("Analytics Config does not exist");
    }
    throw e;
  }
}

export async function deleteAnalyticsConfig(
  projectId: string
): Promise<AnalyticsConfigResponse> {
  const junoClient = getJunoInstance();
  const analyticsConfig =
    await junoClient.analyticsConfig.deleteAnalyticsConfig(projectId);
  return JSON.parse(JSON.stringify(analyticsConfig));
}

export async function updateAnalyticsConfig(
  projectId: string,
  config: UpdateAnalyticsConfigModel
): Promise<AnalyticsConfigResponse> {
  const junoClient = getJunoInstance();
  const analyticsConfig =
    await junoClient.analyticsConfig.updateAnalyticsConfig(projectId, config);
  return JSON.parse(JSON.stringify(analyticsConfig));
}

export async function createAnalyticsConfig(
  config: CreateAnalyticsConfigModel
): Promise<AnalyticsConfigResponse> {
  const junoClient = getJunoInstance();
  const analyticsConfig =
    await junoClient.analyticsConfig.createAnalyticsConfig(config);
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
  }
) {
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

    const emailConfig = await junoClient.settings.getEmailConfig(projectId);
    if (!emailConfig) {
      return {
        success: false,
        error: "No email configuration found for this project",
      };
    }

    const response = await fetch(
      `${process.env.JUNO_BASE_URL || "http://localhost:8888"}/email/analytics?${new URLSearchParams(
        {
          startDate:
            options?.startDate ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0], // Default to 30 days ago
          endDate: options?.endDate || new Date().toISOString().split("T")[0], // Default to today
          limit: String(options?.limit || 100),
          offset: String(options?.offset || 0),
          aggregatedBy: options?.aggregatedBy || "day",
        }
      )}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      analytics: data.responses || [],
    };
  } catch (error) {
    console.error("Error fetching email analytics:", error);
    return {
      success: false,
      error: "Failed to fetch email analytics from project",
    };
  }
}
