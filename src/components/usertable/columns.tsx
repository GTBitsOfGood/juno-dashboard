"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import { ProjectColumn } from "../../app/(auth)/admin/projects/columns";
import { UserActionsCell } from "./user-actions-cell";

export type UserColumn = {
  id: number;
  name: string;
  email: string;
  role: SetUserTypeModel.TypeEnum;
  projects: number[];
};

export const userColumns = (
  projectData: ProjectColumn[],
  onUserAction?: (user: UserColumn, action: "add" | "update" | "delete") => void
): ColumnDef<UserColumn>[] => {
  return [
    {
      id: "select",
      header: () => (
        // TODO: Add check all feature
        <Checkbox className="ms-2 align-middle mr-5" />
      ),
      cell: () => {
        // TODO: Add selection logic
        return <Checkbox className="ms-2 align-middle" />;
      },
      size: 50,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 400,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 400,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge>{row.original.role}</Badge>,
    },
    {
      accessorKey: "projects",
      header: "Projects",
      size: 500,
      cell: ({ row }) => {
        const projects = row.original.projects || [];
        return projects.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {projects.map((projectId) => (
              <Badge key={projectId} variant="secondary">
                {projectId}
              </Badge>
            ))}
          </div>
        ) : (
          <Badge variant="secondary">None</Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <UserActionsCell
            user={user}
            projectData={projectData}
            onUserUpdate={onUserAction}
          />
        );
      },
    },
  ];
};
