"use client";

import CreateAPIKeyForm from "@/components/forms/CreateAPIKeyForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { useState } from "react";
import { ApiKeyDataTable } from "@/components/apiKeyTable/apiKey-table";
import { ApiKeyColumn } from "@/components/apiKeyTable/columns";
import ApiKeyRevealCard from "@/components/forms/ApiKeyRevealForm";

const mockApiKeys: ApiKeyColumn[] = [
  {
    id: 1,
    description: "Email check-ins",
    dateCreated: "2026-01-31",
    linkedProject: "Juno Dashboard",
    environment: "SIT",
  },
  {
    id: 2,
    description: "Spreadsheet uploads to bucket storage",
    dateCreated: "N/A",
    linkedProject: "Hope for Haiti",
    environment: "SIT",
  },
  {
    id: 3,
    description: "Configuration management",
    dateCreated: "2026-01-31",
    linkedProject: "Juno Dashboard",
    environment: "SIT",
  },
  {
    id: 4,
    description: "Application Logging",
    dateCreated: "N/A",
    linkedProject: "Juno Dashboard",
    environment: "SIT",
  },
  {
    id: 5,
    description: "Application Logging",
    dateCreated: "2026-01-31",
    linkedProject: "Juno Dashboard",
    environment: "SIT",
  },
];

type CreatedKeyInfo = {
  value: string;
  description: string;
  environment: string;
  project: string;
  dateCreated: string;
};

export default function KeyPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyColumn[]>(mockApiKeys);
  const [createdKey, setCreatedKey] = useState<CreatedKeyInfo | null>(null);

  return (
    <div className="container mx-auto px-10 py-10 flex flex-col gap-[18px]">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>API Keys</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Top section: form (left) + reveal card (right) — always side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start w-100">
        <CreateAPIKeyForm
          onKeyAdd={(newKey) => {
            const dateCreated = new Date().toISOString().split("T")[0];
            const apiKeyRow: ApiKeyColumn = {
              id:
                apiKeys.length > 0
                  ? Math.max(...apiKeys.map((k) => k.id)) + 1
                  : 1,
              description: newKey.description,
              dateCreated,
              linkedProject: newKey.project.name ?? "",
              environment: newKey.environment,
            };
            setApiKeys((prev) => [apiKeyRow, ...prev]);
            setCreatedKey({
              value: newKey.value,
              description: newKey.description,
              environment: newKey.environment,
              project: newKey.project.name ?? "",
              dateCreated,
            });
            toast.success("Successfully created API key");
          }}
        />

        {/* Preview: reveal card with mock key data */}
        <ApiKeyRevealCard
          keyValue={createdKey != undefined ? createdKey.value : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItcGxhY2Vob2xkZXIiLCJpYXQiOjE3MDgzMjgwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}
          description="Email check-ins"
          environment="SIT"
          project="Juno Dashboard"
          dateCreated="2026-01-31"
        />
      </div>

      {/* Table card */}
      <ApiKeyDataTable
        data={apiKeys}
        isLoading={false}
        onKeyAction={(key, action) => {
          if (action === "delete") {
            setApiKeys((prev) => prev.filter((k) => k.id !== key.id));
          }
        }}
      />
    </div>
  );
}
