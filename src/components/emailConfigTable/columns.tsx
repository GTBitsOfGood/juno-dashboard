"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ItemListCell } from "../item-list-cell";
import { EmailActionsCell } from "./email-action-cell";

export type EmailConfig = {
  id: number;
  environment: string;
  sendgridKey: string;
  domainNames: string[];
  senderUsernames: string[];
};

export const emailConfigColumns = (
  projectId: number,
  isPending: boolean,
  onAddConfig: (sendgridKey: string) => void,
): ColumnDef<EmailConfig>[] => {
  return [
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
      accessorKey: "sendgridKey",
      header: "Sendgrid Key",
    },
    {
      accessorKey: "domainNames",
      header: "Domains",
      cell: ({ row }) => <ItemListCell itemNames={row.original.domainNames} />,
    },
    {
      accessorKey: "senderUsernames",
      header: "Senders",
      cell: ({ row }) => (
        <ItemListCell
          itemNames={row.original.senderUsernames}
          badgeVariant="secondary"
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const config = row.original;
        return (
          <EmailActionsCell
            config={config}
            projectId={projectId}
            onAddConfig={onAddConfig}
            isPending={isPending}
          />
        );
      },
      size: 50,
    },
  ];
};
