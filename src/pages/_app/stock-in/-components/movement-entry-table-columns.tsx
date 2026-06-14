import type { ColumnDef } from "@tanstack/react-table";
import type { MovementEntry } from "@/api/movement-entry";
import { createActionColumn, createBooleanColumn, createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EyeIcon } from "lucide-react";
import { MovementEntryCategoryBadge } from "./movement-entry-category-badge";
import { Link } from "@tanstack/react-router";

export type MovementEntryTableActionHandlers = {
  onToggleActive: (entry: MovementEntry, value: boolean) => void;
};

export function getMovementEntryTableColumns({ onToggleActive }: MovementEntryTableActionHandlers) {
  return [
    {
      accessorKey: "id",
      header: createHeaderColumn("ID"),
      size: 60,
    },
    {
      accessorKey: "entryDate",
      header: createHeaderColumn("Data de entrega"),
      cell: ({ row }) => {
        const date = row.original.entryDate;
        if (!date) return "-";
        return new Date(date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "entryMovementCategory",
      header: createHeaderColumn("Categoria"),
      cell: ({ row }) => (
        <MovementEntryCategoryBadge category={row.original.entryMovementCategory} />
      ),
    },
    {
      id: "stockLocation",
      header: createHeaderColumn("Estoque de destino"),
      cell: ({ row }) => row.original.stockLocation?.name ?? "-",
    },
    {
      id: "supplier",
      header: createHeaderColumn("Fornecedor"),
      cell: ({ row }) => row.original.purchase?.supplier?.tradeName ?? "-",
    },
    {
      id: "nf",
      header: createHeaderColumn("NF"),
      cell: ({ row }) => {
        const nfNumber = row.original.purchase?.nfNumber;
        const nfSerie = row.original.purchase?.nfSerie;
        if (!nfNumber && !nfSerie) return "-";
        return [nfNumber, nfSerie].filter(Boolean).join(" / ");
      },
    },
    {
      id: "total",
      header: createHeaderColumn("Total"),
      cell: ({ row }) => {
        const items = row.original.items;
        if (!items || items.length === 0) return "-";
        const total = items.reduce((sum, item) => sum + item.quantity * (item.unitCost ?? 0), 0);
        return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      },
    },
    createBooleanColumn<MovementEntry>({
      accessorKey: "isActive",
      title: "Ativo",
      onToggle: (entry, value) => onToggleActive(entry, value),
    }),
    createActionColumn(({ row }) => (
      <DropdownMenuItem asChild>
        <Link to="/stock-in/$id" params={{ id: String(row.original.id) }}>
          <EyeIcon className="me-2" />
          Ver detalhes
        </Link>
      </DropdownMenuItem>
    )),
  ] as ColumnDef<MovementEntry>[];
}
