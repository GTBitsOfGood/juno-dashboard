"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";

export type ApiKeyColumn = {
  id: number;
  description: string;
  dateCreated: string;
  linkedProject: string;
  environment: string;
};

const PROJECT_COLORS = [
  "bg-emerald-900",
  "bg-orange-900",
  "bg-sky-700",
  "bg-purple-700",
  "bg-rose-700",
  "bg-teal-700",
];

const projectColorMap = new Map<string, string>();

function getProjectColor(project: string): string {
  if (!projectColorMap.has(project)) {
    projectColorMap.set(
      project,
      PROJECT_COLORS[projectColorMap.size % PROJECT_COLORS.length],
    );
  }
  return projectColorMap.get(project)!;
}

export const apiKeyColumns = (
  onDelete: (apiKey: ApiKeyColumn) => void,
): ColumnDef<ApiKeyColumn>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="ms-2 align-middle mr-5 border-zinc-300 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="ms-2 align-middle border-zinc-300 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 50,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div className="flex justify-center">
          <span className="text-center">ID</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <div className="flex items-center">
          <span className="pl-4 text-left">Description</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="pl-4 text-left">{row.original.description}</div>
      ),
      size: 300,
    },
    {
      accessorKey: "dateCreated",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <span className="text-center">Date Created</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline">
            <span className="text-xs font-medium">
              {row.original.dateCreated}
            </span>
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "linkedProject",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <span className="text-center">Linked Project</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const project = row.original.linkedProject;
        const colorClass = getProjectColor(project);
        return (
          <div className="flex justify-center">
            <Badge variant="outline" className={`inline-flex ${colorClass}`}>
              {project}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "environment",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <span className="text-center">Environment</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline">{row.original.environment}</Badge>
        </div>
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
