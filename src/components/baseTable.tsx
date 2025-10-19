"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";

interface BaseTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  filterParams?: {
    placeholder: string;
    filterColumn: string;
  };
  onAddNewRow?: () => void;
  onDeleteRow?: (rows: Row<TData>[]) => void;
}

export function BaseTable<TData, TValue>({
  className = "",
  columns,
  data,
  isLoading = true,
  filterParams,
  onAddNewRow,
  onDeleteRow,
}: BaseTableProps<TData, TValue>) {
  const [hasSelectedRows, setHasSelectedRows] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;
  useEffect(() => {
    setHasSelectedRows(selectedRows.length > 0);
  }, [selectedRows]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <div className={twMerge(className, "flex flex-col gap-3")}>
      <div className="flex gap-3">
        {filterParams && (
          <Input
            placeholder={filterParams.placeholder}
            value={
              (table
                .getColumn(filterParams.filterColumn)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table
                .getColumn(filterParams.filterColumn)
                ?.setFilterValue(event.target.value);
            }}
          />
        )}
        {hasSelectedRows && onDeleteRow && (
          <Button
            variant="destructive"
            onClick={() => {
              onDeleteRow(selectedRows);
              table.resetRowSelection();
            }}
          >
            Delete {selectedRows.length} selected config
            {selectedRows.length > 1 ? "s" : ""}
          </Button>
        )}
        {onAddNewRow && <Button onClick={onAddNewRow}>Add New</Button>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
