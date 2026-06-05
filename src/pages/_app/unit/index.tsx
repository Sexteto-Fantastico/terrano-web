import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";

import {
  fetchMeasurementUnits,
  deleteMeasurementUnit,
  restoreMeasurementUnit,
  type MeasurementUnit,
  type MeasurementUnitFilters,
} from "@/api/measurement-units";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";
import { getMeasurementUnitFilterConfig } from "./-components/measurement-unit-filter-config";
import { getMeasurementUnitTableColumns } from "./-components/measurement-unit-table-columns";

export const Route = createFileRoute("/_app/unit/")({
  component: MeasurementUnitPage,
  validateSearch: (): MeasurementUnitFilters => ({}),
  head: () => ({
    meta: [
      {
        title: "Unidades de Medida",
      },
    ],
  }),
});

function MeasurementUnitPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<PaginatedData<MeasurementUnit>>({
    queryKey: ["measurement-units", filters],
    queryFn: () => fetchMeasurementUnits(filters),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMeasurementUnit(id),
    onMutate: async (unitId) => {
      await queryClient.cancelQueries({ queryKey: ["measurement-units"] });
      const previousData = queryClient.getQueryData([
        "measurement-units",
        filters,
      ]);
      queryClient.setQueryData(["measurement-units", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((u: MeasurementUnit) =>
            u.id === unitId ? { ...u, isActive: false } : u
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _unitId, context) => {
      queryClient.setQueryData(
        ["measurement-units", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["measurement-units"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreMeasurementUnit(id),
    onMutate: async (unitId) => {
      await queryClient.cancelQueries({ queryKey: ["measurement-units"] });
      const previousData = queryClient.getQueryData([
        "measurement-units",
        filters,
      ]);
      queryClient.setQueryData(["measurement-units", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((u: MeasurementUnit) =>
            u.id === unitId ? { ...u, isActive: true } : u
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _unitId, context) => {
      queryClient.setQueryData(
        ["measurement-units", filters],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["measurement-units"] });
    },
  });

  function handleEdit(unitId: number) {
    navigate({
      to: "/unit/edit",
      search: { id: unitId.toString() },
    });
  }

  function handleToggleActive(unitId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(unitId);
    } else {
      deleteMutation.mutate(unitId);
    }
  }

  const columns = useMemo(
    () =>
      getMeasurementUnitTableColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [deleteMutation, restoreMutation]
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const filterConfig = useMemo(() => getMeasurementUnitFilterConfig(), []);

  return (
    <DataView>
      <DataTableFilterMenu
        filters={filters as any}
        onFilter={setTableFilters}
        onClearFilters={resetFilters}
        filterConfig={filterConfig}
      />
      <Separator className="my-4" />
      <DataTable
        table={table}
        isLoading={isLoading}
        getRowClassName={(row) =>
          row.original.isActive === false || row.original.deletedAt
            ? "line-through text-muted-foreground"
            : ""
        }
        actionBar={
          <DataTableToolbar table={table}>
            <AddButton to="/unit/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
