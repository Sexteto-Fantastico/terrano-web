import type { ColumnDef } from "@tanstack/react-table";
import {
  type ProductMovement,
  type MovementPurpose,
  MOVEMENT_PURPOSE_LABELS,
} from "@/api/product-tracking";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import { Badge } from "@/components/ui/badge";

export function getMovementsTableColumns(): ColumnDef<ProductMovement>[] {
  return [
    {
      accessorKey: "date",
      header: createHeaderColumn("DATA"),
      cell: ({ row }) => {
        const val = row.original.date;
        if (!val) return "-";
        try {
          return new Date(val).toLocaleDateString("pt-BR");
        } catch {
          return val;
        }
      },
    },
    {
      accessorKey: "type",
      header: createHeaderColumn("TIPO"),
      cell: ({ row }) => {
        const type = row.original.type;
        const isEntry = type === "IN";
        return (
          <Badge
            className={`px-3 py-1.5 font-semibold text-xs rounded-md border-transparent ${
              isEntry
                ? "bg-[#009262] text-white hover:bg-[#009262]/90"
                : "bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90"
            }`}
          >
            {isEntry ? "Entrada" : "Saída"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "purpose",
      header: createHeaderColumn("FINALIDADE"),
      cell: ({ row }) => {
        const purpose = row.original.purpose as MovementPurpose;
        return (
          <span className="font-medium text-foreground">
            {MOVEMENT_PURPOSE_LABELS[purpose] ?? purpose ?? "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: createHeaderColumn("QUANTIDADE"),
      cell: ({ row }) => {
        const qty = row.original.quantity;
        return <span className="font-medium">{qty.toLocaleString("pt-BR")}</span>;
      },
    },
    {
      accessorKey: "unitCost",
      header: createHeaderColumn("CUSTO UNITÁRIO"),
      cell: ({ row }) => {
        const value = row.original.unitCost;
        if (value == null) return "-";
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      accessorKey: "total",
      header: createHeaderColumn("VALOR TOTAL"),
      cell: ({ row }) => {
        const total = row.original.total;
        if (total == null) return "-";
        return total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
  ];
}
