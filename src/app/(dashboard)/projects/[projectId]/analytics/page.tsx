"use client";

import { AnalyticsConfigTable } from "@/components/analyticsConfigTable/analyticsConfig-table";
import { VisitEventsTable } from "@/components/analyticsEventsTable/visitEvents-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectById } from "@/lib/project";
import { getAnalyticsConfig } from "@/lib/settings";
import { useQuery } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/index";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ProjectAnalyticsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { isLoading, isError, data, error } = useQuery<ProjectResponse>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await getProjectById(Number(projectId));
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.project;
    },
  });

  const { data: analyticsConfig, isLoading: analyticsConfigLoading } = useQuery(
    {
      queryKey: ["analyticsConfig", projectId],
      queryFn: () => getAnalyticsConfig(projectId),
    },
  );

  useEffect(() => {
    if (isError && error) {
      toast.error("Error", {
        description: `Failed to fetch project: ${error.message}`,
      });
    }
  }, [isError, error]);

  const renderVisitEvents = () => {
    if (isLoading || analyticsConfigLoading) {
      return <Skeleton className="h-40 w-full" />;
    }

    if (!analyticsConfig || !data?.name) {
      return null;
    }

    return <VisitEventsTable projectId={projectId} projectName={data.name} />;
  };

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
              {isLoading ? "****" : (data?.name ?? "Unknown")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className="mb-8" />
      <div className="flex flex-col gap-8">
        <AnalyticsConfigTable projectId={projectId} />
        {renderVisitEvents()}
      </div>
    </div>
  );
};

export default ProjectAnalyticsPage;
