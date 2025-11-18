"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ItemListCell } from "../item-list-cell";

export type FileBucketColumn = {
  name: string;
  configId: number;
  configEnv: string;
  providerName: string;
  fileNames: string[];
};

export const columns: ColumnDef<FileBucketColumn>[] = [
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
    header: "Bucket Name",
  },
  {
    accessorKey: "configId",
    header: "Config ID",
  },
  {
    accessorKey: "configEnv",
    header: "Config Env",
  },
  {
    accessorKey: "providerName",
    header: "Provider Name",
  },
  {
    accessorKey: "fileNames",
    header: "Files",
    cell: ({ row }) => (
      <ItemListCell
        itemNames={row.original.fileNames}
        badgeVariant="secondary"
      />
    ),
  },
];
