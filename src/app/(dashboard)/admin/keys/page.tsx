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
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiKeyDataTable } from "@/components/apiKeyTable/apiKey-table";
import { ApiKeyColumn } from "@/components/apiKeyTable/columns";
import ApiKeyRevealCard from "@/components/forms/ApiKeyRevealForm";
import { getApiKeysAction, deleteApiKeyByIdAction } from "@/lib/actions";
import { getProjects } from "@/lib/sdkActions";

type CreatedKeyInfo = {
  value: string;
  description: string;
  environment: string;
  project: string;
  dateCreated: string;
};

export default function KeyPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createdKey, setCreatedKey] = useState<CreatedKeyInfo | null>(null);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLinks, setPaginationLinks] = useState({
    first: "",
    prev: "",
    next: "",
    last: "",
  });

  useEffect(() => {
    async function fetchProjects() {
      const result = await getProjects();
      if (result.success) {
        setProjectNames(
          result.projects.map(
            (p: Record<string, unknown>) => (p.name as string) ?? "",
          ),
        );
      }
    }
    fetchProjects();
  }, []);

  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getApiKeysAction({
        offset: pageIndex * pageSize,
        limit: pageSize,
      });
      if (result.success) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const mapped: ApiKeyColumn[] = (result.keys as any[]).map(
          (key: Record<string, any>) => ({
            id: Number(key.id),
            description: (key.description as string) ?? "",
            dateCreated: key.createdAt
              ? new Date(key.createdAt as string).toISOString().split("T")[0]
              : "N/A",
            linkedProject:
              typeof key.project === "object" && key.project !== null
                ? (key.project.name as string)
                : "Unknown",
            environment: (key.environment as string) ?? "N/A",
          }),
        );
        setApiKeys(mapped);
        setPaginationLinks(result.links);
      } else {
        toast.error(result.error ?? "Failed to fetch API keys");
      }
    } catch {
      toast.error("Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleDelete = async (key: ApiKeyColumn) => {
    const result = await deleteApiKeyByIdAction(String(key.id));
    if (result.success) {
      setApiKeys((prev) => prev.filter((k) => k.id !== key.id));
      toast.success("API key deleted successfully.");
    } else {
      toast.error(result.error ?? "Failed to delete API key");
    }
  };

  return (
    <div className="flex flex-col gap-[18px]">
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
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <CreateAPIKeyForm
            projects={projectNames}
            onKeyAdd={(newKey) => {
              setCreatedKey({
                value: newKey.value,
                description: newKey.description,
                environment: newKey.environment,
                project: newKey.project.name,
                dateCreated: new Date().toISOString().split("T")[0],
              });
              toast.success("Successfully created API key");
              fetchApiKeys();
            }}
          />

          <ApiKeyRevealCard
            keyValue={createdKey?.value ?? null}
            description={createdKey?.description ?? ""}
            environment={createdKey?.environment ?? ""}
            project={createdKey?.project ?? ""}
            dateCreated={createdKey?.dateCreated ?? ""}
          />
        </div>

        <ApiKeyDataTable
          data={apiKeys}
          isLoading={isLoading}
          pageIndex={pageIndex}
          pageSize={pageSize}
          paginationLinks={paginationLinks}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
          onKeyAction={async (key, action) => {
            if (action === "delete") {
              await handleDelete(key);
            }
          }}
        />
      </div>
    </div>
  );
}
