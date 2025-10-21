"use client";

import { EmailConfigTable } from "@/components/emailConfigTable/emailConfig-table";
import { FileConfigTable } from "@/components/fileConfigTable/fileConfig-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProjectById } from "@/lib/project";
import { useQuery } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const ProjectSettingsPage = () => {
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

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch project: ${JSON.stringify(error)}`,
    });
  }

  return (
    <div className="container mx-auto px-10 py-10 md:w-[85vw] sm:w-full">
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-8">
        <FileConfigTable projectId={projectId} />
        <EmailConfigTable projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
