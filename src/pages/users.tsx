import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import DataTable, {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  type Filters,
} from "@/components/data-table";
import { useFilters } from "@/hooks/use-filters";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { useMemo } from "react";
import { fetchUsers, type User } from "@/api/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
  validateSearch: () => ({}) as Filters<User>,
  head: () => ({
    meta: [
      {
        title: "Usuários",
      },
    ],
  }),
});

function RouteComponent() {
  const { filters, setFilters } = useFilters(Route.fullPath);
  const sorting = sortByToState(filters.sortBy);
  const pagination = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  };

  const { data } = useQuery({
    queryKey: ["user", filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: keepPreviousData,
  });

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Nome",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Função",
      },
      {
        accessorKey: "age",
        header: "Idade",
      },
    ],
    []
  );

  return (
    <div className="flex h-screen flex-col">
      <h1 className="mb-6 text-2xl font-bold">Usuários</h1>
      <DynamicBreadcrumb />

      <div className="flex-1 overflow-auto p-6">
        <DataTable
          data={data ?? []}
          columns={columns}
          pagination={pagination}
          paginationOptions={{
            onPaginationChange: (updater) => {
              const newPagination =
                typeof updater === "function" ? updater(pagination) : updater;
              setFilters({
                pageIndex: newPagination.pageIndex,
                pageSize: newPagination.pageSize,
              });
            },
          }}
          sorting={sorting}
          onSortingChange={(updater) => {
            const newSorting =
              typeof updater === "function" ? updater(sorting) : updater;

            return setFilters({ sortBy: stateToSortBy(newSorting) });
          }}
        />
      </div>
    </div>
  );
}
