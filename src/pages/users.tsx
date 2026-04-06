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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  MoreHorizontal,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";

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
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleView(user.id)}>
                  <EyeIcon className="size-4" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                  <SquarePenIcon className="size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2Icon className="size-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
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
