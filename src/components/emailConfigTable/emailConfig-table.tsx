"use client";

import { columns as emailConfigColumns } from "@/components/emailConfigTable/columns";
import { EmailConfigResponse } from "juno-sdk/build/main/internal/api";
import { BaseTable } from "../baseTable";

interface EmailConfigTableProps {
  emailConfig: EmailConfigResponse;
  isLoading: boolean;
}

export function EmailConfigTable({
  emailConfig,
  isLoading,
}: EmailConfigTableProps) {
  const emailConfigRowData = [emailConfig]
    .filter((config) => config)
    .map((config) => ({
      id: config.id.low,
      environment: config.environment,
      sendgridKey: config.sendgridKey,
      domainNames: config.domains?.map((domain) => domain.domain) ?? [],
      senderUsernames: config.senders?.map((sender) => sender.username) ?? [],
    }));
  return (
    <div className="flex flex-col gap-4">
      <h1>Email Configurations</h1>
      <BaseTable
        data={emailConfigRowData}
        columns={emailConfigColumns}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by environment...",
          filterColumn: "environment",
        }}
        onAddNewRow={() => console.log("Click")}
        onDeleteRow={() => console.log("Click")}
      />
    </div>
  );
}
