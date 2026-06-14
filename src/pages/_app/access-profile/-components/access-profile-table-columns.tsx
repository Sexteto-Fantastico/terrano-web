import type { ColumnDef } from "@tanstack/react-table";
import type { Role } from "@/api/roles";
import {
  createActionColumn,
  createHeaderColumn,
  createBooleanColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

export type AccessProfileActionHandlers = {
  onEdit: (roleId: number) => void;
  onToggleActive: (roleId: number, value: boolean) => void;
};

export function getAccessProfileTableColumns({
  onEdit,
  onToggleActive,
}: AccessProfileActionHandlers) {
  return [
    { accessorKey: "name", header: createHeaderColumn("Nome") },
    { accessorKey: "description", header: createHeaderColumn("Descrição") },
    {
      id: "policies",
      accessorFn: (row) => row.policies.length,
      header: createHeaderColumn("Permissões"),
    },
    createBooleanColumn<Role>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (role, value) => onToggleActive(role.id, value),
    }),
    createActionColumn(({ row }) => {
      const role = row.original;
      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(role.id)}>
            <SquarePenIcon className="me-2" /> Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<Role>[];
}
