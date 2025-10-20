"use client";

import { emailConfigColumns } from "@/components/emailConfigTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { setupJunoEmail } from "@/lib/sdkUtils";
import { getEmailConfig } from "@/lib/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddEmailConfigForm from "../forms/AddEmailConfigForm";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";

interface EmailConfigTableProps {
  projectId: string;
}

export function EmailConfigTable({ projectId }: EmailConfigTableProps) {
  const [isAddConfigDialogOpen, setIsAddConfigDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["emailConfig", projectId],
    queryFn: () => getEmailConfig(projectId),
  });

  const emailConfigRowData = [data]
    .filter((config) => config)
    .map((config) => ({
      id: config.id.low,
      environment: config.environment,
      sendgridKey: config.sendgridKey,
      domainNames: config.domains?.map((domain) => domain.domain) ?? [],
      senderUsernames: config.senders?.map((sender) => sender.username) ?? [],
    }));

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch email config: ${JSON.stringify(error)}`,
    });
  }

  const deleteEmailConfig = useMutation({
    // TODO: use SDK method to delete email config
    mutationFn: () => {
      const deletePromises = selectedRows.map(async (row) => {
        // TODO: Remove this console.log when adding SDK method
        console.log("Use SDK method to delete email config", row);

        const result = { success: true, error: undefined };
        return result;
      });

      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully deleted email configs.`,
      });
      queryClient.setQueryData(["emailConfig", projectId], null);
    },
    onSettled: () => setIsDeleteDialogOpen(false),
    onError: () => toast.error("An error occurred while deleting configs."),
  });

  const addEmailConfig = useMutation({
    mutationFn: async (sendgridKey: string) => {
      const result = await setupJunoEmail(sendgridKey);
      if (!result.success) {
        throw new Error(result.message);
      }
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully updated email configs.`,
      });
      queryClient.invalidateQueries({ queryKey: ["emailConfig", projectId] });
    },
    onSettled: () => {
      setIsAddConfigDialogOpen(false);
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
            <DialogTitle>Add Email Configuration</DialogTitle>
            <DialogDescription>
              Provide Sendgrid key to set up Email Service.
            </DialogDescription>
          </DialogHeader>
          <AddEmailConfigForm
            projectId={Number(projectId)}
            isPending={addEmailConfig.isPending}
            onAddConfig={(sendgridKey) => addEmailConfig.mutate(sendgridKey)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Email Config</DialogTitle>
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
              disabled={deleteEmailConfig.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteEmailConfig.mutate()}
              disabled={deleteEmailConfig.isPending}
            >
              {deleteEmailConfig.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <h1>Email Configurations</h1>
      <BaseTable
        data={emailConfigRowData}
        columns={emailConfigColumns(
          Number(projectId),
          addEmailConfig.isPending,
          (sendgridKey) => addEmailConfig.mutate(sendgridKey)
        )}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by environment...",
          filterColumn: "environment",
        }}
        onAddNewRow={() => {
          if (emailConfigRowData.length === 0) {
            setIsAddConfigDialogOpen(true);
          } else {
            toast.error("Error", {
              description:
                "Project can have at most 1 email configuration per environment",
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
