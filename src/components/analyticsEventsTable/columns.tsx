"use client";

import { Event } from "@/components/analytics/types";
import { ColumnDef } from "@tanstack/react-table";

export const visitEventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    id: "pageUrl",
    header: "Page URL",
    accessorFn: (event) => event.eventProperties?.pageUrl ?? "—",
  },
  {
    id: "userId",
    header: "User ID",
    accessorFn: (event) => event.eventProperties?.userId ?? "—",
  },
  {
    accessorKey: "environment",
    header: "Environment",
  },
];
