"use client";

import EditUserForm from "@/components/forms/EditUserForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import { MoreHorizontal } from "lucide-react";
import { ProjectColumn } from "../../app/(auth)/admin/projects/columns";
import Link from "next/link";

export type UserColumn = {
  id: number;
  name: string;
  email: string;
  role: SetUserTypeModel.TypeEnum;
  projects: number[];
};

export const userColumns = (
  projectData: ProjectColumn[],
  onUserUpdate?: (unknown) => void,
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
              <Link
                href={`/projects/${projectId}`}
                key={projectId}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="secondary">{projectId}</Badge>
              </Link>
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
          <Dialog modal={false}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <DialogTrigger>Set user type</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(user.id.toString())
                  }
                >
                  Copy user ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.name)}
                >
                  Copy user name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.email)}
                >
                  Copy user email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set user type</DialogTitle>
                <DialogDescription>
                  Change the user type of an existing user.
                </DialogDescription>
              </DialogHeader>
              <EditUserForm
                initialUserData={user}
                projectData={projectData}
                onUserUpdate={onUserUpdate}
              />
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];
};
