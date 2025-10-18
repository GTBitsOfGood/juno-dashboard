"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type FileConfig = {
  id: number;
  environment: string;
  bucketNames: string[];
};

export const columns: ColumnDef<FileConfig>[] = [
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
    accessorKey: "environment",
    header: "Environment",
  },
  {
    accessorKey: "bucketNames",
    header: "Buckets",
  },
  {
    accessorKey: "fileNames",
    header: "Files",
  },
];
