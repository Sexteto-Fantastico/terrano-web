import type { ColumnDef } from "@tanstack/react-table";
import type { MovementExit } from "@/api/movement-exit";
import { createHeaderColumn, createBooleanColumn } from "@/components/ui/data-table/data-table-helpers";
import { MOVEMENT_EXIT_CATEGORY_LABELS } from "./stock-out-filter-config";

export type StockOutTableActionHandlers = {
  onToggleActive: (exit: MovementExit, value: boolean) => void;
};

export function getStockOutTableColumns({ onToggleActive }: StockOutTableActionHandlers) {
  return [
    {
      accessorKey: "id",
      header: createHeaderColumn("ID"),
    },
    {
      accessorKey: "exitDate",
      header: createHeaderColumn("Data da Saída"),
      cell: ({ row }) => {
        const date = row.original.exitDate;
        if (!date) return "-";

        return new Date(date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "exitMovementCategory",
      header: createHeaderColumn("Categoria"),
      cell: ({ row }) => {
        const category = row.original.exitMovementCategory;
        return MOVEMENT_EXIT_CATEGORY_LABELS[category] || category;
      },
    },
    {
      accessorKey: "items",
      header: createHeaderColumn("Itens"),
      cell: ({ row }) => {
        const items = row.original.items;
        if (!items || items.length === 0) return "-";
        if (items.length === 1) return `${items[0].product?.name || "Produto"} (${items[0].quantity})`;
        return `${items.length} itens`;
      },
    },
    {
      accessorKey: "stockRequisition",
      header: createHeaderColumn("Requisição de Estoque"),
      cell: ({ row }) => row.original.stockRequisition?.id || row.original.stockRequisition || "-",
    },
    createBooleanColumn<MovementExit>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (exit, value) => onToggleActive(exit, value),
    }),
  ] as ColumnDef<MovementExit>[];
}
