"use client";

import { columns as fileConfigColumns } from "@/components/fileConfigTable/columns";
import { FileConfigResponse } from "juno-sdk/build/main/internal/api";
import { useState } from "react";
import { BaseTable } from "../baseTable";

interface FileConfigTableProps {
  fileConfig: FileConfigResponse;
  isLoading: boolean;
}

export function FileConfigTable({
  fileConfig,
  isLoading,
}: FileConfigTableProps) {
  const [isAddConfigDialogOpen, setIsAddConfigDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const fileConfigRowData = [fileConfig]
    .filter((config) => config)
    .map((config) => ({
      id: config.id.low,
      environment: config.environment,
      bucketNames: config.buckets?.map((bucket) => bucket.name) ?? [],
      fileNames:
        config.files?.map((file) => file?.fileId?.path ?? "Unknown file") ?? [],
    }));
  return (
    <div className="flex flex-col gap-4">
      <h1>File Configurations</h1>
      <BaseTable
        data={fileConfigRowData}
        columns={fileConfigColumns}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by environment...",
          filterColumn: "environment",
        }}
        onAddNewRow={() => setIsAddConfigDialogOpen(true)}
        onDeleteRow={(rows) => {
          setSelectedRows(rows);
          setIsDeleteDialogOpen(true);
        }}
      />
    </div>
  );
}
