import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/api/users";
import {
  createActionColumn,
  createHeaderColumn,
  createBooleanColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon, Trash2Icon } from "lucide-react";

export type UserTableActionHandlers = {
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
  onToggleActive: (userId: number, value: boolean) => void;
};

export function getUserTableColumns({
  onEdit,
  onDelete,
  onToggleActive,
}: UserTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("nome"),
    },
    {
      accessorKey: "cpf",
      header: createHeaderColumn("CPF"),
      enableSorting: false,
      cell: ({ row }) => row.original.cpf ?? "-",
    },
    {
      id: "department",
      header: createHeaderColumn("departamento"),
      enableSorting: false,
      cell: ({ row }) => row.original.department?.name ?? "-",
    },
    {
      id: "role",
      header: createHeaderColumn("perfil de usuario"),
      enableSorting: false,
      cell: ({ row }) => row.original.role?.name ?? "-",
    },
    createBooleanColumn<User>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (user, value) => onToggleActive(user.id, value),
    }),
    createActionColumn(({ row }) => {
      const user = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(user.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDelete(user.id)}
          >
            <Trash2Icon className="me-2" />
            Excluir
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<User>[];
}
