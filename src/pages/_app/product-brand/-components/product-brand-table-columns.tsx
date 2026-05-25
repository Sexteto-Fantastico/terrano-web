import type { ColumnDef } from "@tanstack/react-table";
import type { ProductBrand } from "@/api/product-brands";
import {
  createActionColumn,
  createHeaderColumn,
  createBooleanColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon } from "lucide-react";

export type ProductBrandTableActionHandlers = {
  onEdit: (brandId: number) => void;
  onToggleActive: (brandId: number, value: boolean) => void;
};

export function getProductBrandTableColumns({
  onEdit,
  onToggleActive,
}: ProductBrandTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("Nome"),
    },
    createBooleanColumn<ProductBrand>({
      accessorKey: "isActive",
      title: "ativo",
      onToggle: (brand, value) => onToggleActive(brand.id, value),
    }),
    createActionColumn(({ row }) => {
      const brand = row.original;

      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(brand.id)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<ProductBrand>[];
}
