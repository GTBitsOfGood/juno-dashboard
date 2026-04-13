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
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLinks, setPaginationLinks] = useState({
    first: "",
    prev: "",
    next: "",
    last: "",
  });
  const [keysLoadTrigger, setKeysLoadTrigger] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      const result = await getProjects();
      if (result.success) {
        setProjectNames(
          Object.fromEntries(
            result.projects.map((p) => [String(p.id), String(p.name ?? "")]),
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
        const mapped: ApiKeyColumn[] = (result.keys ?? []).map((key) => ({
          id: Number(key.id),
          description: key.description ?? "",
          dateCreated: key.createdAt
            ? new Date(key.createdAt).toISOString().split("T")[0]
            : "N/A",
          linkedProject: projectNames[String(key.project)] ?? "Unknown",
          environment: key.environment ?? "N/A",
        }));
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
  }, [pageIndex, pageSize, projectNames]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys, keysLoadTrigger]);

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
            projects={Object.values(projectNames)}
            onKeyAdd={(newKey) => {
              setCreatedKey({
                value: newKey.value,
                description: newKey.description,
                environment: newKey.environment,
                project: newKey.project.name,
                dateCreated: new Date().toISOString().split("T")[0],
              });
              toast.success("Successfully created API key");
              setKeysLoadTrigger((t) => t + 1);
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
