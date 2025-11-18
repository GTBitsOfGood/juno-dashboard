"use client";

import {
  FileProviderColumn,
  fileProviderColumns,
} from "@/components/fileProviderTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteProvider,
  getAllFileProviders,
  registerProvider,
} from "@/lib/fileProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddFileProviderForm from "../forms/AddFileProviderForm";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

interface FileProviderTableProps {
  projectId: string;
}

function isValidId(projectId: string | null | undefined) {
  return (
    projectId != null && projectId != "" && !Number.isNaN(Number(projectId))
  );
}

export function FileProviderTable({ projectId }: FileProviderTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Row<FileProviderColumn>[]>(
    [],
  );

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError: isProviderError,
    data: providers,
    error: providerError,
  } = useQuery({
    queryKey: ["fileProvider", projectId],
    queryFn: async () => {
      if (!isValidId(projectId)) {
        throw new Error("Invalid projectId");
      }
      return await getAllFileProviders(projectId);
    },
  });

  useEffect(() => {
    if (isProviderError) {
      toast.error("Error", {
        description: `Failed to fetch file providers: ${JSON.stringify(providerError)}`,
      });
    }
  }, [isProviderError, providerError]);

  const fileProviderRowData = (providers ?? [])
    .filter((provider) => provider)
    .map((provider) => ({
      publicAccessKey: provider.accessKey.publicAccessKey,
      privateAccessKey: provider.accessKey.privateAccessKey,
      baseUrl: provider.baseUrl,
      providerName: provider.providerName,
      type: provider.type,
    }));

  const deleteFileProviderHandler = useMutation({
    mutationFn: () => {
      const deletePromises = selectedRows.map(async (row) => {
        return deleteProvider(row.original.providerName, projectId);
      });

      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted file providers.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["fileProvider", projectId],
      });
    },
    onSettled: () => setIsDeleteDialogOpen(false),
    onError: () => toast.error("An error occurred while deleting providers."),
  });

  const addFileProviderHandler = useMutation({
    mutationFn: async (options: FileProviderColumn) => {
      await registerProvider(
        {
          baseUrl: options.baseUrl,
          providerName: options.providerName,
          type: options.type,
          accessKey: {
            publicAccessKey: options.publicAccessKey,
            privateAccessKey: options.privateAccessKey,
          },
        },
        projectId,
      );
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully updated file provider.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["fileProvider", projectId],
      });
    },
    onSettled: () => {
      setIsAddDialogOpen(false);
    },
    onError: () => toast.error("An error occurred while adding provider."),
  });

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add File Provider</DialogTitle>
            <DialogDescription>
              Provide provider information to add File Provider
            </DialogDescription>
          </DialogHeader>
          <AddFileProviderForm
            isPending={addFileProviderHandler.isPending}
            onAddProvider={(options: FileProviderColumn) =>
              addFileProviderHandler.mutate(options)
            }
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected File Providers</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected
              provider{selectedRows.length > 1 ? "s" : ""}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteFileProviderHandler.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteFileProviderHandler.mutate()}
              disabled={deleteFileProviderHandler.isPending}
            >
              {deleteFileProviderHandler.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1>File Providers</h1>
      <BaseTable
        data={fileProviderRowData}
        columns={fileProviderColumns(
          addFileProviderHandler.isPending,
          (options: FileProviderColumn) =>
            addFileProviderHandler.mutate(options),
        )}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by name...",
          filterColumn: "providerName",
        }}
        onAddNewRow={() => {
          if (isValidId(projectId)) {
            setIsAddDialogOpen(true);
          } else {
            toast.error("Error", {
              description: "Invalid projectId",
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
