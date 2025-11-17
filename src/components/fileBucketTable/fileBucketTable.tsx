"use client";

import {
  FileBucketColumn,
  columns as fileBucketColumns,
} from "@/components/fileBucketTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteBucket,
  getBucketsByConfigIdAndEnv,
  registerBucket,
} from "@/lib/fileBucket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { FileBucket } from "juno-sdk/build/main/internal/api";
import { useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddFileBucketForm from "../forms/AddFileBucketForm";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

interface FileBucketTableProps {
  projectId: string;
  configId: number | undefined;
}

function isValidId(projectId: string | null, configId: number | undefined) {
  return (
    projectId != null &&
    projectId != "" &&
    !Number.isNaN(Number(projectId)) &&
    configId != undefined
  );
}

export function FileBucketTable({ projectId, configId }: FileBucketTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Row<FileBucketColumn>[]>([]);

  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["fileBucket", projectId, configId],
    queryFn: async () => {
      if (!isValidId(projectId, configId)) {
        throw new Error("Invalid projectId or configId");
      }
      return await getBucketsByConfigIdAndEnv(configId, projectId);
    },
  });

  const fileBucketRowData = (data ?? ([] as FileBucket[]))
    .filter((bucket) => bucket)
    .map((bucket) => ({
      name: bucket.name,
      configId: bucket.configId,
      configEnv: bucket.configEnv,
      providerName: bucket.fileProviderName,
      fileNames: (bucket.fileServiceFile?.map(
        (file) => file?.fileId?.path ?? "Unknown file",
      ) ?? []) as string[],
    }));

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch file buckets: ${JSON.stringify(error)}`,
    });
  }

  const deleteFileBucketHandler = useMutation({
    mutationFn: () => {
      const deletePromises = selectedRows.map(async (row) => {
        return deleteBucket(
          {
            name: row.original.name,
            configId: row.original.configId,
            fileProviderName: row.original.providerName,
          },
          projectId,
        );
      });

      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted file buckets.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["fileBucket", projectId, configId],
      });
    },
    onSettled: () => setIsDeleteDialogOpen(false),
    onError: () => toast.error("An error occurred while deleting buckets."),
  });

  const addFileBucketHandler = useMutation({
    mutationFn: async (options: { name: string; fileProviderName: string }) => {
      await registerBucket(
        {
          name: options.name,
          configId,
          fileProviderName: options.fileProviderName,
        },
        projectId,
      );
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully added file bucket.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["fileBucket", projectId, configId],
      });
    },
    onSettled: () => {
      setIsAddDialogOpen(false);
    },
    onError: () => toast.error("An error occurred while adding buckets."),
  });

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add File Bucket</DialogTitle>
            <DialogDescription>
              Provide bucket name and file provider name to add File Bucket
            </DialogDescription>
          </DialogHeader>
          <AddFileBucketForm
            isPending={addFileBucketHandler.isPending}
            onAddBucket={(options: {
              name: string;
              fileProviderName: string;
            }) => addFileBucketHandler.mutate(options)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected File Buckets</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected
              bucket{selectedRows.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteFileBucketHandler.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteFileBucketHandler.mutate()}
              disabled={deleteFileBucketHandler.isPending}
            >
              {deleteFileBucketHandler.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1>File Buckets</h1>
      <BaseTable
        data={fileBucketRowData}
        columns={fileBucketColumns}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by name...",
          filterColumn: "name",
        }}
        onAddNewRow={() => {
          if (isValidId(projectId, configId)) {
            setIsAddDialogOpen(true);
          } else {
            toast.error("Error", {
              description:
                "Invalid projectId or project is missing file config",
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
