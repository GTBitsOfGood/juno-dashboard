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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChartColumn, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useReadOnlyMode } from "../providers/SessionProvider";
import { BaseTable } from "../baseTable";
import AddAnalyticsConfigForm from "../forms/AddAnalyticsConfigForm";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { analyticsConfigColumns } from "./columns";

interface AnalyticsConfigTableProps {
  projectId: string;
}

export function AnalyticsConfigTable({ projectId }: AnalyticsConfigTableProps) {
  const [isAddConfigDialogOpen, setIsAddConfigDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isReadOnly = useReadOnlyMode();

  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["analyticsConfig", projectId],
    queryFn: () => getAnalyticsConfig(projectId),
  });

  const analyticsConfigRowData = [data].filter((config) => config);

  useEffect(() => {
    if (isError && error) {
      toast.error("Error", {
        description: `Failed to fetch analytics config: ${error.message}`,
      });
    }
  }, [isError, error]);

  const deleteAnalyticsConfigHandler = useMutation({
    mutationFn: async () => deleteAnalyticsConfig(projectId),
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
    }) => createAnalyticsConfig(projectId, keys),
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
            <DialogTitle>Delete Analytics Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the analytics configuration for
              this project? This will remove all analytics tracking settings and
              cannot be undone.
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
      <h1 className="text-lg font-bold">Analytics Configurations</h1>
      {isError && (
        <Alert variant="destructive">
          <CircleX className="h-4 w-4" />
          <span className="text-sm">
            Couldn&apos;t load analytics config: {error.message}
          </span>
        </Alert>
      )}
      {isError ? null : !isLoading && analyticsConfigRowData.length === 0 ? (
        <Card className="max-w-full sm:max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ChartColumn className="h-5 w-5 text-muted-foreground" />
              <CardTitle>No Analytics Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Project {projectId} has no analytics configuration yet. Add a
              server key and a client key to start tracking user interactions,
              visits, clicks, and custom events using Juno.
            </p>
            <Button
              onClick={() => setIsAddConfigDialogOpen(true)}
              disabled={isReadOnly || addAnalyticsConfigHandler.isPending}
            >
              Set up analytics
            </Button>
          </CardContent>
        </Card>
      ) : (
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
              },
            ) => {
              const { serverAnalyticsKey, clientAnalyticsKey } = keys;
              updateAnalyticsConfigHandler.mutate({
                projectId,
                serverAnalyticsKey,
                clientAnalyticsKey,
              });
              setIsAddConfigDialogOpen(false);
            },
            isReadOnly,
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
          onDeleteRow={() => {
            setIsDeleteDialogOpen(true);
          }}
        />
      )}
    </div>
  );
}
