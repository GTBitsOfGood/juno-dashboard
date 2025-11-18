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
import AddFileProviderForm from "../forms/AddFileProviderForm";
import { FileProviderColumn } from "./columns";

interface ProviderActionsCellProps {
  provider: FileProviderColumn;
  isPending: boolean;
  onAddProvider: (options: FileProviderColumn) => void;
}

export const ProviderActionsCell = ({
  provider,
  isPending,
  onAddProvider,
}: ProviderActionsCellProps) => {
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
              <DialogTrigger>Edit provider</DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Provider</DialogTitle>
            <DialogDescription>Edit provider information.</DialogDescription>
          </DialogHeader>
          <AddFileProviderForm
            existingProviderData={provider}
            isPending={isPending}
            onAddProvider={onAddProvider}
            isEditMode
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
