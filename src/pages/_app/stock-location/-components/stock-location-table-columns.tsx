import type { ColumnDef } from "@tanstack/react-table";
import type { StockLocation } from "@/api/stock-locations";
import {
  createActionColumn,
  createBooleanColumn,
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

export type StockLocationTableActionHandlers = {
  onEdit: (stockLocationId: number) => void;
  onToggleActive: (stockLocationId: number, value: boolean) => void;
};

function formatAddress(stockLocation: StockLocation) {
  const address = stockLocation.address;

  if (!address) {
    return "-";
  }

  const parts = [
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "-";
}

export function getStockLocationTableColumns({
  onEdit,
  onToggleActive,
}: StockLocationTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("Nome"),
    },
    {
      accessorKey: "description",
      header: createHeaderColumn("Descrição"),
      cell: ({ row }) => row.original.description ?? "-",
    },
    {
      id: "address",
      header: createHeaderColumn("Endereço"),
      enableSorting: false,
      cell: ({ row }) => formatAddress(row.original),
    },
    createBooleanColumn<StockLocation>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (stockLocation, value) =>
        onToggleActive(stockLocation.id, value),
    }),
    createActionColumn(({ row }) => {
      const stockLocation = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(stockLocation.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<StockLocation>[];
}