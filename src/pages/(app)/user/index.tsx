import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useMemo } from "react";
import { fetchUsers, type User } from "@/api/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  EyeIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { DataView } from "@/components/views/data-view";
import { useTable } from "@/components/ui/data-table/use-table";
import { useSearchQueryState } from "@/hooks/use-search-query-state";
import { createActionColumn } from "@/components/ui/data-table/data-table-helpers";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";

export const Route = createFileRoute("/(app)/user/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Usuários",
      },
    ],
  }),
});

function RouteComponent() {
  const { search } = useSearchQueryState({ searchKey: "users" });

  const { data, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => fetchUsers({ search }),
    placeholderData: keepPreviousData,
  });

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        meta: {
          variant: "number",
        },
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

  function handleView(userId: number) {
    console.log("Visualizar usuário", userId);
  }

  function handleEdit(userId: number) {
    console.log("Editar usuário", userId);
  }

  function handleDelete(userId: number) {
    console.log("Excluir usuário", userId);
  }

  const { table, loading } = useTable({
    data: data ?? [],
    columns,
    loading: isLoading,
    name: "users",
    pageSize: 10,
  });

  return (
    <DataView>
      <DataTableToolbar table={table} />
      <DataTable table={table} loading={loading} />
    </DataView>
  );
}
