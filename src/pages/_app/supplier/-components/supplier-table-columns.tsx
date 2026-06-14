import type { ColumnDef } from "@tanstack/react-table";
import type { Supplier } from "@/api/suppliers";
import {
  createActionColumn,
  createBooleanColumn,
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

import { formatCnpj } from "@/utils/format-cnpj"; 
import { formatPhone } from "@/utils/format-phone";

export type SupplierTableActionHandlers = {
  onEdit: (supplierId: number) => void;
  onToggleActive: (supplierId: number, value: boolean) => void;
};

export function getSupplierTableColumns({
  onEdit,
  onToggleActive,
}: SupplierTableActionHandlers) {
  return [
    {
      accessorKey: "corporateName",
      header: createHeaderColumn("Razão Social"),
    },
    {
      accessorKey: "tradeName",
      header: createHeaderColumn("Nome"),
    },
    {
      accessorKey: "cnpj",
      header: createHeaderColumn("CNPJ"),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? formatCnpj(value) : "-";
      },
    },
    {
      accessorKey: "email",
      header: createHeaderColumn("E-mail"),
    },
    {
      accessorKey: "phone",
      header: createHeaderColumn("Telefone"),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? formatPhone(value) : "-";
      },
    },
    createBooleanColumn<Supplier>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (supplier, value) => onToggleActive(supplier.id, value),
    }),
    createActionColumn(({ row }) => {
      const supplier = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(supplier.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<Supplier>[];
}