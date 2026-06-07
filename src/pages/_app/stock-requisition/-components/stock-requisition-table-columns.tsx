import type { ColumnDef } from "@tanstack/react-table";
import { SquarePenIcon, HistoryIcon } from "lucide-react";

import {
  createActionColumn,
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { StockRequisition } from "@/api/stock-requisition";
import { StockRequisitionStatusBadge } from "./stock-requisition-status-badge";

export type StockRequisitionTableActionHandlers = {
  onEdit: (id: number) => void;
  onToggleActive: (requisition: StockRequisition, value: boolean) => void;
  onHistory: (id: number) => void;
};

export function getStockRequisitionTableColumns({
  onEdit,
  onToggleActive,
  onHistory,
}: StockRequisitionTableActionHandlers) {
  return [
    {
      accessorKey: "id",
      header: createHeaderColumn("Solicitação"),
    },

    {
  accessorKey: "department",
  header: createHeaderColumn("Departamento"),
  enableSorting: false,
  cell: ({ row }: { row: { original: StockRequisition } }) =>
    row.original.department?.name ?? "-",
},

{
  accessorKey: "status",
  header: createHeaderColumn("Status"),
  enableSorting: false,
  cell: ({ row }: { row: { original: StockRequisition } }) => (
    <StockRequisitionStatusBadge status={row.original.status} />
  ),
},

    {
      accessorKey: "createdAt",
      header: createHeaderColumn("Emissão"),
      cell: ({ row }: { row: { original: StockRequisition } }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("pt-BR")
          : "-",
    },

    {
      id: "activeOnly",
      accessorFn: (row: StockRequisition) => !row.deletedAt,
      header: createHeaderColumn("Ativo"),
      enableSorting: false,
      enableHiding: false,
      size: 80,
      cell: ({ row }: { row: { original: StockRequisition } }) => {
        const isActive = !row.original.deletedAt;
        return (
          <Switch
            checked={isActive}
            onCheckedChange={(checked) =>
              onToggleActive(row.original, checked)
            }
          />
        );
      },
    },

    createActionColumn(
      ({ row }: { row: { original: StockRequisition } }) => (
        <>
          <DropdownMenuItem onSelect={() => onHistory(row.original.id)}>
            <HistoryIcon className="me-2" />
            Histórico
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => onEdit(row.original.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      )
    ),
  ] as ColumnDef<StockRequisition>[];
}