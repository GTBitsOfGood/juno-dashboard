"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { PasswordBox } from "../passwordBox";
import { ProviderActionsCell } from "./providerActionCell";

export type FileProviderColumn = {
  publicAccessKey: string;
  privateAccessKey: string;
  baseUrl: string;
  providerName: string;
  type: string;
};

export const fileProviderColumns = (
  isPending: boolean,
  onAddProvider: (options: FileProviderColumn) => void,
): ColumnDef<FileProviderColumn>[] => [
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
    cell: ({ row }) => {
      const publicAccessKey = row.original.publicAccessKey;
      return (
        <PasswordBox
          className="mr-6"
          password={publicAccessKey}
          readOnly
          round
        />
      );
    },
    size: 200,
  },
  {
    accessorKey: "privateAccessKey",
    header: "Private Access Key",
    cell: ({ row }) => {
      const privateAccessKey = row.original.privateAccessKey;
      return (
        <PasswordBox
          className="mr-6"
          password={privateAccessKey}
          readOnly
          round
        />
      );
    },
    size: 200,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const provider = row.original;
      return (
        <ProviderActionsCell
          provider={provider}
          onAddProvider={onAddProvider}
          isPending={isPending}
        />
      );
    },
    size: 50,
  },
];
