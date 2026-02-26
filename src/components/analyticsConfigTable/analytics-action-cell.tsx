"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import AddAnalyticsConfigForm from "../forms/AddAnalyticsConfigForm";
import { AnalyticsConfig } from "./columns";
import { useState } from "react";

interface AnalyticsActionsCellProps {
  config: AnalyticsConfig;
  projectId: number;
  isPending: boolean;
  onUpdateConfig: (
    projectId: number,
    keys: {
      serverAnalyticsKey: string;
      clientAnalyticsKey: string;
    },
  ) => void;
}

export const AnalyticsActionsCell = ({
  config,
  projectId,
  isPending,
  onUpdateConfig,
}: AnalyticsActionsCellProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            Edit config
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Config</DialogTitle>
            <DialogDescription>
              Edit Server or Client Analytics Key.
            </DialogDescription>
          </DialogHeader>
          <AddAnalyticsConfigForm
            projectId={projectId}
            serverAnalyticsKey={config.serverAnalyticsKey}
            clientAnalyticsKey={config.clientAnalyticsKey}
            isPending={isPending}
            onUpdateConfig={onUpdateConfig}
            isEditMode
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
