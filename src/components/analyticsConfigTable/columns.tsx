"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { AnalyticsActionsCell } from "./analytics-action-cell";

export type AnalyticsConfig = {
  id: number;
  environment: string;
  serverAnalyticsKey: string;
  clientAnalyticsKey: string;
};

export const analyticsConfigColumns = (
  projectId: number,
  isPending: boolean,
  onUpdateConfig: (
    projectId: number,
    keys: {
      serverAnalyticsKey: string;
      clientAnalyticsKey: string;
    },
  ) => void,
  isReadOnly: boolean,
): ColumnDef<AnalyticsConfig>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="ms-2 align-middle mr-5"
          checked={table.getIsAllPageRowsSelected()}
          disabled={isReadOnly}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="ms-2 align-middle"
          checked={row.getIsSelected()}
          disabled={isReadOnly}
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
      accessorKey: "serverAnalyticsKey",
      header: "Server Key",
    },
    {
      accessorKey: "clientAnalyticsKey",
      header: "Client Key",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const config = row.original;
        return (
          <AnalyticsActionsCell
            config={config}
            projectId={projectId}
            onUpdateConfig={onUpdateConfig}
            isPending={isPending}
            isReadOnly={isReadOnly}
          />
        );
      },
      size: 50,
    },
  ];
};
