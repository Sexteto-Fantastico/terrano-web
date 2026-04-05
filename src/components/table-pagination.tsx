import type { Table } from "@tanstack/react-table";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const PAGE_SIZES = [10, 20, 30, 40, 50];

type TablePaginationProps<T> = {
  table: Table<T>;
};

export function TablePagination<T>({ table }: TablePaginationProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronFirstIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronLastIcon className="size-4" />
        </Button>
      </div>
      <span className="text-sm">
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
        <strong>{table.getPageCount()}</strong>
      </span>
      <Input
        className="w-16"
        type="number"
        value={table.getState().pagination.pageIndex + 1}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          table.setPageIndex(page);
        }}
      />
      <Select
        value={String(table.getState().pagination.pageSize)}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((pageSize) => (
            <SelectItem key={pageSize} value={String(pageSize)}>
              Show {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
