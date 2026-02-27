"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { UserColumn } from "@/components/usertable/columns";
import { UserDataTable } from "@/components/usertable/data-table";
import { getProjectUsers } from "@/lib/actions";
import { getProjects } from "@/lib/sdkActions";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectUsersPage() {
  const { projectId } = useParams();
  const [users, setUsers] = useState<UserColumn[]>([]);
  const [projectData, setProjectData] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResult, projectsResult] = await Promise.all([
          getProjectUsers(projectId as string),
          getProjects(),
        ]);

        if (usersResult.success) {
          setUsers(usersResult.users);
        } else {
          console.error(usersResult.error);
        }

        if (projectsResult.success) {
          setProjectData(projectsResult.projects);
        } else {
          toast.error("Error", {
            description: `Failed to fetch projects: ${projectsResult.error}`,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const handleUserAction = (
    user: UserColumn,
    action: "add" | "update" | "delete",
  ) => {
    if (action === "add") {
      setUsers((prevUsers) => [...prevUsers, user]);
    }

    if (action === "update") {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u)),
      );
    }

    if (action === "delete") {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    }
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
              {
                projectData.find(
                  (project) => project.id == (projectId as unknown),
                )?.name
              }
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className="mb-8" />
      <h1 className="text-lg font-bold">Project Users</h1>
      <UserDataTable
        data={users}
        projectData={projectData.map((project) => ({
          name: project.name,
          id: project.id.toString(),
        }))}
        isLoading={loading}
        onUserAction={handleUserAction}
      />
    </div>
  );
}
