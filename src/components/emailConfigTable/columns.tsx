"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type EmailConfig = {
  id: number;
  environment: string;
  sendgridKey: string;
  domainNames: string[];
  senderUsernames: string[];
};

export const columns: ColumnDef<EmailConfig>[] = [
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
    accessorKey: "sendgridKey",
    header: "Sendgrid Key",
  },
  {
    accessorKey: "domainNames",
    header: "Domains",
  },
  {
    accessorKey: "senderUsernames",
    header: "Sender Usernames",
  },
];
