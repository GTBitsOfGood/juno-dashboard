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
import { Separator } from "@/components/ui/separator";
import { getProjects, getUsers } from "@/lib/sdkActions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { toast } from "sonner";
import { UserColumn } from "../../../../components/usertable/columns";
import { UserDataTable } from "../../../../components/usertable/data-table";

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
    <div className="flex flex-col">
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
      <h2 className="text-lg font-semibold">Users</h2>
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
