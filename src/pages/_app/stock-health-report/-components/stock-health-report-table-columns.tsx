import type { ColumnDef } from "@tanstack/react-table";
import {
  StockHealthStatus,
  type StockHealthReportItem,
} from "@/api/stock-health-report";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import { AlertTriangle, PackageX } from "lucide-react";

export function getStockHealthReportTableColumns() {
  return [
    {
      accessorKey: "status",
      header: createHeaderColumn("STATUS"),
      cell: ({ row }) => {
        const status = row.original.status;
        const isOutOfStock = status === StockHealthStatus.ESGOTADO;

        return (
          <Badge
            className={`gap-1.5 rounded-md px-3 py-3.5 text-xs font-semibold border-transparent text-white ${
              isOutOfStock
                ? "bg-[#E31B23] hover:bg-[#E31B23]/90"
                : "bg-[#FF7A00] hover:bg-[#FF7A00]/90"
            }`}
          >
            {isOutOfStock ? (
              <PackageX className="size-3.5" />
            ) : (
              <AlertTriangle className="size-3.5" />
            )}
            {isOutOfStock ? "Esgotado" : "Estoque baixo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "code",
      header: createHeaderColumn("CÓDIGO"),
    },
    {
      accessorKey: "name",
      header: createHeaderColumn("PRODUTO"),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.name}</span>
          {row.original.brand && (
            <span className="text-xs text-muted-foreground">{row.original.brand}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: createHeaderColumn("CATEGORIA"),
      cell: ({ row }) => row.original.category ?? "-",
    },
    {
      accessorKey: "stockLocationName",
      header: createHeaderColumn("LOCAL DE ESTOQUE"),
    },
    {
      accessorKey: "quantity",
      header: createHeaderColumn("QTD. ATUAL"),
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {row.original.quantity} {row.original.measurementUnit}
        </span>
      ),
    },
    {
      accessorKey: "minStock",
      header: createHeaderColumn("ESTOQUE MÍNIMO"),
      cell: ({ row }) =>
        row.original.minStock != null
          ? `${row.original.minStock} ${row.original.measurementUnit}`
          : "-",
    },
    {
      accessorKey: "shortage",
      header: createHeaderColumn("QTD. P/ REPOR"),
      cell: ({ row }) =>
        row.original.shortage != null && row.original.shortage > 0 ? (
          <span className="font-semibold text-[#E31B23]">
            {row.original.shortage} {row.original.measurementUnit}
          </span>
        ) : (
          "-"
        ),
    },
    {
      accessorKey: "updatedAt",
      header: createHeaderColumn("ATUALIZADO EM"),
      cell: ({ row }) => formatDate(new Date(row.original.updatedAt)),
    },
  ] as ColumnDef<StockHealthReportItem>[];
}
