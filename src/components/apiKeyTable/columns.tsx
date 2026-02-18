"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

export type ApiKeyColumn = {
  id: number;
  description: string;
  dateCreated: string;
  linkedProject: string;
  environment: string;
};

export const apiKeyColumns = (
  onDelete: (apiKey: ApiKeyColumn) => void,
): ColumnDef<ApiKeyColumn>[] => {
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
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 300,
    },
    {
      accessorKey: "dateCreated",
      header: "Date Created",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.dateCreated}</Badge>
      ),
    },
    {
      accessorKey: "linkedProject",
      header: "Linked Project",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.linkedProject}</Badge>
      ),
    },
    {
      accessorKey: "environment",
      header: "Environment",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.environment}</Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
      size: 50,
    },
  ];
};
