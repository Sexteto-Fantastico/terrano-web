import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Table as ITable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { getCommonPinningStyles } from "./data-table-helpers";
import { DataTablePagination } from "./data-table-pagination";

export interface DataTableProps<TData> {
  table: ITable<TData>;
  className?: string;
  loading?: boolean;
  empty?: {
    title: string;
    description: string;
  };
  onRowClick?: (row: import("@tanstack/react-table").Row<TData>) => void;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    pinned?: "left" | "right";
    bold?: boolean;
  }
}

export function DataTable<TData>({
  table,
  loading,
  className,
  onRowClick,
  empty = {
    title: "No data",
    description: "We could not find any data here yet",
  },
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({
                        column: header.column,
                      }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({
                          column: cell.column,
                        }),
                      }}
                      className={cn(
                        cell.column.columnDef.meta?.bold && "font-medium"
                      )}
                    >
                      {loading ? (
                        <Skeleton className="h-4 w-3/5" />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  <div className="text-sm font-medium">{empty.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {empty.description}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <>
          <DataTablePagination table={table} />
          <div className="h-20" />
        </>
      )}
    </div>
  );
}
