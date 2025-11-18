"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type FileProviderColumn = {
  publicAccessKey: string;
  privateAccessKey: string;
  baseUrl: string;
  providerName: string;
  type: string;
};

export const columns: ColumnDef<FileProviderColumn>[] = [
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
    accessorKey: "providerName",
    header: "Provider Name",
  },
  {
    accessorKey: "baseUrl",
    header: "Base Url",
  },
  {
    accessorKey: "type",
    header: "Provider Type",
  },
  {
    accessorKey: "publicAccessKey",
    header: "Public Access Key",
  },
  {
    accessorKey: "privateAccessKey",
    header: "Private Access Key",
  },
];
