import { createFileRoute } from "@tanstack/react-router";
import { DataTableFilterMenu } from "@/components/ui/data-table/data-table-filter-menu";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useMemo } from "react";
import { fetchUsers, type User } from "@/api/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { Filters } from "@/components/ui/data-table/@types";
import { useDataTable } from "@/hooks/use-data-table";
import { Separator } from "@/components/ui/separator";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { AddButton } from "@/components/feature/shared/components/add-button";
import { ExportButton } from "@/components/feature/shared/components/export-button";
import { getUserTableColumns } from "./-components/user-table-columns";
import { userFilterConfig } from "./-components/user-filter-config";

export const Route = createFileRoute("/_app/user/")({
  component: UserPage,
  validateSearch: () => ({}) as Filters<User>,
  head: () => ({
    meta: [
      {
        title: "Usuários",
      },
    ],
  }),
});

function UserPage() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id);

  const { data, isLoading } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: keepPreviousData,
  });

  function handleView(userId: number) {
    console.log("Visualizar usuário", userId);
  }

  function handleEdit(userId: number) {
    console.log("Editar usuário", userId);
  }

  function handleDelete(userId: number) {
    console.log("Excluir usuário", userId);
  }

  function handleToggleActive(userId: number, value: boolean) {
    console.log("Toggle active usuário", userId, value);
  }

  const columns = useMemo(
    () =>
      getUserTableColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
      }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    filters,
    setFilters,
  });

  return (
    <DataView>
      <DataTableFilterMenu
        filterConfig={userFilterConfig}
        isLoading={isLoading}
        filters={filters}
        onFilter={setFilters}
        onClearFilters={resetFilters}
      />

      <Separator className="my-4" />

      <DataTable
        table={table}
        actionBar={
          <DataTableToolbar table={table}>
            <ExportButton />
            <AddButton />
          </DataTableToolbar>
        }
      />

      <DataTablePagination table={table} isLoading={isLoading} />
    </DataView>
  );
}
