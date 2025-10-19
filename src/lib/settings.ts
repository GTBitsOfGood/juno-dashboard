"use server";

import { getJunoInstance } from "./juno";
import { getSession } from "./session";

export async function getFileConfig(projectId: string) {
  const junoClient = getJunoInstance();
  try {
    const fileConfig = await junoClient.settings.getFileConfig(projectId);
    return {
      success: true,
      fileConfig: JSON.parse(JSON.stringify(fileConfig)),
    };
  } catch (error) {
    console.error("Error fetching file config:", error);
    return {
      success: false,
      error: "Failed to fetch file config from project",
    };
  }
}

export async function getEmailConfig(projectId: string) {
  const junoClient = getJunoInstance();
  try {
    const emailConfig = await junoClient.settings.getEmailConfig(projectId);
    return {
      success: true,
      emailConfig: JSON.parse(JSON.stringify(emailConfig)),
    };
  } catch (error) {
    console.error("Error fetching email config:", error);
    return {
      success: false,
      error: "Failed to fetch email config from project",
    };
  }
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
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "No active session found",
      };
    }

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
