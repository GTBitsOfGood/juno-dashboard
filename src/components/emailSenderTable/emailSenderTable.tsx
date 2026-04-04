"use client";

import {
  EmailSenderColumn,
  emailSenderColumns,
} from "@/components/emailSenderTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEmailSenders } from "@/lib/settings";
import {
  registerJunoSenderAddress,
} from "@/lib/sdkUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddEmailSenderForm from "../forms/AddEmailSenderForm";
import { DialogHeader } from "../ui/dialog";

interface EmailSenderTableProps {
  projectId: string;
}

export function EmailSenderTable({ projectId }: EmailSenderTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: sendersResult,
    error,
  } = useQuery({
    queryKey: ["emailSenders", projectId],
    queryFn: async () => {
      return await getEmailSenders(projectId);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error", {
        description: `Failed to fetch email senders: ${JSON.stringify(error)}`,
      });
    }
    if (sendersResult && !sendersResult.success && sendersResult.error) {
      toast.error("Error", {
        description: sendersResult.error,
      });
    }
  }, [isError, error, sendersResult]);

  const senderRowData: EmailSenderColumn[] = (sendersResult?.senders ?? []).map(
    (sender: EmailSenderColumn) => ({
      id: sender.id,
      nickname: sender.nickname ?? "",
      fromEmail: sender.fromEmail ?? "",
      fromName: sender.fromName ?? "",
      replyTo: sender.replyTo ?? "",
      address: sender.address ?? "",
      city: sender.city ?? "",
      state: sender.state ?? "",
      country: sender.country ?? "",
      zip: sender.zip ?? "",
      verified: sender.verified ?? false,
      locked: sender.locked ?? false,
    }),
  );

  const addSenderHandler = useMutation({
    mutationFn: async (options: {
      email: string;
      name: string;
      replyTo: string;
      nickname: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    }) => {
      const result = await registerJunoSenderAddress(
        options.email,
        options.name,
        options.replyTo || undefined,
        options.nickname,
        options.address,
        options.city,
        options.state,
        options.zip,
        options.country,
      );
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Successfully registered sender.",
      });
      queryClient.invalidateQueries({
        queryKey: ["emailSenders", projectId],
      });
    },
    onSettled: () => {
      setIsAddDialogOpen(false);
    },
    onError: (error) =>
      toast.error(`An error occurred while registering sender: ${error.message}`),
  });

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Email Sender</DialogTitle>
            <DialogDescription>
              Register a new verified sender with SendGrid
            </DialogDescription>
          </DialogHeader>
          <AddEmailSenderForm
            isPending={addSenderHandler.isPending}
            onAddSender={(options) => addSenderHandler.mutate(options)}
          />
        </DialogContent>
      </Dialog>

      <h1 className="text-lg font-bold">Email Senders</h1>
      <BaseTable
        data={senderRowData}
        columns={emailSenderColumns}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by email...",
          filterColumn: "fromEmail",
        }}
        onAddNewRow={() => {
          setIsAddDialogOpen(true);
        }}
      />
    </div>
  );
}
