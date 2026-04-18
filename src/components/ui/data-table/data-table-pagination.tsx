import type { Table } from "@tanstack/react-table";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export const DEFAULT_PAGE_SIZES = [10, 20, 30, 40, 50];

type DataTablePaginationProps<T> = {
  table: Table<T>;
  pageSizeOptions?: number[];
};

export function DataTablePagination<T>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
}: DataTablePaginationProps<T>) {
  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2"
      aria-label="Navegação da tabela"
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm" id="page-size-label">
          Mostrar por página
        </span>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger aria-labelledby="page-size-label">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Página</label>
        <Input
          min={1}
          max={table.getPageCount()}
          type="number"
          aria-label="Número da página"
          className="w-12"
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const value = e.target.value;
            const page = value ? Number(value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
        <span className="text-sm whitespace-nowrap" aria-hidden="true">
          de <span className="font-bold">{table.getPageCount()}</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="Ir para a primeira página"
        >
          <ChevronFirstIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Ir para a página anterior"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Ir para a próxima página"
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Ir para a última página"
        >
          <ChevronLastIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
