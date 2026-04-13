"use client";

import {
  FileDirectoryRow,
  getFileBucketColumns,
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
  deleteFiles,
  getAllFiles,
  getBucketsByConfigIdAndEnv,
  registerBucket,
} from "@/lib/fileBucket";
import { getAllFileProviders } from "@/lib/fileProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import type { FileProvider } from "juno-sdk/build/main/internal/index";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddFileBucketForm from "../forms/AddFileBucketForm";
import { useReadOnlyMode } from "../providers/SessionProvider";
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
  const [selectedRows, setSelectedRows] = useState<Row<FileDirectoryRow>[]>([]);
  const isReadOnly = useReadOnlyMode();

  const queryClient = useQueryClient();

  const {
    isLoading: isBucketLoading,
    isError: isBucketError,
    data: buckets,
    error: bucketError,
  } = useQuery({
    queryKey: ["fileBucket", projectId, configId],
    queryFn: async () => await getBucketsByConfigIdAndEnv(configId!, projectId),
    enabled: isValidId(projectId, configId),
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

  const {
    isLoading: isFilesLoading,
    isError: isFilesError,
    data: allFiles,
    error: filesError,
  } = useQuery({
    queryKey: ["allFiles", projectId, configId],
    queryFn: async () => await getAllFiles(configId!, projectId),
    enabled: isValidId(projectId, configId),
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
    if (isFilesError) {
      toast.error("Error", {
        description: `Failed to fetch files: ${JSON.stringify(filesError)}`,
      });
    }
  }, [
    isBucketError,
    isProviderError,
    isFilesError,
    bucketError,
    providerError,
    filesError,
  ]);

  const isLoading = isBucketLoading || isProviderLoading || isFilesLoading;

  const allFilesMap: Record<string, string[]> = Object.assign(
    {},
    ...(allFiles ?? []),
  );

  const fileDirectoryRowData: FileDirectoryRow[] = (buckets ?? [])
    .filter((bucket) => bucket)
    .map((bucket) => {
      const storedFileNames = new Set(allFilesMap[bucket.name] ?? []);
      const registeredFileNames = (
        bucket.fileServiceFile?.map(
          (file) => (file as { path?: string })?.path ?? "",
        ) ?? []
      ).filter(Boolean) as string[];

      const registeredFileSet = new Set(registeredFileNames);

      const subRows: FileDirectoryRow[] = [];

      storedFileNames.forEach((fileName) => {
        subRows.push({
          type: "file",
          name: fileName,
          status: registeredFileSet.has(fileName) ? "UPLOADED" : "EXTERNAL",
        });
      });

      registeredFileNames.forEach((fileName) => {
        if (!storedFileNames.has(fileName)) {
          subRows.push({
            type: "file",
            name: fileName,
            status: "NOT UPLOADED",
          });
        }
      });

      return {
        type: "bucket" as const,
        name: bucket.name,
        configId: bucket.configId,
        configEnv: bucket.configEnv,
        providerName: bucket.fileProviderName,
        subRows,
      };
    });

  const fileProviderNames = (providers ?? ([] as FileProvider[]))
    .filter((provider) => provider)
    .map((provider) => provider.providerName);

  const deleteFileBucketHandler = useMutation({
    mutationFn: async () => {
      const bucketRows = selectedRows.filter(
        (row) => row.original.type === "bucket",
      );
      const fileRows = selectedRows.filter(
        (row) => row.original.type === "file",
      );

      const deletingBucketNames = new Set(
        bucketRows.map((row) => row.original.name),
      );

      const bucketDeletePromises = bucketRows.map((row) =>
        deleteBucket(
          {
            name: row.original.name,
            configId: row.original.configId!,
            fileProviderName: row.original.providerName!,
          },
          projectId,
        ),
      );

      const filesByBucket = new Map<
        string,
        { configId: number; fileNames: string[] }
      >();
      for (const row of fileRows) {
        const parentRow = row.getParentRow();
        if (!parentRow) continue;
        const bucketName = parentRow.original.name;
        if (deletingBucketNames.has(bucketName)) continue;
        const bucketConfigId = parentRow.original.configId!;
        if (!filesByBucket.has(bucketName)) {
          filesByBucket.set(bucketName, {
            configId: bucketConfigId,
            fileNames: [],
          });
        }
        filesByBucket.get(bucketName)!.fileNames.push(row.original.name);
      }

      const fileDeletePromises = Array.from(filesByBucket.entries()).map(
        ([bucketName, { configId: bucketConfigId, fileNames }]) =>
          deleteFiles(
            { bucketName, configId: bucketConfigId, fileNames },
            projectId,
          ),
      );

      await Promise.all([...bucketDeletePromises, ...fileDeletePromises]);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted selected items.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["fileBucket", projectId, configId],
      });
      queryClient.invalidateQueries({
        queryKey: ["allFiles", projectId, configId],
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
        isLoading={isLoading && fileDirectoryRowData.length === 0}
        expandable={true}
        columns={getFileBucketColumns(isReadOnly)}
        filterParams={{
          placeholder: "Filter by bucket or file name...",
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
