"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type EmailSenderColumn = {
  id: number;
  nickname: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  verified: boolean;
  locked: boolean;
};

export const emailSenderColumns: ColumnDef<EmailSenderColumn>[] = [
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
    accessorKey: "nickname",
    header: "Nickname",
  },
  {
    accessorKey: "fromEmail",
    header: "From Email",
  },
  {
    accessorKey: "fromName",
    header: "From Name",
  },
  {
    accessorKey: "replyTo",
    header: "Reply To",
  },
  {
    accessorKey: "verified",
    header: "Status",
    cell: ({ row }) => {
      const verified = row.original.verified;
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "Verified" : "Pending"}
        </Badge>
      );
    },
    size: 100,
  },
];
