"use client";

import { ColumnDef } from "@tanstack/react-table";

export type FileConfig = {
  id: number;
  environment: string;
  bucketNames: string[];
};

export const columns: ColumnDef<FileConfig>[] = [
  {
    accessorKey: "id",
    header: "Config ID",
  },
  {
    accessorKey: "environment",
    header: "Environment",
  },
  {
    accessorKey: "bucketNames",
    header: "Buckets",
  },
];
