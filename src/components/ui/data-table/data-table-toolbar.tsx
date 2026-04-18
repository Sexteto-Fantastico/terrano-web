import type { Table } from "@tanstack/react-table";
import { SearchIcon, XIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTableToolbarFilter } from "./data-table-toolbar-filter";

type FilterValue = string | string[] | number[] | null;

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  globalSearchKey?: string;
  globalSearchPlaceholder?: string;
}

export function DataTableToolbarContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-orientation="horizontal"
      className={cn(
        "mb-2 flex flex-1 items-start justify-between gap-2",
        className
      )}
      role="toolbar"
      {...props}
    />
  );
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  globalSearchKey,
  globalSearchPlaceholder,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const [pendingFilters, setPendingFilters] = useState<
    Record<string, FilterValue>
  >({});

  const handleFilterChange = useCallback(
    (columnId: string, value: FilterValue) => {
      setPendingFilters((prev) => ({ ...prev, [columnId]: value }));
    },
    []
  );

  const handleApply = useCallback(() => {
    const filters = Object.entries(pendingFilters)
      .filter(([, value]) => {
        if (value === null || value === undefined) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "string") return value !== "";
        return true;
      })
      .map(([id, value]) => ({ id, value }));

    table.setColumnFilters(filters);
  }, [pendingFilters, table]);

  const handleReset = useCallback(() => {
    table.resetColumnFilters();
    setPendingFilters({});
  }, [table]);

  return (
    <DataTableToolbarContainer className={className} {...props}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div>
          {columns.map((column) => (
            <DataTableToolbarFilter
              column={column}
              key={column.id}
              value={pendingFilters[column.id] ?? null}
              onChange={(value) => handleFilterChange(column.id, value)}
              onSubmit={handleApply}
            />
          ))}
        </div>
        <div className="ml-auto flex flex-col items-center gap-2">
          <Button className="w-full" onClick={handleApply}>
            <SearchIcon className="mr-2 size-4" />
            Filtrar
          </Button>
          <Button
            className="w-full border-dashed"
            onClick={handleReset}
            variant="outline"
            disabled={!isFiltered && Object.keys(pendingFilters).length === 0}
          >
            <XIcon className="mr-2 size-4" />
            Limpar
          </Button>
        </div>
      </div>
    </DataTableToolbarContainer>
  );
}
