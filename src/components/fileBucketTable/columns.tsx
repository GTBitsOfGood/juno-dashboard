"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Copy, File, Folder } from "lucide-react";
import { toast } from "sonner";

export type FileStatus = "NOT UPLOADED" | "UPLOADED" | "EXTERNAL";

export type FileDirectoryRow = {
  type: "bucket" | "file";
  name: string;
  configId?: number;
  configEnv?: string;
  providerName?: string;
  status?: FileStatus;
  subRows?: FileDirectoryRow[];
};

const statusStyles: Record<FileStatus, string> = {
  "NOT UPLOADED":
    "border-transparent bg-red-500 text-white hover:bg-red-500/80",
  UPLOADED:
    "border-transparent bg-green-500 text-white hover:bg-green-500/80",
  EXTERNAL:
    "border-transparent bg-yellow-500 text-black hover:bg-yellow-500/80",
};

export const columns: ColumnDef<FileDirectoryRow>[] = [
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
    id: "expand",
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={row.getToggleExpandedHandler()}
          className="p-0 h-6 w-6"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ) : null,
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div
        className={`flex items-center gap-2 ${row.original.type === "file" ? "pl-8" : ""}`}
      >
        {row.original.type === "bucket" ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "configId",
    header: "Config ID",
    cell: ({ row }) =>
      row.original.type === "bucket" ? row.original.configId : null,
  },
  {
    accessorKey: "configEnv",
    header: "Config Env",
    cell: ({ row }) =>
      row.original.type === "bucket" ? row.original.configEnv : null,
  },
  {
    accessorKey: "providerName",
    header: "Provider Name",
    cell: ({ row }) =>
      row.original.type === "bucket" ? row.original.providerName : null,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.type !== "file" || !row.original.status) return null;
      return (
        <Badge className={statusStyles[row.original.status]}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      if (row.original.type !== "file") return null;
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            navigator.clipboard.writeText(row.original.name);
            toast.success("Copied file name to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      );
    },
  },
];
