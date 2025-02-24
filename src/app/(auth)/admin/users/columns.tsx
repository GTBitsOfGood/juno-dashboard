"use client";

import SetUserTypeForm from "@/components/forms/SetUserTypeForm";
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

export type UserColumn = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  projects: string[];
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      // TODO: Add check all feature
      <Checkbox className="ms-2 align-middle mr-5" />
    ),
    cell: ({ row }) => {
      const project = row.original;

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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <DialogTrigger>Set user type</DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
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
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a new user for Juno.</DialogDescription>
            </DialogHeader>
            <SetUserTypeForm />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
