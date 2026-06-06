import type { ColumnDef } from "@tanstack/react-table";
import type { Purchase } from "@/api/purchases";
import {
  createActionColumn,
  createBooleanColumn,
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon, Trash2Icon } from "lucide-react";

export type PurchaseTableActionHandlers = {
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchaseId: number) => void;
  onToggleActive: (purchase: Purchase, checked: boolean) => void;
};

export function getPurchaseTableColumns({
  onEdit,
  onDelete,
  onToggleActive,
}: PurchaseTableActionHandlers) {
  return [
    {
      accessorKey: "id",
      header: createHeaderColumn("ID"),
      size: 40,
    },
    {
      id: "supplier",
      header: createHeaderColumn("Fornecedor"),
      cell: ({ row }) => {
        const sup = row.original.supplier as any;
        return sup?.name ?? row.original.supplier?.tradeName ?? "-";
      },
    },
    {
      accessorKey: "purchaseDate",
      header: createHeaderColumn("Data da compra"),
      cell: ({ row }) =>
        row.original.purchaseDate
          ? new Date(row.original.purchaseDate).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      accessorKey: "estimatedDeliveryDate",
      header: createHeaderColumn("Data prevista"),
      cell: ({ row }) =>
        row.original.estimatedDeliveryDate
          ? new Date(row.original.estimatedDeliveryDate).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      accessorKey: "nfNumber",
      header: createHeaderColumn("NF número"),
    },
    {
      accessorKey: "nfSerie",
      header: createHeaderColumn("NF série"),
    },
    {
      accessorKey: "total",
      header: createHeaderColumn("Total"),
      cell: ({ row }) => row.original.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    },
    createBooleanColumn<Purchase>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (purchase, value) => onToggleActive(purchase, value),
    }),
    createActionColumn(({ row }) => {
      const purchase = row.original;
      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(purchase)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDelete(purchase.id)}
          >
            <Trash2Icon className="me-2" />
            Excluir
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<Purchase>[];
}
