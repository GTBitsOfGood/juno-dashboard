"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import CreateUserForm from "@/components/forms/AddUserForm";
import { ProjectColumn } from "../../app/(dashboard)/admin/projects/columns";
import { userColumns, UserColumn } from "./columns";
import { deleteUserAction } from "@/lib/actions";
import { toast } from "sonner";
import SkeletonRows from "../table/SkeletonRows";

interface DataTableProps<TData> {
  data: TData[];
  projectData: ProjectColumn[];
  isLoading: boolean;
  onUserAction: (user: UserColumn, action: "add" | "update" | "delete") => void;
  originatingProjectId?: number;
}

export function UserDataTable<TData>({
  data,
  projectData,
  isLoading,
  onUserAction,
  originatingProjectId,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasSelectedRows, setHasSelectedRows] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns = userColumns(projectData, onUserAction);

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData>[],
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  useEffect(() => {
    setHasSelectedRows(selectedRows.length > 0);
  }, [selectedRows]);

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = selectedRows.map(async (row) => {
        const user = row.original as UserColumn;
        const result = await deleteUserAction(user.id.toString());
        if (result.success) {
          onUserAction(user, "delete");
          return { success: true, user };
        } else {
          return { success: false, user, error: result.error };
        }
      });

      const results = await Promise.all(deletePromises);
      const successfulDeletes = results.filter((r) => r.success).length;
      const failedDeletes = results.filter((r) => !r.success).length;

      if (successfulDeletes > 0) {
        toast.success("Success", {
          description: `Successfully deleted ${successfulDeletes} user${successfulDeletes > 1 ? "s" : ""}.`,
        });
      }

      if (failedDeletes > 0) {
        toast.error("Error", {
          description: `Failed to delete ${failedDeletes} user${failedDeletes > 1 ? "s" : ""}.`,
        });
      }

      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("An error occurred while deleting users.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // TODO: skeleton animation
  return (
    <>
      <div className="items-center flex justify-between py-4 gap-3">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("email")?.setFilterValue(event.target.value);
          }}
        />

        <div className="flex gap-2">
          {hasSelectedRows && (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete {selectedRows.length} selected user
              {selectedRows.length > 1 ? "s" : ""}
            </Button>
          )}
          <Dialog
            open={isAddUserDialogOpen}
            onOpenChange={setIsAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Create a new user for Juno.
                </DialogDescription>
              </DialogHeader>
              <CreateUserForm
                onUserAdd={(user) => onUserAction?.(user, "add")}
                onClose={() => setIsAddUserDialogOpen(false)}
                projectIds={originatingProjectId != undefined ? [originatingProjectId] : []}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected
              user{selectedRows.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{ width: header.getSize() }}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <SkeletonRows numRows={10} numCells={columns.length} />
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
