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
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-sm">Ir para a página</span>
        <Input
          className="w-16"
          type="number"
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <span className="text-sm">Mostrar</span>
          <SelectTrigger>
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <span className="text-sm">por página</span>
          <SelectContent>
            {PAGE_SIZES.map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para a primeira página</span>
          <ChevronFirstIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para a página anterior</span>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <span className="mx-2 text-sm">
          Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{" "}
          <strong>{table.getPageCount()}</strong>
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para a próxima página</span>
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para a última página</span>
          <ChevronLastIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
