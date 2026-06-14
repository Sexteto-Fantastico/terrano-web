import type { ColumnDef } from "@tanstack/react-table";
import { type ProductMovement,type MovementPurpose,MOVEMENT_PURPOSE_LABELS, } from "@/api/product-tracking";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";

export function getMovementsTableColumns(): ColumnDef<ProductMovement>[] {
  return [
    {
      accessorKey: "date",
      header: createHeaderColumn("Data"),
      cell: ({ getValue }) =>
        new Date(getValue<string>()).toLocaleDateString("pt-BR"),
    },
    {
      accessorKey: "type",
      header: createHeaderColumn("Tipo"),
      cell: ({ getValue }) =>
        getValue<string>() === "IN" ? "Entrada" : "Saída",
    },
    {
      accessorKey: "quantity",
      header: createHeaderColumn("Quantidade"),
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.original.quantity, 0);
        return total;
      },
    },
    {
  accessorKey: "unitCost",
  header: createHeaderColumn("Custo Unitário"),
  cell: ({ getValue }) => {
    const value = getValue<number | null>();

    if (value == null) {
      return "-";
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },
},
    {
  accessorKey: "total",
  header: createHeaderColumn("Total"),
  cell: ({ getValue }) =>
    (getValue<number | null>() ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
  footer: ({ table }) => {
    const total = table
      .getFilteredRowModel()
      .rows.reduce(
        (sum, row) => sum + (row.original.total ?? 0),
        0
      );

    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },
},
    {
      accessorKey: "purpose",
      header: createHeaderColumn("Finalidade"),
      cell: ({ getValue }) => {
        const purpose = getValue() as MovementPurpose;
        return MOVEMENT_PURPOSE_LABELS[purpose] ?? purpose;
      },
    },
  ];
}