import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EyeIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import {
  createActionColumn,
  createHeaderColumn,
} from "@/components/ui/data-table/data-table-helpers";
import { AddButton } from "@/components/button/add-button";
import { ExportButton } from "@/components/button/export-button";

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

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: createHeaderColumn("id"),
        meta: {
          filter: {
            label: "ID",
            variant: "number",
            placeholder: "Filtrar por ID",
          },
        },
      },
      {
        accessorKey: "name",
        header: createHeaderColumn("nome"),
        meta: {
          filter: {
            label: "Nome",
            variant: "text",
            placeholder: "Filtrar por nome",
          },
        },
      },
      {
        accessorKey: "email",
        header: createHeaderColumn("email"),
        meta: {
          filter: {
            label: "Email",
            variant: "text",
            placeholder: "Filtrar por email",
          },
        },
      },
      {
        accessorKey: "role",
        header: createHeaderColumn("função"),
        meta: {
          filter: {
            label: "Função",
            variant: "select",
            placeholder: "Selecione uma função",
            options: [
              { label: "Admin", value: "Admin" },
              { label: "User", value: "User" },
              { label: "Manager", value: "Manager" },
            ],
          },
        },
      },
      {
        accessorKey: "age",
        header: createHeaderColumn("idade"),
        meta: {
          filter: {
            label: "Idade",
            variant: "number",
            placeholder: "Filtrar por idade",
          },
        },
      },
      createActionColumn(({ row }) => {
        const user = row.original;

        return (
          <>
            <DropdownMenuItem onSelect={() => handleView(user.id)}>
              <EyeIcon className="me-2" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleEdit(user.id)}>
              <SquarePenIcon className="me-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => handleDelete(user.id)}
            >
              <Trash2Icon className="me-2" />
              Excluir
            </DropdownMenuItem>
          </>
        );
      }),
    ],
    []
  );

  const { table, setTableFilters } = useDataTable({
    data,
    columns,
    filters,
    setFilters,
  });

  return (
    <DataView>
      <DataTableFilterMenu
        table={table}
        isLoading={isLoading}
        filters={filters}
        onFilter={setTableFilters}
        onClearFilters={resetFilters}
      />
      <Separator className="my-4" />
      <DataTable
        table={table}
        actionBar={
          <DataTableToolbar table={table}>
            <ExportButton />
            <AddButton to="/user/new" />
          </DataTableToolbar>
        }
      />
      <DataTablePagination table={table} isLoading={isLoading} />
    </DataView>
  );
}
