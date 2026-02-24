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
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useEffect, useState } from "react";
import { UserColumn } from "../../../../components/usertable/columns";
import { UserDataTable } from "../../../../components/usertable/data-table";

export default function UsersPage() {
  const [userData, setUserData] = useState<UserColumn[]>([]);
  const [projectData, setProjectData] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const [usersResult, projectsResult] = await Promise.all([
          getUsers(),
          getProjects(),
        ]);

        if (!usersResult.success) {
          console.error(`Failed to fetch users: ${usersResult.error}`);
        }
        if (!projectsResult.success) {
          console.error(`Failed to fetch projects: ${projectsResult.error}`);
        }

        setUserData(usersResult.users);
        setProjectData(projectsResult.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleUserAction = (
    user: UserColumn,
    action: "add" | "update" | "delete",
  ) => {
    if (action === "add") {
      setUserData((prevUsers) => [...prevUsers, user]);
    }

    if (action === "update") {
      setUserData((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u)),
      );
    }

    if (action === "delete") {
      setUserData((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    }
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
      <Separator className="mt-12 mb-8" />
      <h2 className="text-lg font-semibold">All Users</h2>
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
