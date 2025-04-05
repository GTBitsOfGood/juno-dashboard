"use client";

import { ProjectColumn, columns } from "./columns";
import { ProjectDataTable } from "./data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProjects } from "@/lib/sdkActions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [projectData, setProjectData] = useState<ProjectColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getProjects();

        if (!result.success) {
          console.error(`Failed to fetch projects: ${result.error}`);
          toast.error("Failed to fetch projects");
          return;
        }

        setProjectData(
          result.projects.map((project) => ({
            id: project.id.toString(),
            name: project.name,
          })),
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleProjectAction = (
    project: ProjectColumn,
    action: "add" | "update" | "delete",
  ) => {
    if (action === "add") {
      setProjectData((prevProjects) => [...prevProjects, project]);
    }

    if (action === "delete") {
      setProjectData((prevProjects) =>
        prevProjects.filter((p) => p.id !== project.id),
      );
    }
  };

  return (
    <div className="container mx-auto px-10 py-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1>Projects</h1>

      <ProjectDataTable<ProjectColumn, unknown>
        columns={columns(handleProjectAction)}
        data={projectData}
        loading={isLoading}
        onProjectAction={handleProjectAction}
      />
    </div>
  );
}
