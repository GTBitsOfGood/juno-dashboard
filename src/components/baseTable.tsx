"use client";

import { Input } from "@/components/ui/input";
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
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  Row,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import SkeletonRows from "./table/SkeletonRows";
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
  expandable?: boolean;
}

export function BaseTable<TData, TValue>({
  className = "",
  columns,
  data,
  isLoading = true,
  filterParams,
  onAddNewRow,
  onDeleteRow,
  expandable = false,
}: BaseTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(expandable && {
      getExpandedRowModel: getExpandedRowModel(),
      onExpandedChange: setExpanded,
      getSubRows: (row: TData) =>
        (row as TData & { subRows?: TData[] }).subRows,
    }),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      ...(expandable && { expanded }),
    },
  });

  const selectedRows = expandable
    ? table.getSelectedRowModel().flatRows
    : table.getSelectedRowModel().rows;

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
        {selectedRows.length > 0 && onDeleteRow && (
          <Button
            variant="destructive"
            onClick={() => {
              onDeleteRow(selectedRows);
              table.resetRowSelection();
            }}
          >
            Delete {selectedRows.length} selected item
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
                  className={row.depth > 0 ? "bg-muted/30" : ""}
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
              <SkeletonRows numRows={5} numCells={columns.length} />
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
