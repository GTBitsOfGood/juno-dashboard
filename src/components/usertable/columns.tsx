"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ColumnDef } from "@tanstack/react-table";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import { UserActionsCell } from "./user-actions-cell";
import { ProjectColumn } from "@/app/(dashboard)/admin/projects/columns";

export type UserColumn = {
  id: number;
  name: string;
  email: string;
  role: SetUserTypeModel.TypeEnum;
  projects: number[];
};

export const userColumns = (
  projectData: ProjectColumn[],
  onUserAction: (user: UserColumn, action: "add" | "update" | "delete") => void,
): ColumnDef<UserColumn>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="ms-2 align-middle mr-5"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="ms-2 align-middle"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 50,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 250,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.original.name} />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 300,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
    },
    {
      accessorKey: "projects",
      header: "Project",
      size: 200,
      cell: ({ row }) => {
        const ids = row.original.projects || [];
        if (ids.length === 0) return <Badge variant="secondary">None</Badge>;
        if (ids.length > 1) return <Badge variant="secondary">Multiple</Badge>;
        const name = projectData.find((p) => p.id === ids[0].toString())?.name;
        return <Badge variant="secondary">{name ?? ids[0]}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <UserActionsCell
          user={row.original}
          projectData={projectData}
          onUserUpdate={onUserAction}
        />
      ),
    },
  ];
};
