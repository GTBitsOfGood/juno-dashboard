"use client";

import { columns as fileConfigColumns } from "@/components/fileConfigTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFileConfig } from "@/lib/settings";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddFileConfigForm from "../forms/AddFileConfigForm";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

interface FileConfigTableProps {
  projectId: string;
}

export function FileConfigTable({ projectId }: FileConfigTableProps) {
  const [isAddConfigDialogOpen, setIsAddConfigDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["fileConfig", projectId],
    queryFn: () => getFileConfig(projectId),
  });

  const fileConfigRowData = [data]
    .filter((config) => config)
    .map((config) => ({
      id: config.id.low,
      environment: config.environment,
      bucketNames: config.buckets?.map((bucket) => bucket.name) ?? [],
      fileNames:
        config.files?.map((file) => file?.fileId?.path ?? "Unknown file") ?? [],
    }));

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch file configs: ${JSON.stringify(error)}`,
    });
  }

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = selectedRows.map(async (row) => {
        // TODO: use SDK method to delete file config
        // Remove this console.log when adding SDK method
        console.log("Use SDK method to delete file config", row);

        const result = { success: true, error: undefined };
        return result;
      });

      const results = await Promise.all(deletePromises);
      const successfulDeletes = results.filter((r) => r.success).length;
      const failedDeletes = results.filter((r) => !r.success).length;

      if (successfulDeletes > 0) {
        toast.success("Success", {
          description: `Successfully deleted ${successfulDeletes} config${successfulDeletes > 1 ? "s" : ""}.`,
        });
      }

      if (failedDeletes > 0) {
        toast.error("Error", {
          description: `Failed to delete ${failedDeletes} config${failedDeletes > 1 ? "s" : ""}.`,
        });
      }
    } catch (error) {
      console.error("Error deleting configs:", error);
      toast.error("An error occurred while deleting configs.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Dialog
        open={isAddConfigDialogOpen}
        onOpenChange={setIsAddConfigDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add File Configuration</DialogTitle>
            <DialogDescription>No manual input required.</DialogDescription>
          </DialogHeader>
          <AddFileConfigForm
            projectId={Number(projectId)}
            onClose={() => setIsAddConfigDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected File Config</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected
              config{selectedRows.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
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
              description:
                "Project can have at most 1 file configuration per environment",
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
