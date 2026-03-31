"use client";

import {
  FileDirectoryRow,
  FileStatus,
  columns as fileDirectoryColumns,
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
import { getAllFileProviders } from "@/lib/fileProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { FileBucket, FileProvider } from "juno-sdk/build/main/internal/index";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddFileBucketForm from "../forms/AddFileBucketForm";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

interface FileBucketTableProps {
  projectId: string;
  configId: number | undefined;
}

interface File {
  fileId: { path: string };
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
  const [selectedRows, setSelectedRows] = useState<Row<FileDirectoryRow>[]>([]);

  const queryClient = useQueryClient();

  const {
    isLoading: isBucketLoading,
    isError: isBucketError,
    data: buckets,
    error: bucketError,
  } = useQuery({
    queryKey: ["fileBucket", projectId, configId],
    queryFn: async () => {
      if (!isValidId(projectId, configId)) {
        throw new Error("Invalid projectId or configId");
      }
      return await getBucketsByConfigIdAndEnv(configId, projectId);
    },
  });

  const {
    isLoading: isProviderLoading,
    isError: isProviderError,
    data: providers,
    error: providerError,
  } = useQuery({
    queryKey: ["fileProvider", projectId],
    queryFn: async () => {
      if (
        projectId == null ||
        projectId == "" ||
        Number.isNaN(Number(projectId))
      ) {
        throw new Error("Invalid projectId");
      }
      return await getAllFileProviders(projectId);
    },
  });

  useEffect(() => {
    if (isBucketError) {
      toast.error("Error", {
        description: `Failed to fetch file buckets: ${JSON.stringify(bucketError)}`,
      });
    }
    if (isProviderError) {
      toast.error("Error", {
        description: `Failed to fetch file providers: ${JSON.stringify(providerError)}`,
      });
    }
  }, [isBucketError, isProviderError, bucketError, providerError]);

  const isLoading = isBucketLoading && isProviderLoading;

  const mockStatuses: FileStatus[] = ["NOT UPLOADED", "UPLOADED", "EXTERNAL"];

  const fileDirectoryRowData: FileDirectoryRow[] = (
    buckets ?? ([] as FileBucket[])
  )
    .filter((bucket) => bucket)
    .map((bucket) => {
      const fileNames = (bucket.fileServiceFile?.map(
        (file) => (file as unknown as File)?.fileId?.path ?? "Unknown file",
      ) ?? []) as string[];

      return {
        type: "bucket" as const,
        name: bucket.name,
        configId: bucket.configId,
        configEnv: bucket.configEnv,
        providerName: bucket.fileProviderName,
        subRows: fileNames.map((fileName, index) => ({
          type: "file" as const,
          name: fileName,
          status: mockStatuses[index % mockStatuses.length],
        })),
      };
    });

  const fileProviderNames = (providers ?? ([] as FileProvider[]))
    .filter((provider) => provider)
    .map((provider) => provider.providerName);

  const deleteFileBucketHandler = useMutation({
    mutationFn: () => {
      const bucketRows = selectedRows.filter(
        (row) => row.original.type === "bucket",
      );
      const fileRows = selectedRows.filter(
        (row) => row.original.type === "file",
      );

      const deletePromises = bucketRows.map(async (row) => {
        return deleteBucket(
          {
            name: row.original.name,
            configId: row.original.configId!,
            fileProviderName: row.original.providerName!,
          },
          projectId,
        );
      });

      // TODO: Add file deletion API call when backend supports it
      if (fileRows.length > 0) {
        toast.info(
          `${fileRows.length} file(s) selected for deletion (frontend only, backend not yet connected).`,
        );
      }

      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted selected items.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["fileBucket", projectId, configId],
      });
    },
    onSettled: () => setIsDeleteDialogOpen(false),
    onError: () =>
      toast.error("An error occurred while deleting selected items."),
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
            fileProviderNames={fileProviderNames}
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
            <DialogTitle>Delete Selected Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected
              item{selectedRows.length > 1 ? "s" : ""}? This action cannot be
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

      <h1 className="text-lg font-bold">File Directory</h1>
      <BaseTable
        data={fileDirectoryRowData}
        columns={fileDirectoryColumns}
        isLoading={isLoading}
        expandable={true}
        filterParams={{
          placeholder: "Filter by bucket name...",
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
