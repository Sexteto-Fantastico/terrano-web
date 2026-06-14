import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requirePermission } from "@/lib/route-guard";
import { type PaginatedData } from "@/components/ui/data-table/@types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";

import {
  fetchDepartments,
  deleteDepartment,
  restoreDepartment,
  type Department,
  type DepartmentFilters,
} from "@/api/departments";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { AddButton } from "@/components/button/add-button";
import { getDepartmentFilterConfig } from "./-components/department-filter-config";
import { getDepartmentTableColumns } from "./-components/department-table-columns";

export const Route = createFileRoute("/_app/department/")({
  component: DepartmentPage,
  beforeLoad: requirePermission("DEPARTMENT", "read"),
  validateSearch: (): DepartmentFilters => ({}),
  head: () => ({
    meta: [
      {
        title: "Departamentos",
      },
    ],
  }),
});

function DepartmentPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<PaginatedData<Department>>({
    queryKey: ["departments", filters],
    queryFn: () => fetchDepartments(filters),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDepartment(id),
    onMutate: async (departmentId) => {
      await queryClient.cancelQueries({ queryKey: ["departments"] });
      const previousData = queryClient.getQueryData(["departments", filters]);
      queryClient.setQueryData(["departments", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((d: Department) =>
            d.id === departmentId ? { ...d, isActive: false } : d
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _departmentId, context) => {
      queryClient.setQueryData(["departments", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreDepartment(id),
    onMutate: async (departmentId) => {
      await queryClient.cancelQueries({ queryKey: ["departments"] });
      const previousData = queryClient.getQueryData(["departments", filters]);
      queryClient.setQueryData(["departments", filters], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: old.result.map((d: Department) =>
            d.id === departmentId ? { ...d, isActive: true } : d
          ),
        };
      });
      return { previousData };
    },
    onError: (_err, _departmentId, context) => {
      queryClient.setQueryData(["departments", filters], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  function handleEdit(departmentId: number) {
    navigate({
      to: "/department/edit",
      search: { id: departmentId.toString() },
    });
  }

  function handleToggleActive(departmentId: number, value: boolean) {
    if (value) {
      restoreMutation.mutate(departmentId);
    } else {
      deleteMutation.mutate(departmentId);
    }
  }

  const columns = useMemo(
    () =>
      getDepartmentTableColumns({
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

  const filterConfig = useMemo(() => getDepartmentFilterConfig(), []);

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
            <AddButton to="/department/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} />
    </DataView>
  );
}
