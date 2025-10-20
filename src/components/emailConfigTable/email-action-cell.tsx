"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import AddEmailConfigForm from "../forms/AddEmailConfigForm";
import { EmailConfig } from "./columns";

interface EmailActionsCellProps {
  config: EmailConfig;
  projectId: number;
  isPending: boolean;
  onAddConfig: (sendgridKey: string) => void;
}

export const EmailActionsCell = ({
  config,
  projectId,
  isPending,
  onAddConfig,
}: EmailActionsCellProps) => {
  return (
    <>
      <Dialog modal={false}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer"
            >
              <DialogTrigger>Edit config</DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Config</DialogTitle>
            <DialogDescription>Edit the Sendgrid Key.</DialogDescription>
          </DialogHeader>
          <AddEmailConfigForm
            projectId={projectId}
            sendGridKey={config.sendgridKey}
            isPending={isPending}
            onAddConfig={onAddConfig}
            isEditMode
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
