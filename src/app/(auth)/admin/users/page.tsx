"use client";

import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { UserColumn } from "../../../../components/usertable/columns";
import { UserDataTable } from "../../../../components/usertable/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { getUsers, getProjects } from "@/lib/sdkActions";

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
    action: "add" | "update" | "delete"
  ) => {
    if (action === "add") {
      setUserData((prevUsers) => [...prevUsers, user]);
    }

    if (action === "update") {
      setUserData((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u))
      );
    }

    if (action === "delete") {
      setUserData((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
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
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
