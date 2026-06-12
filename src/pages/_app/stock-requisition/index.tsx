import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { DataView } from "@/components/views/data-view";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { Separator } from "@/components/ui/separator";
import { AddButton } from "@/components/button/add-button";

import { useFilters } from "@/hooks/use-filters";
import { useDataTable } from "@/hooks/use-data-table";

import {
  deleteStockRequisition,
  fetchStockRequisitions,
  restoreStockRequisition,
  type StockRequisition,
  type StockRequisitionFilters,
} from "@/api/stock-requisition";

import { getStockRequisitionFilterConfig } from "./-components/stock-requisition-filter-config";
import { getStockRequisitionTableColumns } from "./-components/stock-requisition-table-columns";
import { StockRequisitionHistoryDialog } from "./-components/stock-requisition-history-dialog";

export const Route = createFileRoute("/_app/stock-requisition/")({
  component: StockRequisitionPage,
validateSearch: (search: Record<string, unknown>): StockRequisitionFilters => ({
  pageIndex: search.pageIndex ? Number(search.pageIndex) : undefined,
  pageSize: search.pageSize ? Number(search.pageSize) : undefined,
  status: search.status as StockRequisitionFilters["status"] | undefined,
  openOnly: search.openOnly !== undefined
    ? String(search.openOnly) as "true" | "false"
    : "true",
  activeOnly: search.activeOnly !== undefined
    ? String(search.activeOnly) as "true" | "false"
    : "true",
  startDate: search.startDate as string | undefined,
  endDate: search.endDate as string | undefined,
  period: search.period as { from?: string; to?: string } | undefined,
}),
});

function StockRequisitionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { filters, setFilters, resetFilters } = useFilters(Route.id);

  const [selectedRequisition, setSelectedRequisition] =
    useState<StockRequisition | undefined>(undefined);
  const [historyOpen, setHistoryOpen] = useState(false);
const queryKey = useMemo(
  () => [
    "stock-requisitions",
    filters.pageIndex,
    filters.pageSize,
    filters.status,
    filters.openOnly,
    filters.activeOnly,
    filters.startDate,
    filters.endDate,
    (filters as any).period,  
  ],
  [filters]
);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchStockRequisitions(filters),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStockRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-requisitions"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreStockRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-requisitions"] });
    },
  });

  function handleEdit(id: number) {
    navigate({
      to: "/stock-requisition/edit",
      search: { id: id.toString() },
    });
  }

  function handleToggleActive(
    requisition: StockRequisition,
    value: boolean
  ) {
    if (value) restoreMutation.mutate(requisition.id);
    else deleteMutation.mutate(requisition.id);
  }

  const handleHistory = useCallback((id: number) => {
    const requisition = data?.result.find((r) => r.id === id);
    setSelectedRequisition(requisition);
    setHistoryOpen(true);
  }, [data]);

  const columns = useMemo(
    () => getStockRequisitionTableColumns({ onEdit: handleEdit, onToggleActive: handleToggleActive, onHistory: handleHistory }),
    [handleHistory]
  );

  const { table } = useDataTable({
  data,
  columns,
  filters,
  setFilters,  
});

  const filterConfig = useMemo(
    () => getStockRequisitionFilterConfig(),
    []
  );

  return (
    <DataView>
      <DataTableFilterMenu
        filterConfig={filterConfig}
        isLoading={isLoading}
        filters={filters}
        onFilter={(newFilters) =>
          setFilters({
            ...newFilters,
            pageIndex: 0,
          })
        }
        onClearFilters={resetFilters}
      />

      <Separator className="my-4" />

      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) =>
          row.original.deletedAt
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/stock-requisition/new" />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />

      {selectedRequisition && (
        <StockRequisitionHistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          requisitionId={selectedRequisition.id}
        />
      )}
    </DataView>
  );
}