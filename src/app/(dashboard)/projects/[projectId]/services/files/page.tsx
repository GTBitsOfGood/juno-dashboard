"use client";

import { FileBucketTable } from "@/components/fileBucketTable/fileBucketTable";
import { FileProviderTable } from "@/components/fileProviderTable/fileProviderTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { getProjectById } from "@/lib/project";
import { getFileConfig } from "@/lib/settings";
import { useQuery } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProjectId {
  low: number;
}

const FileServicePage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    isError: isProjectError,
    data: project,
    error: projectError,
  } = useQuery<ProjectResponse>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await getProjectById(Number(projectId));
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.project;
    },
  });

  const {
    isError: isConfigError,
    data: config,
    error: configError,
  } = useQuery({
    queryKey: ["fileConfig", projectId],
    queryFn: async () => await getFileConfig(projectId),
  });

  const configId = config?.id
    ? (config.id as unknown as ProjectId).low
    : undefined;

  useEffect(() => {
    if (isProjectError) {
      toast.error("Error", {
        description: `Failed to fetch project: ${JSON.stringify(projectError)}`,
      });
    }

    if (isConfigError) {
      toast.error("Error", {
        description: `Failed to fetch file config: ${JSON.stringify(configError)}`,
      });
    }
  }, [isProjectError, isConfigError, projectError, configError]);

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
              {project?.name ?? "Unknown"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Files</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className="mb-8" />
      <div className="flex flex-col gap-8">
        <FileProviderTable projectId={projectId} />
        <FileBucketTable projectId={projectId} configId={configId} />
      </div>
    </div>
  );
};

export default FileServicePage;
