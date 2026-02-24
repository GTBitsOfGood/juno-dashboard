"use client";

import { PendingAccountRequests } from "@/components/admin/PendingAccountRequests";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProjects, getUsers } from "@/lib/sdkActions";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { UserColumn } from "../../../../components/usertable/columns";
import { toast } from "sonner";
import { UserDataTable } from "../../../../components/usertable/data-table";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function UsersPage() {
  const queryClient = useQueryClient();

  const {
    data: usersResult,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: projectsResult,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isUsersError) {
    toast.error("Error", {
      description: `Failed to fetch users: ${JSON.stringify(usersError)}`,
    });
  }

  if (isProjectsError) {
    toast.error("Error", {
      description: `Failed to fetch projects: ${JSON.stringify(projectsError)}`,
    });
  }

  const userData: UserColumn[] = usersResult?.users ?? [];
  const projectData: ProjectResponse[] = projectsResult?.projects ?? [];
  const isLoading = isUsersLoading || isProjectsLoading;

  const handleUserAction = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="container mx-auto">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PendingAccountRequests />
      <Separator className="my-8" />
      <h1>Users</h1>
      <UserDataTable
        data={userData}
        projectData={projectData.map((project) => ({
          name: project.name,
          id: project.id.toString(),
        }))}
        isLoading={isLoading}
        onUserAction={handleUserAction}
      />
    </div>
  );
}
