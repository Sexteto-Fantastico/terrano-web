import type { ColumnDef } from "@tanstack/react-table";
import type { Department } from "@/api/departments";
import {
  createActionColumn,
  createHeaderColumn,
  createBooleanColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

export type DepartmentTableActionHandlers = {
  onEdit: (departmentId: number) => void;
  onToggleActive: (departmentId: number, value: boolean) => void;
};

export function getDepartmentTableColumns({
  onEdit,
  onToggleActive,
}: DepartmentTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("Nome"),
    },
    {
      id: "manager",
      accessorFn: (row) => row.manager?.name || "-",
      header: createHeaderColumn("Responsável"),
    },
    createBooleanColumn<Department>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (department, value) => onToggleActive(department.id, value),
    }),
    createActionColumn(({ row }) => {
      const department = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(department.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<Department>[];
}
