"use client";

import { FileBucketTable } from "@/components/fileBucketTable/fileBucketTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectById } from "@/lib/project";
import { getFileConfig } from "@/lib/settings";
import { useQuery } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const FileServicePage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    isLoading: isProjectLoading,
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
    isLoading: isConfigLoading,
    isError: isConfigError,
    data: config,
    error: configError,
  } = useQuery({
    queryKey: ["fileConfig", projectId],
    queryFn: async () => await getFileConfig(projectId),
  });

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

  const isLoading = isProjectLoading || isConfigLoading;

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="mx-10 my-10 h-4 w-60 rounded-xl" />
          <Skeleton className="mx-10 mb-2 h-4 w-60 rounded-xl" />
          <Skeleton className="mx-10 mb-8 h-20 w-[450px] rounded-xl" />
          <Skeleton className="mx-10 mb-2 h-4 w-60 rounded-xl" />
          <Skeleton className="mx-10 mb-8 h-20 w-[450px] rounded-xl" />
        </div>
      ) : (
        <div className="container mx-auto px-10 py-10 md:w-[85vw] sm:w-full">
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

          <div className="flex flex-col gap-8">
            <FileBucketTable projectId={projectId} configId={config?.id?.low} />
          </div>
        </div>
      )}
    </>
  );
};

export default FileServicePage;
