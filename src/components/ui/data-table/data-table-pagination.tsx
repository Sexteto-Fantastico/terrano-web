import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;

const defaultPageSizeOptions = [10, 20, 30, 40, 50] as const;

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  isLoading?: boolean;
  className?: string;
  pageSizeOptions?: readonly number[];
};

export function DataTablePagination<TData>({
  table,
  isLoading = false,
  className,
  pageSizeOptions = defaultPageSizeOptions,
}: DataTablePaginationProps<TData>) {
  const id = React.useId();
  const pageSizeLabelId = `${id}-page-size-label`;

  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const currentPage = pageIndex + 1;

  return (
    <nav
      className={cn(
        "my-2 flex flex-wrap items-center justify-end gap-4",
        className
      )}
      aria-label="Paginação da tabela"
    >
      <div className="flex items-center gap-2">
        <span id={pageSizeLabelId} className="text-sm">
          Linhas por página
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => table.setPageSize(Number(v))}
          disabled={isLoading}
        >
          <SelectTrigger
            size="sm"
            className="min-w-12"
            aria-labelledby={pageSizeLabelId}
          >
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent className="min-w-12">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p
        className="flex items-center gap-1 text-sm"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-muted-foreground">Página</span>
        <strong>
          {currentPage} de {pageCount}
        </strong>
      </p>

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Navegação entre páginas"
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={isLoading || !table.getCanPreviousPage()}
          aria-label="Ir para a primeira página"
        >
          <ChevronsLeftIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={isLoading || !table.getCanPreviousPage()}
          aria-label="Ir para a página anterior"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={isLoading || !table.getCanNextPage()}
          aria-label="Ir para a página seguinte"
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={isLoading || !table.getCanNextPage()}
          aria-label="Ir para a última página"
        >
          <ChevronsRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
