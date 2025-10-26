"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createAnalyticsConfig,
  deleteAnalyticsConfig,
  getAnalyticsConfig,
  updateAnalyticsConfig,
} from "@/lib/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddAnalyticsConfigForm from "../forms/AddAnalyticsConfigForm";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { analyticsConfigColumns } from "./columns";

interface AnalyticsConfigTableProps {
  projectId: string;
}

export function AnalyticsConfigTable({ projectId }: AnalyticsConfigTableProps) {
  const [isAddConfigDialogOpen, setIsAddConfigDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["analyticsConfig", projectId],
    queryFn: () => getAnalyticsConfig(projectId),
  });

  const analyticsConfigRowData = [data].filter((config) => config);

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch analytics config: ${error.message}`,
    });
  }

  const deleteAnalyticsConfigHandler = useMutation({
    mutationFn: () => {
      const deletePromises = selectedRows.map(async (row) => {
        const projectId = row.id;
        return deleteAnalyticsConfig(projectId);
      });

      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted analytics configs.`,
      });
      queryClient.setQueryData(["analyticsConfig", projectId], null);
    },
    onSettled: () => setIsDeleteDialogOpen(false),
    onError: () => toast.error("An error occurred while deleting configs."),
  });

  const addAnalyticsConfigHandler = useMutation({
    mutationFn: async (keys: {
      serverAnalyticsKey: string;
      clientAnalyticsKey: string;
    }) => createAnalyticsConfig(keys),
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully added analytics config.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["analyticsConfig", projectId],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const updateAnalyticsConfigHandler = useMutation({
    mutationFn: async (data: {
      projectId: number;
      serverAnalyticsKey: string;
      clientAnalyticsKey: string;
    }) => {
      const { projectId, serverAnalyticsKey, clientAnalyticsKey } = data;
      return updateAnalyticsConfig(projectId, {
        serverAnalyticsKey,
        clientAnalyticsKey,
      });
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully updated analytics config.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["analyticsConfig", projectId],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-col gap-4">
      <Dialog
        open={isAddConfigDialogOpen}
        onOpenChange={setIsAddConfigDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Analytics Configuration</DialogTitle>
            <DialogDescription>
              Provide Server and Client keys to set up Analytics Service.
            </DialogDescription>
          </DialogHeader>
          <AddAnalyticsConfigForm
            projectId={Number(projectId)}
            isPending={addAnalyticsConfigHandler.isPending}
            onAddConfig={(keys: {
              serverAnalyticsKey: string;
              clientAnalyticsKey: string;
            }) => {
              addAnalyticsConfigHandler.mutate(keys);
              setIsAddConfigDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Analytics Config</DialogTitle>
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
              disabled={deleteAnalyticsConfigHandler.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAnalyticsConfigHandler.mutate()}
              disabled={deleteAnalyticsConfigHandler.isPending}
            >
              {deleteAnalyticsConfigHandler.isPending
                ? "Deleting..."
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <h1>Analytics Configurations</h1>
      <BaseTable
        data={analyticsConfigRowData}
        columns={analyticsConfigColumns(
          Number(projectId),
          addAnalyticsConfigHandler.isPending,
          (
            projectId: number,
            keys: {
              serverAnalyticsKey: string;
              clientAnalyticsKey: string;
            }
          ) => {
            const { serverAnalyticsKey, clientAnalyticsKey } = keys;
            updateAnalyticsConfigHandler.mutate({
              projectId,
              serverAnalyticsKey,
              clientAnalyticsKey,
            });
            setIsAddConfigDialogOpen(false);
          }
        )}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by environment...",
          filterColumn: "environment",
        }}
        onAddNewRow={() => {
          if (analyticsConfigRowData.length === 0) {
            setIsAddConfigDialogOpen(true);
          } else {
            toast.error("Error", {
              description:
                "Project can have at most 1 analytics configuration per environment",
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
