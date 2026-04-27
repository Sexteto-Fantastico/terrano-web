import { AddButton } from "@/components/feature/shared/components/add-button";
import { ExportButton } from "@/components/feature/shared/components/export-button";
import { exportTableToCSV } from "@/lib/export";
import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  className?: string;
  onClickAdd: () => void;
};

export function DataTableToolbar<TData>({
  table,
  className,
  onClickAdd,
}: DataTableToolbarProps<TData>) {
  const rowCount = table.getRowCount();

  function handleExportTable() {
    exportTableToCSV(table);
  }

  function handleAdd() {
    onClickAdd();
  }

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 py-2 sm:flex-row sm:items-center",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        {rowCount === 1
          ? "1 registro encontrado"
          : `${rowCount} registros encontrados`}
      </span>
      <div className="flex items-center gap-2">
        <ExportButton onClick={handleExportTable} />
        <AddButton onClick={handleAdd} />
      </div>
    </div>
  );
}
