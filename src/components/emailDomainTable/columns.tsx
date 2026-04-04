"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type EmailDomainColumn = {
  id: number;
  domain: string;
  subdomain?: string;
  valid: boolean;
};

export const emailDomainColumns: ColumnDef<EmailDomainColumn>[] = [
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
    accessorKey: "domain",
    header: "Domain",
  },
  {
    accessorKey: "subdomain",
    header: "Subdomain",
    cell: ({ row }) => {
      return row.original.subdomain || "-";
    },
  },
  {
    accessorKey: "valid",
    header: "Status",
    cell: ({ row }) => {
      const valid = row.original.valid;
      return (
        <Badge variant={valid ? "default" : "secondary"}>
          {valid ? "Verified" : "Pending"}
        </Badge>
      );
    },
    size: 100,
  },
  {
    accessorKey: "id",
    header: "SendGrid ID",
    size: 100,
  },
];
