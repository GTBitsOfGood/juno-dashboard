"use client";

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
    accessorKey: "id",
    header: "Config ID",
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
