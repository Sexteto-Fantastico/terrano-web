import type { ColumnDef } from "@tanstack/react-table";
import {
  MEASUREMENT_UNIT_SYMBOL_LABELS,
  type MeasurementUnit,
} from "@/api/measurement-units";
import {
  createActionColumn,
  createHeaderColumn,
  createBooleanColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

export type MeasurementUnitTableActionHandlers = {
  onEdit: (unitId: number) => void;
  onToggleActive: (unitId: number, value: boolean) => void;
};

export function getMeasurementUnitTableColumns({
  onEdit,
  onToggleActive,
}: MeasurementUnitTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("Nome"),
    },
    {
      accessorKey: "symbol",
      header: createHeaderColumn("Conformidade"),
      enableSorting: false,
      cell: ({ row }) =>
        MEASUREMENT_UNIT_SYMBOL_LABELS[row.original.symbol] ??
        row.original.symbol,
    },
    createBooleanColumn<MeasurementUnit>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (unit, value) => onToggleActive(unit.id, value),
    }),
    createActionColumn(({ row }) => {
      const unit = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(unit.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<MeasurementUnit>[];
}
