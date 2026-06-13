import { useMemo } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import type { StockRequisitionResponse } from "@/api/stock-requisitions";
import { StockRequisitionStatusBadge } from "../stock-requisition/-components/stock-requisition-status-badge";

export function PendingRequestsTable({
  data,
}: {
  data: StockRequisitionResponse[];
}) {
  const rows = useMemo(
    () =>
      data.map((req) => ({
        id: req.id,
        department: req.department?.name ?? "—",
        status: req.status,
        createdAt: req.createdAt,
      })),
    [data]
  );

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(
    () => [
      {
        accessorKey: "id",
        header: createHeaderColumn("Solicitação"),
        size: 130,
      },
      {
        accessorKey: "department",
        header: createHeaderColumn("Departamento"),
      },
      {
        id: "status",
        header: createHeaderColumn("Status"),
        size: 110,
        cell: ({ row }) => (
          <StockRequisitionStatusBadge
            status={row.original.status as any}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: createHeaderColumn("Emissão"),
        size: 110,
        cell: ({ row }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("pt-BR")
            : "-",
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable table={table} className="border-0 rounded-none" />
  );
}
