"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ItemListCell } from "./item-list-cell";

export type FileConfig = {
  id: number;
  environment: string;
  bucketNames: string[];
  fileNames: string[];
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
    size: 50,
  },
  {
    accessorKey: "environment",
    header: "Environment",
  },
  {
    accessorKey: "bucketNames",
    header: "Buckets",
    cell: ({ row }) => <ItemListCell itemNames={row.original.bucketNames} />,
  },
  {
    accessorKey: "fileNames",
    header: "Files",
    cell: ({ row }) => <ItemListCell itemNames={row.original.fileNames} />,
  },
];
