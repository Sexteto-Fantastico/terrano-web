import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  className?: string;
}

export function DataTableToolbar<TData>({
  table,
  className,
  children,
}: DataTableToolbarProps<TData>) {
  const rowCount = table.getRowCount();

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        {rowCount === 1
          ? "1 registro encontrado"
          : `${rowCount} registros encontrados`}
      </span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
