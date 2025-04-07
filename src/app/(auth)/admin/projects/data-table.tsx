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
import CreateProjectForm from "@/components/forms/CreateProjectForm";
import { ProjectColumn } from "./columns";
import { deleteProjectAction } from "@/lib/actions";
import { toast } from "sonner";
import SkeletonRows from "@/components/table/SkeletonRows";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  onProjectAction?: (
    project: ProjectColumn,
    action: "add" | "update" | "delete",
  ) => void;
}

export function ProjectDataTable<TData, TValue>({
  columns,
  data,
  loading,
  onProjectAction,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasSelectedRows, setHasSelectedRows] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  // Check if any rows are selected
  const selectedRows = table.getSelectedRowModel().rows;
  useEffect(() => {
    setHasSelectedRows(selectedRows.length > 0);
  }, [selectedRows]);

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = selectedRows.map(async (row) => {
        const project = row.original as ProjectColumn;
        const result = await deleteProjectAction(project.id);
        if (result.success) {
          if (onProjectAction) {
            onProjectAction(project, "delete");
          }
          return { success: true, project };
        } else {
          return { success: false, project, error: result.error };
        }
      });

      const results = await Promise.all(deletePromises);
      const successfulDeletes = results.filter((r) => r.success).length;
      const failedDeletes = results.filter((r) => !r.success).length;

      if (successfulDeletes > 0) {
        toast.success("Success", {
          description: `Successfully deleted ${successfulDeletes} project${successfulDeletes > 1 ? "s" : ""}.`,
        });
      }

      if (failedDeletes > 0) {
        toast.error("Error", {
          description: `Failed to delete ${failedDeletes} project${failedDeletes > 1 ? "s" : ""}.`,
        });
      }

      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting projects:", error);
      toast.error("An error occurred while deleting projects.");
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
          placeholder="Filter projects..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
        />

        <div className="flex gap-2">
          {hasSelectedRows && (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete {selectedRows.length} selected project
              {selectedRows.length > 1 ? "s" : ""}
            </Button>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Project</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Project</DialogTitle>
                <DialogDescription>
                  Create a new project for Juno.
                </DialogDescription>
              </DialogHeader>
              <CreateProjectForm
                onProjectAdd={(project) => onProjectAction?.(project, "add")}
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Projects</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected
              project{selectedRows.length > 1 ? "s" : ""}? This action cannot be
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
            ) : loading ? (
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
