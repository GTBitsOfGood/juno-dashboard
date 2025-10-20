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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

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

  const deleteFileConfig = useMutation({
    // TODO: use SDK method to delete file config
    mutationFn: () => {
      const deletePromises = selectedRows.map(async (row) => {
        // TODO: Remove this console.log when adding SDK method
        console.log("Use SDK method to delete file config", row);

        const result = { success: true, error: undefined };
        return result;
      });

      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted file configs.`,
      });
      // queryClient.invalidateQueries({ queryKey: ["fileConfig", projectId] });
      queryClient.setQueryData(["fileConfig", projectId], null);
    },
    onSettled: () => setIsDeleteDialogOpen(false),
    onError: () => toast.error("An error occurred while deleting configs."),
  });

  const addFileConfig = useMutation({
    // TODO: use file service setup SDK method here
    mutationFn: async () => {},
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully added file configs.`,
      });
      queryClient.invalidateQueries({ queryKey: ["fileConfig", projectId] });
    },
    onSettled: () => {
      setIsAddConfigDialogOpen(false);
    },
  });

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
            error={addFileConfig.error?.message}
            isPending={addFileConfig.isPending}
            onAddConfig={() => addFileConfig.mutate()}
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
              disabled={deleteFileConfig.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteFileConfig.mutate()}
              disabled={deleteFileConfig.isPending}
            >
              {deleteFileConfig.isPending ? "Deleting..." : "Delete"}
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
