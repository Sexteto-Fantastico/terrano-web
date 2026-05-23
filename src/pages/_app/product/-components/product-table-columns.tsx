import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/api/products";
import {
  createActionColumn,
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export type ProductTableActionHandlers = {
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onToggleActive: (product: Product, checked: boolean) => void;
};

export function getProductTableColumns({
  onEdit,
  onDelete,
  onToggleActive,
}: ProductTableActionHandlers) {
  return [
    {
      accessorKey: "name",
      header: createHeaderColumn("Nome"),
    },
    {
      accessorKey: "code",
      header: createHeaderColumn("Código"),
    },
    {
      id: "categoryId",
      header: createHeaderColumn("Categoria"),
      cell: ({ row }) => row.original.category?.name ?? "-",
    },
    {
      id: "brandId",
      header: createHeaderColumn("Marca"),
      cell: ({ row }) => row.original.brand?.name ?? "-",
    },
    {
      id: "measurementUnit",
      header: createHeaderColumn("Unid. Medida"),
      cell: ({ row }) =>
        row.original.measurementUnit?.symbol ??
        row.original.measurementUnit?.name ??
        "-",
    },
    {
      accessorKey: "minStock",
      header: createHeaderColumn("Estoque Mín"),
      cell: ({ row }) => row.original.minStock ?? "-",
    },
    {
      accessorKey: "maxStock",
      header: createHeaderColumn("Estoque Máx"),
      cell: ({ row }) => row.original.maxStock ?? "-",
    },
    {
      id: "activeOnly",
      accessorFn: (row: Product) => !row.deletedAt,
      header: createHeaderColumn("Ativo"),
      enableSorting: false,
      enableHiding: false,
      size: 80,
      cell: ({ row }) => {
        const product = row.original;
        const isActive = !product.deletedAt;
        return (
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => onToggleActive(product, checked)}
          />
        );
      },
    },
    createActionColumn(({ row }) => {
      const product = row.original;
      return (
        <>
          <DropdownMenuItem onSelect={() => onEdit(product)}>
            <SquarePenIcon className="me-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDelete(product.id)}
          >
            <Trash2Icon className="me-2" />
            Excluir
          </DropdownMenuItem>
        </>
      );
    }),
  ] as ColumnDef<Product>[];
}
