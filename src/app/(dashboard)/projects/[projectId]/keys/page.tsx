// src/app/(dashboard)/projects/[projectId]/keys/page.tsx
"use client";

import CreateAPIKeyForm from "@/components/forms/CreateAPIKeyForm";
import ApiKeyRevealCard from "@/components/forms/ApiKeyRevealForm";
import { ApiKeyDataTable } from "@/components/apiKeyTable/apiKey-table";
import { ApiKeyColumn } from "@/components/apiKeyTable/columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { getApiKeysAction, deleteApiKeyByIdAction } from "@/lib/actions";
import { getProjectById } from "@/lib/project";
import {
  UserType,
  useUserSession,
} from "@/components/providers/SessionProvider";
import { useQuery } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/index";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type CreatedKeyInfo = {
  value: string;
  description: string;
  environment: string;
  project: string;
  dateCreated: string;
};

const PAGE_SIZE = 100;
const MAX_PAGES = 50; // safety cap against a misbehaving `links.next`

export default function ProjectKeysPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useUserSession();

  const { isLoading: projectLoading, data: project } =
    useQuery<ProjectResponse>({
      queryKey: ["project", projectId],
      queryFn: async () => {
        const result = await getProjectById(Number(projectId));
        if (!result.success) throw new Error(result.error);
        return result.project;
      },
    });

  const [apiKeys, setApiKeys] = useState<ApiKeyColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [possiblyIncomplete, setPossiblyIncomplete] = useState(false);
  const [createdKey, setCreatedKey] = useState<CreatedKeyInfo | null>(null);
  const [keysLoadTrigger, setKeysLoadTrigger] = useState(0);

  const requestIdRef = useRef(0);

  const fetchProjectKeys = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setLoadError(null);
    setPossiblyIncomplete(false);
    try {
      const all: ApiKeyColumn[] = [];
      let offset = 0;
      let sawFailure = false;
      let hitCap = true; // assume the cap was hit unless the loop breaks naturally

      for (let i = 0; i < MAX_PAGES; i++) {
        const result = await getApiKeysAction({ offset, limit: PAGE_SIZE });

        if (requestId !== requestIdRef.current) return; // a newer fetch superseded this one

        if (!result.success) {
          setLoadError(result.error ?? "Failed to fetch API keys");
          sawFailure = true;
          hitCap = false;
          break;
        }

        const page = result.keys ?? [];
        for (const key of page) {
          if (String(key.project) === String(projectId)) {
            all.push({
              id: Number(key.id),
              description: key.description ?? "",
              dateCreated: key.createdAt
                ? new Date(key.createdAt).toISOString().split("T")[0]
                : "N/A",
              linkedProject: project?.name ?? "",
              environment: key.environment ?? "N/A",
            });
          }
        }

        if (!result.links?.next || page.length < PAGE_SIZE) {
          hitCap = false; // exhausted normally, not cut off
          break;
        }
        offset += PAGE_SIZE;
      }

      if (requestId !== requestIdRef.current) return; // check again before committing

      if (!sawFailure) {
        setApiKeys(all);
        setPossiblyIncomplete(hitCap);
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setLoadError("Failed to fetch API keys");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, project?.name]);

  useEffect(() => {
    if (!projectLoading) fetchProjectKeys();
  }, [fetchProjectKeys, projectLoading, keysLoadTrigger]);

  const handleDelete = async (key: ApiKeyColumn) => {
    const result = await deleteApiKeyByIdAction(String(key.id));
    if (result.success) {
      setApiKeys((prev) => prev.filter((k) => k.id !== key.id));
      toast.success("API key deleted successfully.");
    } else {
      toast.error(result.error ?? "Failed to delete API key");
    }
  };

  const canCreate = user && user.type !== UserType.USER;
  const emptyLinks = { first: "", prev: "", next: "", last: "" };

  return (
    <div className="flex flex-col">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>
              {projectLoading ? "****" : (project?.name ?? "Unknown")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>API Keys</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className="mb-8" />

      <div className="flex flex-col gap-8">
        {loadError && <p className="text-sm text-red-400">{loadError}</p>}

        {possiblyIncomplete && (
          <p className="text-sm text-yellow-500">
            There may be more keys than shown — this project&apos;s list could
            not be fully loaded. Contact an admin if you expect to see
            additional keys.
          </p>
        )}

        {canCreate ? (
          !projectLoading &&
          project && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
              <CreateAPIKeyForm
                lockedProjectName={project.name}
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
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            Only admins can create API keys for this project.
          </p>
        )}

        <ApiKeyDataTable
          data={apiKeys}
          isLoading={isLoading}
          pageIndex={0}
          pageSize={apiKeys.length || 10}
          paginationLinks={emptyLinks}
          onPageIndexChange={() => {}}
          onPageSizeChange={() => {}}
          hideProjectColumn
          hidePagination
          onKeyAction={async (key, action) => {
            if (action === "delete") await handleDelete(key);
          }}
        />
      </div>
    </div>
  );
}
