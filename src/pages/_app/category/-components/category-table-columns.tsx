import type { ColumnDef } from "@tanstack/react-table";
import type { ProductCategory } from "@/api/product-categories";
import {
  createActionColumn,
  createHeaderColumn,
  createBooleanColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

export type CategoryTableActionHandlers = {
  onEdit: (categoryId: number) => void;
  onToggleActive: (categoryId: number, value: boolean) => void;
};

export function getCategoryTableColumns({
  onEdit,
  onToggleActive,
}: CategoryTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("Nome"),
    },
    {
      accessorKey: "description",
      header: createHeaderColumn("Descrição"),
    },
    {
      id: "parent",
      accessorFn: (row) => row.parent?.name || "-",
      header: createHeaderColumn("Categoria Pai"),
    },
    createBooleanColumn<ProductCategory>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (category, value) => onToggleActive(category.id, value),
    }),
    createActionColumn(({ row }) => {
      const category = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(category.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<ProductCategory>[];
}