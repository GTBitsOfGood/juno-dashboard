"use client";

import { columns as fileConfigColumns } from "@/components/fileConfigTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileConfigResponse } from "juno-sdk/build/main/internal/api";
import { useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import { DialogHeader } from "../ui/dialog";

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
      <Dialog
        open={isAddConfigDialogOpen}
        onOpenChange={setIsAddConfigDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add File Configuration</DialogTitle>
            <DialogDescription>Create a new file config.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <h1>File Configurations</h1>
      <BaseTable
        data={fileConfigRowData}
        columns={fileConfigColumns}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by environment...",
          filterColumn: "environment",
        }}
        onAddNewRow={() => {
          if (fileConfigRowData.length == 0) {
            setIsAddConfigDialogOpen(true);
          } else {
            toast.error("Error", {
              description: "Project can have at most 1 file configuration",
            });
          }
        }}
        onDeleteRow={(rows) => {
          setSelectedRows(rows);
          setIsDeleteDialogOpen(true);
        }}
      />
    </div>
  );
}
