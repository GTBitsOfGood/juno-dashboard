"use client";

import { columns as emailConfigColumns } from "@/components/emailConfigTable/columns";
import { getEmailConfig } from "@/lib/settings";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";

interface EmailConfigTableProps {
  projectId: string;
}

export function EmailConfigTable({ projectId }: EmailConfigTableProps) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["emailConfig", projectId],
    queryFn: () => getEmailConfig(projectId),
  });

  const emailConfigRowData = [data]
    .filter((config) => config)
    .map((config) => ({
      id: config.id.low,
      environment: config.environment,
      sendgridKey: config.sendgridKey,
      domainNames: config.domains?.map((domain) => domain.domain) ?? [],
      senderUsernames: config.senders?.map((sender) => sender.username) ?? [],
    }));

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch email config: ${JSON.stringify(error)}`,
    });
  }
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
